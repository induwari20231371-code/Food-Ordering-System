package com.foodorder.dto;

import com.foodorder.enums.FoodItemStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

/**
 * Request DTO for creating/updating a food item.
 */
@Data
public class FoodItemRequest {

    @NotBlank(message = "Food item name is required")
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;

    private String imageUrl;

    private FoodItemStatus status = FoodItemStatus.AVAILABLE;

    @NotNull(message = "Category ID is required")
    private Long categoryId;
}