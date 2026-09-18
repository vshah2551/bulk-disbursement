package com.digipay.scheme.controller;

import com.digipay.scheme.dto.CreateSchemeRequest;
import com.digipay.scheme.dto.SchemeResponse;
import com.digipay.scheme.dto.UpdateSchemeRequest;
import com.digipay.scheme.service.SchemeService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schemes")
@RequiredArgsConstructor
public class SchemeController {

    private final SchemeService schemeService;

    @PostMapping
    public ResponseEntity<SchemeResponse> createScheme(
            @Valid
            @RequestBody
            CreateSchemeRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        schemeService.createScheme(request)
                );
    }

    @GetMapping
    public ResponseEntity<List<SchemeResponse>> getAllSchemes() {

        return ResponseEntity.ok(
                schemeService.getAllSchemes()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<SchemeResponse> getSchemeById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                schemeService.getSchemeById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<SchemeResponse> updateScheme(
            @PathVariable Long id,
            @Valid
            @RequestBody
            UpdateSchemeRequest request) {

        return ResponseEntity.ok(
                schemeService.updateScheme(
                        id,
                        request
                )
        );
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<SchemeResponse>
    updateSchemeStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return ResponseEntity.ok(
                schemeService.updateSchemeStatus(
                        id,
                        status
                )
        );
    }
}