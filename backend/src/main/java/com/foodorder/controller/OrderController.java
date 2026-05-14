package com.foodorder.controller;

import com.foodorder.dto.ApiResponse;
import com.foodorder.dto.OrderRequest;
import com.foodorder.entity.FoodItem;
import com.foodorder.entity.Order;
import com.foodorder.entity.OrderItem;
import com.foodorder.entity.Payment;
import com.foodorder.entity.User;
import com.foodorder.enums.OrderStatus;
import com.foodorder.exception.BusinessException;
import com.foodorder.service.OrderService;
import com.foodorder.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
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
 * Order Controller - customer checkout and admin order management.
 */
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Slf4j
public class OrderController {

	private final OrderService orderService;
	private final UserService userService;

	@PostMapping
	@PreAuthorize("hasRole('CUSTOMER')")
	@Transactional
	public ResponseEntity<ApiResponse<OrderResponse>> placeOrder(
			Authentication authentication,
			@Valid @RequestBody OrderRequest request) {
		Long userId = currentUserId(authentication);
		log.info("POST /api/orders - user: {}", userId);
		Order order = orderService.placeOrder(userId, request);
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(ApiResponse.success("Order placed successfully", toResponse(order)));
	}

	@GetMapping
	@Transactional(readOnly = true)
	public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrders(Authentication authentication) {
		if (isAdmin(authentication)) {
			return ResponseEntity.ok(ApiResponse.success(
					orderService.getAllOrders().stream().map(this::toResponse).collect(Collectors.toList())
			));
		}

		Long userId = currentUserId(authentication);
		return ResponseEntity.ok(ApiResponse.success(
				orderService.getOrdersByUser(userId).stream().map(this::toResponse).collect(Collectors.toList())
		));
	}

	@GetMapping("/{orderId}")
	@Transactional(readOnly = true)
	public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(
			Authentication authentication,
			@PathVariable Long orderId) {
		Order order = orderService.getOrderById(orderId);
		ensureOrderAccess(authentication, order);
		return ResponseEntity.ok(ApiResponse.success(toResponse(order)));
	}

	@PutMapping("/{orderId}/status")
	@PreAuthorize("hasRole('ADMIN')")
	@Transactional
	public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
			@PathVariable Long orderId,
			@RequestParam OrderStatus status) {
		log.info("PUT /api/orders/{}/status - status: {}", orderId, status);
		return ResponseEntity.ok(ApiResponse.success("Order status updated successfully",
				toResponse(orderService.updateOrderStatus(orderId, status))));
	}

	@PostMapping("/{orderId}/cancel")
	@PreAuthorize("hasRole('CUSTOMER')")
	@Transactional
	public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(
			Authentication authentication,
			@PathVariable Long orderId) {
		Long userId = currentUserId(authentication);
		Order order = orderService.getOrderById(orderId);
		ensureOrderAccess(authentication, order);

		if (!order.getUser().getId().equals(userId)) {
			throw new BusinessException("Order does not belong to you");
		}

		return ResponseEntity.ok(ApiResponse.success("Order cancelled successfully",
				toResponse(orderService.cancelOrder(orderId, userId))));
	}

	private void ensureOrderAccess(Authentication authentication, Order order) {
		if (!isAdmin(authentication)) {
			Long userId = currentUserId(authentication);
			if (!order.getUser().getId().equals(userId)) {
				throw new BusinessException("Order does not belong to you");
			}
		}
	}

	private boolean isAdmin(Authentication authentication) {
		return authentication.getAuthorities().stream()
				.anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()));
	}

	private Long currentUserId(Authentication authentication) {
		User user = userService.getUserByEmail(authentication.getName());
		return user.getId();
	}

	private OrderResponse toResponse(Order order) {
		return new OrderResponse(
				order.getId(),
				order.getUser() != null ? order.getUser().getId() : null,
				order.getStatus() != null ? order.getStatus().name() : null,
				order.getTotalAmount(),
				order.getDeliveryAddress(),
				order.getSpecialInstructions(),
				order.getOrderItems().stream().map(this::toResponse).collect(Collectors.toList()),
				order.getPayment() != null ? toResponse(order.getPayment()) : null,
				order.getCreatedAt(),
				order.getUpdatedAt()
		);
	}

	private OrderItemResponse toResponse(OrderItem orderItem) {
		FoodItem fi = orderItem.getFoodItem();
		Long foodItemId = fi != null ? fi.getId() : null;
		String foodItemName = fi != null ? fi.getName()
				: (orderItem.getFoodItemName() != null && !orderItem.getFoodItemName().isBlank()
					? orderItem.getFoodItemName() : "Removed item");
		return new OrderItemResponse(
				orderItem.getId(),
				foodItemId,
				foodItemName,
				orderItem.getQuantity(),
				orderItem.getUnitPrice(),
				orderItem.getUnitPrice().multiply(BigDecimal.valueOf(orderItem.getQuantity()))
		);
	}

	private PaymentResponse toResponse(Payment payment) {
		return new PaymentResponse(
				payment.getId(),
				payment.getOrder() != null ? payment.getOrder().getId() : null,
				payment.getAmount(),
				payment.getStatus() != null ? payment.getStatus().name() : null,
				payment.getPaymentMethod(),
				payment.getTransactionId(),
				payment.getPaidAt(),
				payment.getCreatedAt()
		);
	}

	private record OrderResponse(
			Long id,
			Long userId,
			String status,
			BigDecimal totalAmount,
			String deliveryAddress,
			String specialInstructions,
			List<OrderItemResponse> items,
			PaymentResponse payment,
			LocalDateTime createdAt,
			LocalDateTime updatedAt
	) {
	}

	private record OrderItemResponse(
			Long id,
			Long foodItemId,
			String foodItemName,
			Integer quantity,
			BigDecimal unitPrice,
			BigDecimal subtotal
	) {
	}

	private record PaymentResponse(
			Long id,
			Long orderId,
			BigDecimal amount,
			String status,
			String paymentMethod,
			String transactionId,
			LocalDateTime paidAt,
			LocalDateTime createdAt
	) {
	}
}
