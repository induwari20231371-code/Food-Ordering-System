package com.foodorder.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * OrderItem entity - Many-to-One with Order and FoodItem.
 * Snapshot of a food item at the time of ordering (price stored separately).
 */
@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many-to-One: Many order items belong to one order
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Order order;

    // Many-to-One: optional after menu item is removed; name snapshot keeps history readable
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "food_item_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private FoodItem foodItem;

    /** Snapshot of the food name at order time (required when foodItem is cleared after menu delete). */
    @Column(name = "food_item_name", length = 255)
    private String foodItemName;

    @Column(nullable = false)
    private Integer quantity;

    // Price at time of order (in case food item price changes later)
    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    /**
     * Calculates subtotal for this order item.
     */
    public BigDecimal getSubtotal() {
        return unitPrice.multiply(BigDecimal.valueOf(quantity));
    }
}