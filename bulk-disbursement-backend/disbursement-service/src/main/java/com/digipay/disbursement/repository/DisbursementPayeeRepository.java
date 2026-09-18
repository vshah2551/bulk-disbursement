package com.digipay.disbursement.repository;

import com.digipay.disbursement.entity.DisbursementPayee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DisbursementPayeeRepository
        extends JpaRepository<DisbursementPayee, Long> {

    List<DisbursementPayee> findByDisbursementId(Long disbursementId);
}