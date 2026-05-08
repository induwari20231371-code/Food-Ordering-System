package com.foodorder.repository;

import com.foodorder.entity.FoodItem;
import com.foodorder.enums.FoodItemStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {
    List<FoodItem> findByCategoryId(Long categoryId);
    List<FoodItem> findByStatus(FoodItemStatus status);
    List<FoodItem> findByCategoryIdAndStatus(Long categoryId, FoodItemStatus status);
    List<FoodItem> findByNameContainingIgnoreCase(String name);
}