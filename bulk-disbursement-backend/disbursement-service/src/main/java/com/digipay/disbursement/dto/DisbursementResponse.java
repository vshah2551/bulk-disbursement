package com.digipay.disbursement.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class DisbursementResponse {

    private Long id;

    private Long schemeId;

    private String description;

    private BigDecimal amountPerPayee;

    private Integer payeeCount;

    private BigDecimal totalAmount;

    private String status;

    private String createdBy;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private List<DisbursementPayeeResponse> payees;
}