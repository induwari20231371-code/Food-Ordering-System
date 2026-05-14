package com.foodorder.repository;

import com.foodorder.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Modifying
    @Query("UPDATE OrderItem o SET o.foodItem = null WHERE o.foodItem.id = :foodItemId")
    void nullifyFoodItemReference(@Param("foodItemId") Long foodItemId);
}