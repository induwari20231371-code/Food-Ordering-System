package com.foodorder.exception;

/**
 * Thrown when a business rule or constraint is violated.
 * Examples: ordering out-of-stock item, cancelling delivered order.
 */
public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}