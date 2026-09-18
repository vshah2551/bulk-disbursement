package com.digipay.disbursement.dto;

import jakarta.validation.constraints.*;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class CreateDisbursementRequest {

    @NotNull(message = "Scheme ID is required")
    @Positive(message = "Scheme ID must be positive")
    private Long schemeId;

    @NotBlank(message = "Description is required")
    @Size(
            min = 5,
            max = 500,
            message = "Description must be between 5 and 500 characters"
    )
    private String description;

    @NotNull(message = "Amount per payee is required")
    @DecimalMin(
            value = "0.01",
            message = "Amount must be greater than zero"
    )
    private BigDecimal amountPerPayee;

    @NotEmpty(message = "At least one payee must be selected")
    private List<

            @NotNull(message = "Payee ID cannot be null")
            @Positive(message = "Payee ID must be positive")

                    Long> payeeIds;
}