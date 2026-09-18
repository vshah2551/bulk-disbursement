package com.digipay.disbursement.service;

import com.digipay.disbursement.dto.CreateDisbursementRequest;
import com.digipay.disbursement.dto.DisbursementResponse;

import java.util.List;

public interface DisbursementService {

    DisbursementResponse createDisbursement(
            CreateDisbursementRequest request
    );

    List<DisbursementResponse> getAllDisbursements();

    DisbursementResponse getDisbursementById(Long id);
}