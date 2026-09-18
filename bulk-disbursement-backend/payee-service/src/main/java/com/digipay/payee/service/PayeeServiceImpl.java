package com.digipay.payee.service;

import com.digipay.payee.dto.BulkPayeeResponse;
import com.digipay.payee.dto.CreatePayeeRequest;
import com.digipay.payee.dto.PayeeResponse;
import com.digipay.payee.entity.Payee;
import com.digipay.payee.exception.PayeeNotFoundException;
import com.digipay.payee.repository.PayeeRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
public class PayeeServiceImpl implements PayeeService {

    private final PayeeRepository payeeRepository;
    private static final int BATCH_SIZE = 1000;
    private static final int THREAD_COUNT = 5;

    @Override
    @Transactional
    public PayeeResponse createPayee(CreatePayeeRequest request) {

        String createdBy = getCurrentUserId();

        Payee payee = new Payee();

        payee.setFirstName(request.getFirstName());
        payee.setLastName(request.getLastName());
        payee.setEmail(request.getEmail());
        payee.setPanNumber(request.getPanNumber());

        payee.setAccountNumber(request.getAccountNumber());
        payee.setIfscCode(request.getIfscCode());
        payee.setBankName(request.getBankName());

        payee.setCreatedBy(createdBy);

        Payee savedPayee = payeeRepository.save(payee);

        return mapToResponse(savedPayee);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PayeeResponse> getAllPayees() {

        String currentUserId = getCurrentUserId();

        return payeeRepository.findByCreatedBy(currentUserId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PayeeResponse getPayeeById(Long id) {

        String currentUserId = getCurrentUserId();

        Payee payee = payeeRepository.findById(id)
                .filter(p -> p.getCreatedBy().equals(currentUserId))
                .orElseThrow(() ->
                        new PayeeNotFoundException(
                                "Payee not found with id: " + id
                        ));

        return mapToResponse(payee);
    }

    private String getCurrentUserId() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        return authentication.getName();
    }

    private PayeeResponse mapToResponse(Payee payee) {

        PayeeResponse response = new PayeeResponse();

        response.setId(payee.getId());

        response.setFirstName(payee.getFirstName());
        response.setLastName(payee.getLastName());

        response.setEmail(payee.getEmail());
        response.setPanNumber(payee.getPanNumber());

        response.setAccountNumber(payee.getAccountNumber());
        response.setIfscCode(payee.getIfscCode());
        response.setBankName(payee.getBankName());

        response.setStatus(payee.getStatus());

        response.setCreatedBy(payee.getCreatedBy());

        response.setCreatedAt(payee.getCreatedAt());
        response.setUpdatedAt(payee.getUpdatedAt());

        return response;
    }

    @Override
    public BulkPayeeResponse bulkRegisterPayees(MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("CSV file cannot be empty");
        }

        AtomicInteger totalRecords = new AtomicInteger();
        AtomicInteger successfulRecords = new AtomicInteger();
        AtomicInteger skippedRecords = new AtomicInteger();

        // CSV processing will come here

        List<Future<?>> futures = new ArrayList<>();

        ExecutorService executorService = Executors.newFixedThreadPool(THREAD_COUNT);

       // try(Reader reader = new BufferedReader(new InputStreamReader(file.getInputStream())))


        return new BulkPayeeResponse(
                totalRecords,
                successfulRecords,
                skippedRecords
        );
    }
}