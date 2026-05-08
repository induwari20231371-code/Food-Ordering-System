package com.foodorder.service;

import com.foodorder.entity.Payment;
import com.foodorder.enums.PaymentStatus;
import com.foodorder.exception.BusinessException;
import com.foodorder.exception.ResourceNotFoundException;
import com.foodorder.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Service for payment processing.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", id));
    }

    public Payment getPaymentByOrderId(Long orderId) {
        return paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order: " + orderId));
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    /**
     * Simulates processing a payment. In production, this would integrate
     * with a payment gateway (Stripe, PayHere, PayPal, etc.).
     */
    @Transactional
    public Payment processPayment(Long orderId) {
        log.info("Processing payment for order {}", orderId);

        Payment payment = getPaymentByOrderId(orderId);

        if (payment.getStatus() == PaymentStatus.COMPLETED) {
            throw new BusinessException("Payment has already been completed for order: " + orderId);
        }

        if (payment.getStatus() == PaymentStatus.FAILED) {
            throw new BusinessException("Payment has already failed for order: " + orderId);
        }

        // Simulate payment processing (replace with real gateway in production)
        try {
            // Simulate a successful payment
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setTransactionId("TXN-" + UUID.randomUUID().toString().toUpperCase().substring(0, 8));
            payment.setPaidAt(LocalDateTime.now());
            log.info("Payment completed for order {}. Transaction: {}", orderId, payment.getTransactionId());
        } catch (Exception e) {
            payment.setStatus(PaymentStatus.FAILED);
            log.error("Payment failed for order {}: {}", orderId, e.getMessage());
        }

        return paymentRepository.save(payment);
    }

    /**
     * Marks a payment as failed (e.g., after gateway timeout).
     */
    @Transactional
    public Payment failPayment(Long orderId) {
        log.warn("Marking payment as failed for order {}", orderId);
        Payment payment = getPaymentByOrderId(orderId);
        payment.setStatus(PaymentStatus.FAILED);
        return paymentRepository.save(payment);
    }
}