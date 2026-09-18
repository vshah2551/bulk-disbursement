package com.digipay.scheme.service;

import com.digipay.scheme.dto.CreateSchemeRequest;
import com.digipay.scheme.dto.SchemeResponse;
import com.digipay.scheme.dto.UpdateSchemeRequest;
import com.digipay.scheme.entity.Scheme;
import com.digipay.scheme.exception.SchemeNotFoundException;
import com.digipay.scheme.repository.SchemeRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SchemeServiceImpl
        implements SchemeService {

    private final SchemeRepository schemeRepository;

    @Override
    @Transactional
    public SchemeResponse createScheme(
            CreateSchemeRequest request) {

        String schemeCode =
                request.getSchemeCode()
                        .trim()
                        .toUpperCase();

        if (schemeRepository.existsBySchemeCode(schemeCode)) {

            throw new IllegalArgumentException(
                    "Scheme with this scheme code already exists"
            );
        }

        String createdBy = getCurrentUserId();

        Scheme scheme = new Scheme();

        scheme.setSchemeCode(schemeCode);
        scheme.setSchemeName(
                request.getSchemeName().trim()
        );
        scheme.setDescription(
                request.getDescription().trim()
        );
        scheme.setCreatedBy(createdBy);

        Scheme savedScheme =
                schemeRepository.save(scheme);

        return mapToResponse(savedScheme);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SchemeResponse> getAllSchemes() {

        String currentUserId = getCurrentUserId();

        return schemeRepository
                .findByCreatedBy(currentUserId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SchemeResponse getSchemeById(Long id) {

        String currentUserId = getCurrentUserId();

        Scheme scheme =
                schemeRepository.findById(id)
                        .filter(s ->
                                s.getCreatedBy()
                                        .equals(currentUserId)
                        )
                        .orElseThrow(() ->
                                new SchemeNotFoundException(
                                        "Scheme not found with id: "
                                                + id
                                )
                        );

        return mapToResponse(scheme);
    }

    @Override
    @Transactional
    public SchemeResponse updateScheme(
            Long id,
            UpdateSchemeRequest request) {

        String currentUserId = getCurrentUserId();

        Scheme scheme =
                schemeRepository.findById(id)
                        .filter(s ->
                                s.getCreatedBy()
                                        .equals(currentUserId)
                        )
                        .orElseThrow(() ->
                                new SchemeNotFoundException(
                                        "Scheme not found with id: "
                                                + id
                                )
                        );

        scheme.setSchemeName(
                request.getSchemeName().trim()
        );

        scheme.setDescription(
                request.getDescription().trim()
        );

        Scheme updatedScheme =
                schemeRepository.save(scheme);

        return mapToResponse(updatedScheme);
    }

    @Override
    @Transactional
    public SchemeResponse updateSchemeStatus(
            Long id,
            String status) {

        String currentUserId = getCurrentUserId();

        Scheme scheme =
                schemeRepository.findById(id)
                        .filter(s ->
                                s.getCreatedBy()
                                        .equals(currentUserId)
                        )
                        .orElseThrow(() ->
                                new SchemeNotFoundException(
                                        "Scheme not found with id: "
                                                + id
                                )
                        );

        String normalizedStatus =
                status.trim().toUpperCase();

        if (!normalizedStatus.equals("ACTIVE")
                && !normalizedStatus.equals("INACTIVE")) {

            throw new IllegalArgumentException(
                    "Status must be ACTIVE or INACTIVE"
            );
        }

        scheme.setStatus(normalizedStatus);

        return mapToResponse(
                schemeRepository.save(scheme)
        );
    }

    private String getCurrentUserId() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        return authentication.getName();
    }

    private SchemeResponse mapToResponse(
            Scheme scheme) {

        SchemeResponse response =
                new SchemeResponse();

        response.setId(scheme.getId());

        response.setSchemeCode(
                scheme.getSchemeCode()
        );

        response.setSchemeName(
                scheme.getSchemeName()
        );

        response.setDescription(
                scheme.getDescription()
        );

        response.setStatus(
                scheme.getStatus()
        );

        response.setCreatedBy(
                scheme.getCreatedBy()
        );

        response.setCreatedAt(
                scheme.getCreatedAt()
        );

        response.setUpdatedAt(
                scheme.getUpdatedAt()
        );

        return response;
    }
}