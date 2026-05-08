package com.foodorder.controller;

import com.foodorder.dto.ApiResponse;
import com.foodorder.entity.Order;
import com.foodorder.entity.Payment;
import com.foodorder.entity.User;
import com.foodorder.exception.BusinessException;
import com.foodorder.service.OrderService;
import com.foodorder.service.PaymentService;
import com.foodorder.service.UserService;
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
 * Payment Controller - payment tracking and simulated processing.
 */
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

	private final PaymentService paymentService;
	private final OrderService orderService;
	private final UserService userService;

	@GetMapping
	@PreAuthorize("hasRole('ADMIN')")
	@Transactional(readOnly = true)
	public ResponseEntity<ApiResponse<List<PaymentResponse>>> getAllPayments() {
		return ResponseEntity.ok(ApiResponse.success(
				paymentService.getAllPayments().stream().map(this::toResponse).collect(Collectors.toList())
		));
	}

	@GetMapping("/{paymentId}")
	@Transactional(readOnly = true)
	public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentById(
			Authentication authentication,
			@PathVariable Long paymentId) {
		Payment payment = paymentService.getPaymentById(paymentId);
		ensurePaymentAccess(authentication, payment);
		return ResponseEntity.ok(ApiResponse.success(toResponse(payment)));
	}

	@GetMapping("/order/{orderId}")
	@Transactional(readOnly = true)
	public ResponseEntity<ApiResponse<PaymentResponse>> getPaymentByOrderId(
			Authentication authentication,
			@PathVariable Long orderId) {
		Payment payment = paymentService.getPaymentByOrderId(orderId);
		ensurePaymentAccess(authentication, payment);
		return ResponseEntity.ok(ApiResponse.success(toResponse(payment)));
	}

	@PostMapping("/order/{orderId}/process")
	@Transactional
	public ResponseEntity<ApiResponse<PaymentResponse>> processPayment(
			Authentication authentication,
			@PathVariable Long orderId) {
		ensureOrderAccess(authentication, orderId);
		log.info("POST /api/payments/order/{}/process", orderId);
		return ResponseEntity.ok(ApiResponse.success("Payment processed successfully",
				toResponse(paymentService.processPayment(orderId))));
	}

	@PostMapping("/order/{orderId}/fail")
	@PreAuthorize("hasRole('ADMIN')")
	@Transactional
	public ResponseEntity<ApiResponse<PaymentResponse>> failPayment(@PathVariable Long orderId) {
		log.warn("POST /api/payments/order/{}/fail", orderId);
		return ResponseEntity.ok(ApiResponse.success("Payment marked as failed",
				toResponse(paymentService.failPayment(orderId))));
	}

	private void ensureOrderAccess(Authentication authentication, Long orderId) {
		if (isAdmin(authentication)) {
			return;
		}

		Long userId = currentUserId(authentication);
		Order order = orderService.getOrderById(orderId);
		if (!order.getUser().getId().equals(userId)) {
			throw new BusinessException("Order does not belong to you");
		}
	}

	private void ensurePaymentAccess(Authentication authentication, Payment payment) {
		if (isAdmin(authentication)) {
			return;
		}

		Long userId = currentUserId(authentication);
		if (!payment.getOrder().getUser().getId().equals(userId)) {
			throw new BusinessException("Payment does not belong to you");
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
