package com.digipay.auth.controller;

import com.digipay.auth.dto.ApiResponse;
import com.digipay.auth.dto.LoginRequest;
import com.digipay.auth.dto.RegisterRequest;
import com.digipay.auth.service.KeycloakAdminService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final KeycloakAdminService keycloakAdminService;

    public AuthController(
            KeycloakAdminService keycloakAdminService) {

        this.keycloakAdminService = keycloakAdminService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        keycloakAdminService.registerUser(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        new ApiResponse(
                                "User registered successfully"
                        )
                );
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
            @Valid @RequestBody LoginRequest request) {

        Map<String, Object> tokenResponse =
                keycloakAdminService.login(request);

        return ResponseEntity.ok(tokenResponse);
    }
}