package com.digipay.payee.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PayeeResponse {

    private Long id;

    private String firstName;

    private String lastName;

    private String email;

    private String panNumber;

    private String accountNumber;

    private String ifscCode;

    private String bankName;

    private String status;

    private String createdBy;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}