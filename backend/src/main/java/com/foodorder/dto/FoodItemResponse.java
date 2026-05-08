package com.foodorder.dto;

import com.foodorder.enums.FoodItemStatus;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Response DTO for food item data.
 */
@Data
public class FoodItemResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private FoodItemStatus status;
    private Long categoryId;
    private String categoryName;
    private LocalDateTime createdAt;
}