package com.foodorder.service;

import com.foodorder.entity.User;
import com.foodorder.enums.Role;
import com.foodorder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Ensures the two predefined admin accounts always exist.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AdminAccountInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        ensureAdmin(
                "System Admin 1",
                "admin1@quickbite.com",
                "Admin@123",
                "0710000001"
        );

        ensureAdmin(
                "System Admin 2",
                "admin2@quickbite.com",
                "Admin@456",
                "0710000002"
        );
    }

    private void ensureAdmin(String name, String email, String rawPassword, String phone) {
        User user = userRepository.findByEmail(email)
                .map(existing -> {
                    existing.setName(name);
                    existing.setRole(Role.ADMIN);
                    existing.setPhone(phone);
                    existing.setPassword(passwordEncoder.encode(rawPassword));
                    return existing;
                })
                .orElseGet(() -> User.builder()
                        .name(name)
                        .email(email)
                        .password(passwordEncoder.encode(rawPassword))
                        .phone(phone)
                        .role(Role.ADMIN)
                        .build());

        userRepository.save(user);
        log.info("Predefined admin account is ready: {}", email);
    }
}
