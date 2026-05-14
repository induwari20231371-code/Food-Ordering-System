package com.foodorder.service;

import com.foodorder.dto.CartItemRequest;
import com.foodorder.entity.*;
import com.foodorder.enums.FoodItemStatus;
import com.foodorder.exception.BusinessException;
import com.foodorder.exception.ResourceNotFoundException;
import com.foodorder.repository.CartItemRepository;
import com.foodorder.repository.CartRepository;
import com.foodorder.repository.FoodItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Service for cart operations: add, update, remove items, and clear cart.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final FoodItemRepository foodItemRepository;

    /**
     * Gets the cart for a given user, or creates one if it doesn't exist.
     */
    public Cart getCartByUserId(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user: " + userId));
    }

    /**
     * Adds a food item to the cart. If already present, increases quantity.
     */
    @Transactional
    public Cart addItemToCart(Long userId, CartItemRequest request) {
        log.info("Adding food item {} to cart for user {}", request.getFoodItemId(), userId);

        Cart cart = getCartByUserId(userId);
        FoodItem foodItem = foodItemRepository.findById(request.getFoodItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Food item", request.getFoodItemId()));

        if (foodItem.isDeleted()) {
            throw new BusinessException("This food item is no longer available.");
        }

        // Check if item is available
        if (foodItem.getStatus() == FoodItemStatus.OUT_OF_STOCK) {
            throw new BusinessException("Food item is out of stock: " + foodItem.getName());
        }

        // Check if item already exists in cart
        Optional<CartItem> existingItem = cartItemRepository
                .findByCartIdAndFoodItemId(cart.getId(), foodItem.getId());

        if (existingItem.isPresent()) {
            // Update quantity
            CartItem cartItem = existingItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
            cartItemRepository.save(cartItem);
        } else {
            // Add new cart item
            CartItem cartItem = CartItem.builder()
                    .cart(cart)
                    .foodItem(foodItem)
                    .quantity(request.getQuantity())
                    .build();
            cart.getCartItems().add(cartItem);
        }

        cart.recalculateTotal();
        return cartRepository.save(cart);
    }

    /**
     * Updates the quantity of a specific cart item.
     */
    @Transactional
    public Cart updateCartItem(Long userId, Long cartItemId, Integer quantity) {
        log.info("Updating cart item {} for user {}", cartItemId, userId);
        Cart cart = getCartByUserId(userId);

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item", cartItemId));

        // Ensure cart item belongs to this user's cart
        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new BusinessException("Cart item does not belong to your cart");
        }

        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);

        cart.recalculateTotal();
        return cartRepository.save(cart);
    }

    /**
     * Removes a specific item from the cart.
     */
    @Transactional
    public Cart removeItemFromCart(Long userId, Long cartItemId) {
        log.info("Removing cart item {} for user {}", cartItemId, userId);
        Cart cart = getCartByUserId(userId);

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item", cartItemId));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new BusinessException("Cart item does not belong to your cart");
        }

        cart.getCartItems().remove(cartItem);
        cartItemRepository.delete(cartItem);

        cart.recalculateTotal();
        return cartRepository.save(cart);
    }

    /**
     * Clears all items from the cart.
     */
    @Transactional
    public Cart clearCart(Long userId) {
        log.info("Clearing cart for user {}", userId);
        Cart cart = getCartByUserId(userId);
        cart.getCartItems().clear();
        cartItemRepository.deleteByCartId(cart.getId());
        cart.recalculateTotal();
        return cartRepository.save(cart);
    }
}