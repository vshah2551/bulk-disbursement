package com.digipay.payee.controller;

import com.digipay.payee.dto.BulkPayeeResponse;
import com.digipay.payee.dto.CreatePayeeRequest;
import com.digipay.payee.dto.PayeeResponse;
import com.digipay.payee.service.PayeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/payees")
@RequiredArgsConstructor
public class PayeeController {

    private final PayeeService payeeService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DISBURSEMENT_OPERATOR')")
    public ResponseEntity<PayeeResponse> createPayee(
            @Valid @RequestBody CreatePayeeRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(payeeService.createPayee(request));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DISBURSEMENT_OPERATOR', 'DISBURSEMENT_APPROVER')")
    public ResponseEntity<List<PayeeResponse>> getAllPayees() {

        return ResponseEntity.ok(
                payeeService.getAllPayees()
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DISBURSEMENT_OPERATOR', 'DISBURSEMENT_APPROVER')")
    public ResponseEntity<PayeeResponse> getPayeeById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                payeeService.getPayeeById(id)
        );
    }

//    @GetMapping("/scheme/{schemeId}")
//    @PreAuthorize("hasAnyRole('ADMIN', 'DISBURSEMENT_OPERATOR', 'DISBURSEMENT_APPROVER')")
//    public ResponseEntity<List<PayeeResponse>> getPayeesByScheme(
//            @PathVariable String schemeId) {
//
//        return ResponseEntity.ok(
//                payeeService.getPayeesByScheme(schemeId)
//        );
//    }

    @PostMapping(
            value = "/bulk",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<BulkPayeeResponse> bulkRegisterPayees(
            @RequestParam("file") MultipartFile file) {

        BulkPayeeResponse response = payeeService.bulkRegisterPayees(file);

        return ResponseEntity.ok(response);
    }
}