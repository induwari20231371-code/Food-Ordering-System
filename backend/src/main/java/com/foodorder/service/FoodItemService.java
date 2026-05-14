package com.foodorder.service;

import com.foodorder.dto.FoodItemRequest;
import com.foodorder.dto.FoodItemResponse;
import com.foodorder.entity.Category;
import com.foodorder.entity.FoodItem;
import com.foodorder.enums.FoodItemStatus;
import com.foodorder.exception.BusinessException;
import com.foodorder.exception.ResourceNotFoundException;
import com.foodorder.repository.CartItemRepository;
import com.foodorder.repository.OrderItemRepository;
import com.foodorder.repository.CategoryRepository;
import com.foodorder.repository.FoodItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.Map;
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
    private final CartItemRepository cartItemRepository;
    private final OrderItemRepository orderItemRepository;

    public List<FoodItemResponse> getAllFoodItems() {
        return deduplicateFoodItems(foodItemRepository.findAll().stream()
                .map(this::mapToResponse)
            .collect(Collectors.toList()));
    }

    public FoodItemResponse getFoodItemById(Long id) {
        return mapToResponse(findById(id));
    }

    public List<FoodItemResponse> getFoodItemsByCategory(Long categoryId) {
        return deduplicateFoodItems(foodItemRepository.findByCategoryId(categoryId).stream()
                .map(this::mapToResponse)
            .collect(Collectors.toList()));
    }

    public List<FoodItemResponse> getAvailableFoodItems() {
        return deduplicateFoodItems(foodItemRepository.findByStatus(FoodItemStatus.AVAILABLE).stream()
                .map(this::mapToResponse)
            .collect(Collectors.toList()));
    }

    public List<FoodItemResponse> searchFoodItems(String name) {
        return deduplicateFoodItems(foodItemRepository.findByNameContainingIgnoreCase(name).stream()
                .map(this::mapToResponse)
            .collect(Collectors.toList()));
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
                .imageUrl(normalizeImageUrl(request.getImageUrl()))
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
        foodItem.setImageUrl(normalizeImageUrl(request.getImageUrl()));
        foodItem.setStatus(request.getStatus() != null ? request.getStatus() : FoodItemStatus.AVAILABLE);
        foodItem.setCategory(category);

        return mapToResponse(foodItemRepository.save(foodItem));
    }

    @Transactional
    public void deleteFoodItem(Long id) {
        log.info("Deleting food item id: {}", id);
        // ensure it exists
        findById(id);

        long cartRefs = cartItemRepository.countByFoodItemId(id);
        long orderRefs = orderItemRepository.countByFoodItemId(id);

        if (cartRefs > 0 || orderRefs > 0) {
            throw new BusinessException("Cannot delete food item: referenced by existing orders or carts");
        }

        foodItemRepository.deleteById(id);
        foodItemRepository.flush();
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

    private List<FoodItemResponse> deduplicateFoodItems(List<FoodItemResponse> items) {
        Map<String, FoodItemResponse> uniqueItems = new LinkedHashMap<>();

        for (FoodItemResponse item : items) {
            String itemKey = buildLogicalKey(item);
            FoodItemResponse existingItem = uniqueItems.get(itemKey);

            if (existingItem == null || isNewer(item, existingItem)) {
                uniqueItems.put(itemKey, item);
            }
        }

        return uniqueItems.values().stream()
                .sorted(Comparator.comparing(FoodItemResponse::getId, Comparator.nullsFirst(Comparator.naturalOrder())))
                .collect(Collectors.toCollection(ArrayList::new));
    }

    private String buildLogicalKey(FoodItemResponse item) {
        String name = item.getName() == null ? "" : item.getName().trim().toLowerCase();
        String categoryId = item.getCategoryId() == null ? "" : String.valueOf(item.getCategoryId());
        return name + "|" + categoryId;
    }

    private boolean isNewer(FoodItemResponse candidate, FoodItemResponse current) {
        if (candidate.getCreatedAt() == null) {
            return false;
        }
        if (current.getCreatedAt() == null) {
            return true;
        }

        int createdAtComparison = candidate.getCreatedAt().compareTo(current.getCreatedAt());
        if (createdAtComparison != 0) {
            return createdAtComparison > 0;
        }

        if (candidate.getId() == null) {
            return false;
        }
        if (current.getId() == null) {
            return true;
        }

        return candidate.getId() > current.getId();
    }

    private String normalizeImageUrl(String imageUrl) {
        if (imageUrl == null) {
            return null;
        }

        String trimmed = imageUrl.trim();
        if (trimmed.isEmpty()) {
            return null;
        }

        return trimmed.length() > 2000 ? trimmed.substring(0, 2000) : trimmed;
    }
}