package com.foodorder.service;

import com.foodorder.dto.CategoryRequest;
import com.foodorder.entity.Category;
import com.foodorder.entity.FoodItem;
import com.foodorder.enums.FoodItemStatus;
import com.foodorder.exception.DuplicateResourceException;
import com.foodorder.exception.ResourceNotFoundException;
import com.foodorder.repository.CartItemRepository;
import com.foodorder.repository.CategoryRepository;
import com.foodorder.repository.FoodItemRepository;
import com.foodorder.repository.OrderItemRepository;
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

        // Get ALL food items in this category (including previously soft-deleted ones)
        List<FoodItem> allItems = foodItemRepository.findByCategoryId(id);
        for (FoodItem item : allItems) {
            // Step 1: Remove from any active carts first (FK constraint)
            cartItemRepository.deleteAllByFoodItemId(item.getId());

            // Step 2: Nullify the FK in order_items to preserve order history
            orderItemRepository.nullifyFoodItemReference(item.getId());

            // Step 3: Detach food item from category so category can be deleted
            item.setCategory(null);
            item.setDeleted(true);
            item.setStatus(FoodItemStatus.OUT_OF_STOCK);
        }
        if (!allItems.isEmpty()) {
            foodItemRepository.saveAll(allItems);
            foodItemRepository.flush(); // ensure FK is cleared before category delete
        }

        categoryRepository.delete(category);
        log.info("Category {} deleted successfully", id);
    }
}