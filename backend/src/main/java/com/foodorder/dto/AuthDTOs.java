package com.foodorder.dto;

import com.foodorder.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

// ===================== Auth DTOs =====================

/**
 * Request body for user registration (Sign Up).
 */
class SignUpRequest {
    @NotBlank(message = "Name is required")
    public String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    public String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    public String password;

    @NotBlank(message = "Phone is required")
    public String phone;

    public Role role = Role.CUSTOMER; // Default role
}

/**
 * Request body for user login (Sign In).
 */
class SignInRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    public String email;

    @NotBlank(message = "Password is required")
    public String password;
}

/**
 * Response body returned after successful authentication.
 */
class AuthResponse {
    public String token;
    public String tokenType = "Bearer";
    public Long userId;
    public String name;
    public String email;
    public String role;

    public AuthResponse(String token, Long userId, String name, String email, String role) {
        this.token = token;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
    }
}