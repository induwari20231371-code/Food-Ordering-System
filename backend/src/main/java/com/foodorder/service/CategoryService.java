package com.foodorder.service;

import com.foodorder.dto.CategoryRequest;
import com.foodorder.entity.Category;
import com.foodorder.enums.FoodItemStatus;
import com.foodorder.exception.DuplicateResourceException;
import com.foodorder.exception.ResourceNotFoundException;
import com.foodorder.repository.CartItemRepository;
import com.foodorder.repository.CartRepository;
import com.foodorder.repository.CategoryRepository;
import com.foodorder.repository.FoodItemRepository;
import com.foodorder.repository.OrderItemRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final FoodItemRepository foodItemRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final EntityManager entityManager;

    public List<Category> getAllCategories() {
        log.debug("Fetching all categories");
        return categoryRepository.findAll();
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", id));
    }

    @Transactional
    public Category createCategory(CategoryRequest request) {
        log.info("Creating category: {}", request.getName());
        if (categoryRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("Category already exists: " + request.getName());
        }
        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .build();
        return categoryRepository.save(category);
    }

    @Transactional
    public Category updateCategory(Long id, CategoryRequest request) {
        log.info("Updating category id: {}", id);
        Category category = getCategoryById(id);
        category.setName(request.getName());
        if (request.getDescription() != null) {
            category.setDescription(request.getDescription());
        }
        if (request.getImageUrl() != null) {
            category.setImageUrl(request.getImageUrl());
        }
        return categoryRepository.save(category);
    }

    @Transactional
    public void deleteCategory(Long id) {
        log.info("Deleting category id: {}", id);
        Category category = getCategoryById(id);

        List<Long> affectedCartIds = cartItemRepository.findDistinctCartIdsByCategoryId(id);

        // Remove cart lines that still reference items in this category
        cartItemRepository.deleteAllByFoodItemCategoryId(id);

        // Preserve order history by clearing food item references
        orderItemRepository.nullifyFoodItemReferenceByCategoryId(id);

        // Detach all food items from this category and soft-delete them
        int updatedCount = foodItemRepository.detachCategoryAndSoftDeleteByCategoryId(id, FoodItemStatus.OUT_OF_STOCK);
        if (updatedCount > 0) {
            log.debug("Detached {} food items from category {}", updatedCount, id);
        }
        entityManager.flush();

        // Recalculate totals for carts affected by deleted category items
        for (Long cartId : affectedCartIds) {
            cartRepository.findById(cartId).ifPresent(cart -> {
                entityManager.refresh(cart);
                cart.recalculateTotal();
                cartRepository.save(cart);
            });
        }

        categoryRepository.delete(category);
        log.info("Category {} deleted successfully", id);
    }
}