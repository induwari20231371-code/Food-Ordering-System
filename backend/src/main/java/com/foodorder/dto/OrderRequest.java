package com.foodorder.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Request DTO for placing an order (checkout from cart).
 */
@Data
public class OrderRequest {

    @NotBlank(message = "Delivery address is required")
    private String deliveryAddress;

    private String specialInstructions;

    private String paymentMethod = "CASH_ON_DELIVERY";
}