package com.foodorder.controller;

import com.foodorder.dto.ApiResponse;
import com.foodorder.entity.User;
import com.foodorder.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * User Controller - admin user management.
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

	private final UserService userService;

	@GetMapping
	@Transactional(readOnly = true)
	public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
		return ResponseEntity.ok(ApiResponse.success(
				userService.getAllUsers().stream()
						.map(this::toResponse)
						.collect(Collectors.toList())
		));
	}

	@GetMapping("/{id}")
	@Transactional(readOnly = true)
	public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
		return ResponseEntity.ok(ApiResponse.success(toResponse(userService.getUserById(id))));
	}

	@GetMapping("/email/{email}")
	@Transactional(readOnly = true)
	public ResponseEntity<ApiResponse<UserResponse>> getUserByEmail(@PathVariable String email) {
		return ResponseEntity.ok(ApiResponse.success(toResponse(userService.getUserByEmail(email))));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
		log.info("DELETE /api/users/{}", id);
		userService.deleteUser(id);
		return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
	}

	private UserResponse toResponse(User user) {
		return new UserResponse(
				user.getId(),
				user.getName(),
				user.getEmail(),
				user.getPhone(),
				user.getRole() != null ? user.getRole().name() : null,
				user.getCreatedAt(),
				user.getUpdatedAt()
		);
	}

	private record UserResponse(
			Long id,
			String name,
			String email,
			String phone,
			String role,
			LocalDateTime createdAt,
			LocalDateTime updatedAt
	) {
	}
}
