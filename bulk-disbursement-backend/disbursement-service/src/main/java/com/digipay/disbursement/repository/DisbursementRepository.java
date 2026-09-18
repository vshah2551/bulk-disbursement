package com.digipay.disbursement.repository;

import com.digipay.disbursement.entity.Disbursement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DisbursementRepository
        extends JpaRepository<Disbursement, Long> {

    List<Disbursement> findByCreatedBy(String createdBy);
}