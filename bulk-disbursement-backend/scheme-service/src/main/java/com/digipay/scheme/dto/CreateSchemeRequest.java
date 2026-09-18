package com.digipay.scheme.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateSchemeRequest {

    @NotBlank(message = "Scheme code is required")
    @Size(
            min = 3,
            max = 50,
            message = "Scheme code must be between 3 and 50 characters"
    )
    private String schemeCode;

    @NotBlank(message = "Scheme name is required")
    @Size(
            min = 3,
            max = 100,
            message = "Scheme name must be between 3 and 100 characters"
    )
    private String schemeName;

    @NotBlank(message = "Description is required")
    @Size(
            min = 5,
            max = 500,
            message = "Description must be between 5 and 500 characters"
    )
    private String description;
}