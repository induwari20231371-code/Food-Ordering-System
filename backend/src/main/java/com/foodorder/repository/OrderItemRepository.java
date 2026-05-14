package com.foodorder.repository;

import com.foodorder.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    /**
     * Clears FK to food_items and keeps a name snapshot on each line (MySQL).
     * Must run while the food row still exists (uses JOIN to copy the name).
     */
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = """
            UPDATE order_items oi
            INNER JOIN food_items fi ON fi.id = oi.food_item_id
            SET oi.food_item_name = COALESCE(NULLIF(TRIM(oi.food_item_name), ''), fi.name),
                oi.food_item_id = NULL
            WHERE oi.food_item_id = :foodItemId
            """, nativeQuery = true)
    void detachAllLinesFromFoodItem(@Param("foodItemId") Long foodItemId);
}
