package com.onlinejudge.codejudge.controller;

import com.onlinejudge.codejudge.dto.LoginRequest;
import com.onlinejudge.codejudge.dto.LoginResponse;
import com.onlinejudge.codejudge.dto.RegisterRequest;
import com.onlinejudge.codejudge.entity.User;
import com.onlinejudge.codejudge.entity.Role;
import com.onlinejudge.codejudge.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Register user
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body(new LoginResponse(false, "Username already exists"));
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(new LoginResponse(false, "Email already exists"));
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);

        userRepository.save(user);
        return ResponseEntity.ok(new LoginResponse(true, "User registered successfully"));
    }

    // Get all users (You can restrict this to ADMIN only later)
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Login user
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername()).orElse(null);

        if (user == null) {
            return ResponseEntity.status(401).body(new LoginResponse(false, "User not found"));
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body(new LoginResponse(false, "Invalid password"));
        }

        // Return success with user details
        LoginResponse response = new LoginResponse(
                true,
                "Login successful",
                user.getId(),
                user.getUsername(),
                user.getRole().name()
        );

        return ResponseEntity.ok(response);
    }
}