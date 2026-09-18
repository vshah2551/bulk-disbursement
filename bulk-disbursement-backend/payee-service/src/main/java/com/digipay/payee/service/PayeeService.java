package com.digipay.payee.service;

import com.digipay.payee.dto.BulkPayeeResponse;
import com.digipay.payee.dto.CreatePayeeRequest;
import com.digipay.payee.dto.PayeeResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PayeeService {

    PayeeResponse createPayee(CreatePayeeRequest request);

    List<PayeeResponse> getAllPayees();

    PayeeResponse getPayeeById(Long id);

    BulkPayeeResponse bulkRegisterPayees(MultipartFile file);
}