package com.foodorder.repository;

import com.foodorder.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartIdAndFoodItemId(Long cartId, Long foodItemId);
    void deleteByCartId(Long cartId);

    List<CartItem> findByFoodItem_Id(Long foodItemId);

    @Query("SELECT DISTINCT c.cart.id FROM CartItem c WHERE c.foodItem.category.id = :categoryId")
    List<Long> findDistinctCartIdsByCategoryId(@Param("categoryId") Long categoryId);

    @Modifying
    @Query("DELETE FROM CartItem c WHERE c.foodItem.id = :foodItemId")
    void deleteAllByFoodItemId(@Param("foodItemId") Long foodItemId);

    @Modifying
    @Query("DELETE FROM CartItem c WHERE c.foodItem.category.id = :categoryId")
    void deleteAllByFoodItemCategoryId(@Param("categoryId") Long categoryId);
}