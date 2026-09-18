package com.digipay.scheme.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class SchemeResponse {

    private Long id;

    private String schemeCode;

    private String schemeName;

    private String description;

    private String status;

    private String createdBy;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}