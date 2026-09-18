package com.digipay.scheme.service;

import com.digipay.scheme.dto.CreateSchemeRequest;
import com.digipay.scheme.dto.SchemeResponse;
import com.digipay.scheme.dto.UpdateSchemeRequest;

import java.util.List;

public interface SchemeService {

    SchemeResponse createScheme(
            CreateSchemeRequest request
    );

    List<SchemeResponse> getAllSchemes();

    SchemeResponse getSchemeById(Long id);

    SchemeResponse updateScheme(
            Long id,
            UpdateSchemeRequest request
    );

    SchemeResponse updateSchemeStatus(
            Long id,
            String status
    );
}