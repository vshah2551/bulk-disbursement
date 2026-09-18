package com.digipay.disbursement.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class DisbursementPayeeResponse {

    private Long payeeId;

    private BigDecimal amount;

    private String status;
}