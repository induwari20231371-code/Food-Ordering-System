package com.foodorder.repository;

import com.foodorder.entity.FoodItem;
import com.foodorder.enums.FoodItemStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {
    List<FoodItem> findByDeletedFalse();

    List<FoodItem> findByCategoryIdAndDeletedFalse(Long categoryId);

    List<FoodItem> findByStatusAndDeletedFalse(FoodItemStatus status);

    List<FoodItem> findByCategoryIdAndStatusAndDeletedFalse(Long categoryId, FoodItemStatus status);

    List<FoodItem> findByNameContainingIgnoreCaseAndDeletedFalse(String name);
}
