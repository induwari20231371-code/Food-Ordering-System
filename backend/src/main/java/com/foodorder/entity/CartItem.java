package com.foodorder.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * CartItem entity - Many-to-One with Cart and FoodItem.
 * Represents a food item and its quantity inside a cart.
 */
@Entity
@Table(name = "cart_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many-to-One: Many cart items belong to one cart
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Cart cart;

    // Many-to-One: Many cart items can reference the same food item
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "food_item_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private FoodItem foodItem;

    @Column(nullable = false)
    private Integer quantity;

    /**
     * Calculates subtotal for this cart item.
     */
    public BigDecimal getSubtotal() {
        return foodItem.getPrice().multiply(BigDecimal.valueOf(quantity));
    }
}