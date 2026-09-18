package com.digipay.scheme.repository;

import com.digipay.scheme.entity.Scheme;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SchemeRepository
        extends JpaRepository<Scheme, Long> {

    boolean existsBySchemeCode(String schemeCode);

    boolean existsBySchemeCodeAndIdNot(
            String schemeCode,
            Long id
    );

    List<Scheme> findByCreatedBy(String createdBy);

    List<Scheme> findByCreatedByAndStatus(
            String createdBy,
            String status
    );
}