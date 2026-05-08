package com.foodorder.controller;

import com.foodorder.dto.ApiResponse;
import com.foodorder.dto.CartItemRequest;
import com.foodorder.entity.Cart;
import com.foodorder.entity.CartItem;
import com.foodorder.entity.User;
import com.foodorder.service.CartService;
import com.foodorder.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Cart Controller - customer cart operations.
 */
@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('CUSTOMER')")
public class CartController {

    private final CartService cartService;
    private final UserService userService;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<ApiResponse<CartResponse>> getCart(Authentication authentication) {
	Long userId = currentUserId(authentication);
	return ResponseEntity.ok(ApiResponse.success(toResponse(cartService.getCartByUserId(userId))));
    }

    @PostMapping("/items")
    @Transactional
    public ResponseEntity<ApiResponse<CartResponse>> addItemToCart(
	    Authentication authentication,
	    @Valid @RequestBody CartItemRequest request) {
	Long userId = currentUserId(authentication);
	log.info("POST /api/cart/items - user: {}, foodItem: {}", userId, request.getFoodItemId());
	return ResponseEntity.ok(ApiResponse.success("Item added to cart successfully",
		toResponse(cartService.addItemToCart(userId, request))));
    }

    @PutMapping("/items/{cartItemId}")
    @Transactional
    public ResponseEntity<ApiResponse<CartResponse>> updateCartItem(
	    Authentication authentication,
	    @PathVariable Long cartItemId,
	    @RequestParam Integer quantity) {
	Long userId = currentUserId(authentication);
	log.info("PUT /api/cart/items/{} - user: {}, quantity: {}", cartItemId, userId, quantity);
	return ResponseEntity.ok(ApiResponse.success("Cart item updated successfully",
		toResponse(cartService.updateCartItem(userId, cartItemId, quantity))));
    }

    @DeleteMapping("/items/{cartItemId}")
    @Transactional
    public ResponseEntity<ApiResponse<CartResponse>> removeItemFromCart(
	    Authentication authentication,
	    @PathVariable Long cartItemId) {
	Long userId = currentUserId(authentication);
	log.info("DELETE /api/cart/items/{} - user: {}", cartItemId, userId);
	return ResponseEntity.ok(ApiResponse.success("Item removed from cart successfully",
		toResponse(cartService.removeItemFromCart(userId, cartItemId))));
    }

    @DeleteMapping
    @Transactional
    public ResponseEntity<ApiResponse<CartResponse>> clearCart(Authentication authentication) {
	Long userId = currentUserId(authentication);
	log.info("DELETE /api/cart - user: {}", userId);
	return ResponseEntity.ok(ApiResponse.success("Cart cleared successfully",
		toResponse(cartService.clearCart(userId))));
    }

    private Long currentUserId(Authentication authentication) {
	User user = userService.getUserByEmail(authentication.getName());
	return user.getId();
    }

    private CartResponse toResponse(Cart cart) {
	return new CartResponse(
		cart.getId(),
		cart.getUser() != null ? cart.getUser().getId() : null,
		cart.getCartItems().stream().map(this::toResponse).collect(Collectors.toList()),
		cart.getTotalAmount(),
		cart.getCreatedAt(),
		cart.getUpdatedAt()
	);
    }

    private CartItemResponse toResponse(CartItem cartItem) {
	return new CartItemResponse(
		cartItem.getId(),
		cartItem.getFoodItem().getId(),
		cartItem.getFoodItem().getName(),
		cartItem.getFoodItem().getPrice(),
		cartItem.getQuantity(),
		cartItem.getSubtotal()
	);
    }

    private record CartResponse(
	    Long id,
	    Long userId,
	    List<CartItemResponse> items,
	    BigDecimal totalAmount,
	    LocalDateTime createdAt,
	    LocalDateTime updatedAt
    ) {
    }

    private record CartItemResponse(
	    Long id,
	    Long foodItemId,
	    String foodItemName,
	    BigDecimal unitPrice,
	    Integer quantity,
	    BigDecimal subtotal
    ) {
    }
}
