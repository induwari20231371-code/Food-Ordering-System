package com.foodorder.service;

import com.foodorder.dto.FoodItemRequest;
import com.foodorder.dto.FoodItemResponse;
import com.foodorder.entity.Category;
import com.foodorder.entity.FoodItem;
import com.foodorder.enums.FoodItemStatus;
import com.foodorder.exception.ResourceNotFoundException;
import com.foodorder.repository.CategoryRepository;
import com.foodorder.repository.FoodItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for food item CRUD operations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class FoodItemService {

    private final FoodItemRepository foodItemRepository;
    private final CategoryRepository categoryRepository;

    public List<FoodItemResponse> getAllFoodItems() {
        return foodItemRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public FoodItemResponse getFoodItemById(Long id) {
        return mapToResponse(findById(id));
    }

    public List<FoodItemResponse> getFoodItemsByCategory(Long categoryId) {
        return foodItemRepository.findByCategoryId(categoryId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<FoodItemResponse> getAvailableFoodItems() {
        return foodItemRepository.findByStatus(FoodItemStatus.AVAILABLE).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<FoodItemResponse> searchFoodItems(String name) {
        return foodItemRepository.findByNameContainingIgnoreCase(name).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public FoodItemResponse createFoodItem(FoodItemRequest request) {
        log.info("Creating food item: {}", request.getName());
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", request.getCategoryId()));

        FoodItem foodItem = FoodItem.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .status(request.getStatus() != null ? request.getStatus() : FoodItemStatus.AVAILABLE)
                .category(category)
                .build();

        return mapToResponse(foodItemRepository.save(foodItem));
    }

    @Transactional
    public FoodItemResponse updateFoodItem(Long id, FoodItemRequest request) {
        log.info("Updating food item id: {}", id);
        FoodItem foodItem = findById(id);

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", request.getCategoryId()));

        foodItem.setName(request.getName());
        foodItem.setDescription(request.getDescription());
        foodItem.setPrice(request.getPrice());
        foodItem.setImageUrl(request.getImageUrl());
        foodItem.setStatus(request.getStatus());
        foodItem.setCategory(category);

        return mapToResponse(foodItemRepository.save(foodItem));
    }

    @Transactional
    public void deleteFoodItem(Long id) {
        log.info("Deleting food item id: {}", id);
        FoodItem foodItem = findById(id);
        foodItemRepository.delete(foodItem);
    }

    public FoodItem findById(Long id) {
        return foodItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Food item", id));
    }

    private FoodItemResponse mapToResponse(FoodItem item) {
        FoodItemResponse response = new FoodItemResponse();
        response.setId(item.getId());
        response.setName(item.getName());
        response.setDescription(item.getDescription());
        response.setPrice(item.getPrice());
        response.setImageUrl(item.getImageUrl());
        response.setStatus(item.getStatus());
        response.setCategoryId(item.getCategory().getId());
        response.setCategoryName(item.getCategory().getName());
        response.setCreatedAt(item.getCreatedAt());
        return response;
    }
}