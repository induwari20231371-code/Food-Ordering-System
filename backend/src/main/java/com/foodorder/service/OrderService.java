package com.foodorder.service;

import com.foodorder.dto.OrderRequest;
import com.foodorder.entity.*;
import com.foodorder.enums.OrderStatus;
import com.foodorder.enums.PaymentStatus;
import com.foodorder.exception.BusinessException;
import com.foodorder.exception.ResourceNotFoundException;
import com.foodorder.repository.OrderRepository;
import com.foodorder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for placing and managing orders.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CartService cartService;

    /**
     * Places an order from the user's current cart contents.
     */
    @Transactional
    public Order placeOrder(Long userId, OrderRequest request) {
        log.info("Placing order for user {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        Cart cart = cartService.getCartByUserId(userId);

        // Validate cart is not empty
        if (cart.getCartItems().isEmpty()) {
            throw new BusinessException("Cannot place order with an empty cart");
        }

        // Build order
        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.PLACED)
                .totalAmount(cart.getTotalAmount())
                .deliveryAddress(request.getDeliveryAddress())
                .specialInstructions(request.getSpecialInstructions())
                .build();

        // Convert cart items to order items (snapshot prices)
        List<OrderItem> orderItems = cart.getCartItems().stream().map(cartItem -> OrderItem.builder()
                .order(order)
                .foodItem(cartItem.getFoodItem())
                .foodItemName(cartItem.getFoodItem().getName())
                .quantity(cartItem.getQuantity())
                .unitPrice(cartItem.getFoodItem().getPrice())
                .build()
        ).collect(Collectors.toList());

        order.setOrderItems(orderItems);

        // Create pending payment
        Payment payment = Payment.builder()
                .order(order)
                .amount(cart.getTotalAmount())
                .status(PaymentStatus.PENDING)
                .paymentMethod(request.getPaymentMethod())
                .build();

        order.setPayment(payment);

        Order savedOrder = orderRepository.save(order);

        // Clear cart after successful order placement
        cartService.clearCart(userId);

        log.info("Order {} placed successfully for user {}", savedOrder.getId(), userId);
        return savedOrder;
    }

    /**
     * Gets all orders for a specific customer.
     */
    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Gets a specific order by ID.
     */
    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", orderId));
    }

    /**
     * Gets all orders (admin only).
     */
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    /**
     * Updates the status of an order (admin only).
     */
    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatus newStatus) {
        log.info("Updating order {} status to {}", orderId, newStatus);
        Order order = getOrderById(orderId);

        // Business rule: cannot revert to PLACED from a later status
        if (order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.CANCELLED) {
            throw new BusinessException("Cannot update a " + order.getStatus() + " order");
        }

        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    /**
     * Cancels an order. Only PLACED orders can be cancelled by a customer.
     */
    @Transactional
    public Order cancelOrder(Long orderId, Long userId) {
        log.info("Cancelling order {} for user {}", orderId, userId);
        Order order = getOrderById(orderId);

        // Ensure order belongs to the requesting user
        if (!order.getUser().getId().equals(userId)) {
            throw new BusinessException("Order does not belong to you");
        }

        if (order.getStatus() != OrderStatus.PLACED) {
            throw new BusinessException("Only PLACED orders can be cancelled. Current status: " + order.getStatus());
        }

        order.setStatus(OrderStatus.CANCELLED);
        return orderRepository.save(order);
    }
}