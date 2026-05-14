package com.foodorder.controller;

import com.foodorder.dto.ApiResponse;
import com.foodorder.dto.FoodItemRequest;
import com.foodorder.dto.FoodItemResponse;
import com.foodorder.service.FoodItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Food Item Controller - public browsing and admin CRUD.
 */
@RestController
@RequestMapping("/api/food-items")
@RequiredArgsConstructor
@Slf4j
public class FoodItemController {

	private final FoodItemService foodItemService;

	@GetMapping
	@Transactional(readOnly = true)
	public ResponseEntity<ApiResponse<List<FoodItemResponse>>> getAllFoodItems() {
		return ResponseEntity.ok(ApiResponse.success(foodItemService.getAllFoodItems()));
	}

	@GetMapping("/{id}")
	@Transactional(readOnly = true)
	public ResponseEntity<ApiResponse<FoodItemResponse>> getFoodItemById(@PathVariable Long id) {
		return ResponseEntity.ok(ApiResponse.success(foodItemService.getFoodItemById(id)));
	}

	@GetMapping("/category/{categoryId}")
	@Transactional(readOnly = true)
	public ResponseEntity<ApiResponse<List<FoodItemResponse>>> getFoodItemsByCategory(@PathVariable Long categoryId) {
		return ResponseEntity.ok(ApiResponse.success(foodItemService.getFoodItemsByCategory(categoryId)));
	}

	@GetMapping("/available")
	@Transactional(readOnly = true)
	public ResponseEntity<ApiResponse<List<FoodItemResponse>>> getAvailableFoodItems() {
		return ResponseEntity.ok(ApiResponse.success(foodItemService.getAvailableFoodItems()));
	}

	@GetMapping("/search")
	@Transactional(readOnly = true)
	public ResponseEntity<ApiResponse<List<FoodItemResponse>>> searchFoodItems(@RequestParam String name) {
		return ResponseEntity.ok(ApiResponse.success(foodItemService.searchFoodItems(name)));
	}

	@PostMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<FoodItemResponse>> createFoodItem(@Valid @RequestBody FoodItemRequest request) {
		log.info("POST /api/food-items - name: {}", request.getName());
		FoodItemResponse response = foodItemService.createFoodItem(request);
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(ApiResponse.success("Food item created successfully", response));
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<FoodItemResponse>> updateFoodItem(
			@PathVariable Long id,
			@Valid @RequestBody FoodItemRequest request) {
		log.info("PUT /api/food-items/{}", id);
		return ResponseEntity.ok(ApiResponse.success("Food item updated successfully",
				foodItemService.updateFoodItem(id, request)));
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<ApiResponse<Void>> deleteFoodItem(@PathVariable Long id) {
		log.info("DELETE /api/food-items/{}", id);
		foodItemService.deleteFoodItem(id);
		return ResponseEntity.ok(ApiResponse.success("Food item removed from the menu.", null));
	}
}
