package com.foodorder.controller;

import com.foodorder.dto.ApiResponse;
import com.foodorder.dto.AuthResponse;
import com.foodorder.dto.CurrentUserResponse;
import com.foodorder.dto.SignInRequest;
import com.foodorder.dto.SignUpRequest;
import com.foodorder.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication Controller - handles Sign Up and Sign In.
 * These endpoints are publicly accessible (no JWT required).
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    /**
     * POST /api/auth/signup
     * Registers a new user (ADMIN or CUSTOMER).
     */
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<AuthResponse>> signUp(
            @Valid @RequestBody SignUpRequest request) {
        log.info("POST /api/auth/signup - email: {}", request.getEmail());
        AuthResponse response = authService.signUp(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully", response));
    }

    /**
     * POST /api/auth/signin
     * Authenticates a user and returns a JWT token.
     */
    @PostMapping("/signin")
    public ResponseEntity<ApiResponse<AuthResponse>> signIn(
            @Valid @RequestBody SignInRequest request) {
        log.info("POST /api/auth/signin - email: {}", request.getEmail());
        AuthResponse response = authService.signIn(request);
        return ResponseEntity.ok(ApiResponse.success("Sign-in successful", response));
    }

    /**
     * GET /api/auth/me
     * Returns the currently authenticated user based on the JWT token.
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<CurrentUserResponse>> getCurrentUser(
            Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(authService.getCurrentUser(authentication.getName())));
    }
}