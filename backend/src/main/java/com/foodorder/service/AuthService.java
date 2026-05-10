package com.foodorder.service;

import com.foodorder.dto.AuthResponse;
import com.foodorder.dto.CurrentUserResponse;
import com.foodorder.dto.SignInRequest;
import com.foodorder.dto.SignUpRequest;
import com.foodorder.entity.Cart;
import com.foodorder.entity.User;
import com.foodorder.enums.Role;
import com.foodorder.exception.BusinessException;
import com.foodorder.exception.DuplicateResourceException;
import com.foodorder.exception.ResourceNotFoundException;
import com.foodorder.repository.CartRepository;
import com.foodorder.repository.UserRepository;
import com.foodorder.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

/**
 * Service handling user registration and authentication.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    public static final Set<String> ALLOWED_ADMIN_EMAILS = Set.of(
            "admin1@foodorder.com",
            "admin2@foodorder.com"
    );

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    /**
     * Registers a new user and creates their cart.
     *
     * @param request SignUpRequest containing user details
     * @return AuthResponse with JWT token and user info
     */
    @Transactional
    public AuthResponse signUp(SignUpRequest request) {
        log.info("Registering new user with email: {}", request.getEmail());

        if (Role.ADMIN.equals(request.getRole())) {
            throw new BusinessException("Admin accounts cannot be self-registered. Use predefined admin credentials.");
        }

        // Check if email is already in use
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered: " + request.getEmail());
        }

        // Build user entity
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
            .role(Role.CUSTOMER)
                .build();

        User savedUser = userRepository.save(user);

        // Auto-create empty cart for CUSTOMER users
        if (savedUser.getRole().name().equals("CUSTOMER")) {
            Cart cart = Cart.builder().user(savedUser).build();
            cartRepository.save(cart);
            log.info("Created cart for user: {}", savedUser.getEmail());
        }

        String token = jwtUtils.generateToken(savedUser);
        log.info("User registered successfully: {}", savedUser.getEmail());

        return buildAuthResponse(token, savedUser);
    }

    /**
     * Authenticates a user and returns a JWT token.
     *
     * @param request SignInRequest with email and password
     * @return AuthResponse with JWT token and user info
     */
    public AuthResponse signIn(SignInRequest request) {
        log.info("Sign-in attempt for email: {}", request.getEmail());

        // Throws BadCredentialsException if authentication fails
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = (User) auth.getPrincipal();

        if (Role.ADMIN.equals(user.getRole()) && !ALLOWED_ADMIN_EMAILS.contains(user.getEmail().toLowerCase())) {
            throw new BusinessException("This admin account is not authorized.");
        }

        String token = jwtUtils.generateToken(user);

        log.info("User signed in successfully: {}", user.getEmail());
        return buildAuthResponse(token, user);
    }

    /**
     * Returns the currently authenticated user profile.
     */
    public CurrentUserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));

        return CurrentUserResponse.builder()
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .build();
    }

    private AuthResponse buildAuthResponse(String token, User user) {
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}