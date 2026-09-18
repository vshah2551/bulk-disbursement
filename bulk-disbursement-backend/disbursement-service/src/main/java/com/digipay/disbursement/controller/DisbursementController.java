package com.digipay.disbursement.controller;

import com.digipay.disbursement.dto.CreateDisbursementRequest;
import com.digipay.disbursement.dto.DisbursementResponse;
import com.digipay.disbursement.service.DisbursementService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/disbursements")
@RequiredArgsConstructor
public class DisbursementController {

    private final DisbursementService disbursementService;

    @PostMapping
    public ResponseEntity<DisbursementResponse>
    createDisbursement(
            @Valid @RequestBody CreateDisbursementRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        disbursementService
                                .createDisbursement(request)
                );
    }

    @GetMapping
    public ResponseEntity<List<DisbursementResponse>>
    getAllDisbursements() {

        return ResponseEntity.ok(
                disbursementService
                        .getAllDisbursements()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisbursementResponse>
    getDisbursementById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                disbursementService
                        .getDisbursementById(id)
        );
    }
}