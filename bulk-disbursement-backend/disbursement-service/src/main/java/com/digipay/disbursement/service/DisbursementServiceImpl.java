package com.digipay.disbursement.service;

import com.digipay.disbursement.dto.CreateDisbursementRequest;
import com.digipay.disbursement.dto.DisbursementCreatedEvent;
import com.digipay.disbursement.dto.DisbursementPayeeResponse;
import com.digipay.disbursement.dto.DisbursementResponse;
import com.digipay.disbursement.entity.Disbursement;
import com.digipay.disbursement.entity.DisbursementPayee;
import com.digipay.disbursement.exception.DisbursementNotFoundException;
import com.digipay.disbursement.kafka.DisbursementKafkaProducer;
import com.digipay.disbursement.repository.DisbursementRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DisbursementServiceImpl implements DisbursementService {

    private final DisbursementRepository disbursementRepository;
    private final DisbursementKafkaProducer disbursementKafkaProducer;

    private static final Logger log =
            LoggerFactory.getLogger(DisbursementServiceImpl.class);

    @Override
    @Transactional
    public DisbursementResponse createDisbursement(
            CreateDisbursementRequest request) {

        log.info("Incoming createDisbursement");

        long uniquePayeeCount = request.getPayeeIds()
                .stream()
                .distinct()
                .count();

        if (uniquePayeeCount != request.getPayeeIds().size()) {
            throw new IllegalArgumentException(
                    "Duplicate payee IDs are not allowed"
            );
        }

        String currentUserId = getCurrentUserId();

        BigDecimal amountPerPayee = request.getAmountPerPayee();
        int payeeCount = request.getPayeeIds().size();

        BigDecimal totalAmount = amountPerPayee.multiply(
                BigDecimal.valueOf(payeeCount)
        );

        Disbursement disbursement = new Disbursement();

        disbursement.setSchemeId(request.getSchemeId());
        disbursement.setDescription(request.getDescription());
        disbursement.setAmountPerPayee(amountPerPayee);
        disbursement.setPayeeCount(payeeCount);
        disbursement.setTotalAmount(totalAmount);
        disbursement.setCreatedBy(currentUserId);

        for (Long payeeId : request.getPayeeIds()) {
            DisbursementPayee disbursementPayee =
                    new DisbursementPayee();

            disbursementPayee.setDisbursement(disbursement);
            disbursementPayee.setPayeeId(payeeId);
            disbursementPayee.setAmount(amountPerPayee);

            disbursement.getPayees().add(disbursementPayee);
        }

        Disbursement saved =
                disbursementRepository.save(disbursement);

        log.info(
                "Disbursement created. id={}, payeeCount={}, totalAmount={}",
                saved.getId(),
                saved.getPayeeCount(),
                saved.getTotalAmount()
        );

        // Create Kafka event
        DisbursementCreatedEvent event =
                new DisbursementCreatedEvent();

        event.setEventId(UUID.randomUUID().toString());
        event.setEventType("DISBURSEMENT_CREATED");
        event.setDisbursementId(saved.getId());

        List<DisbursementCreatedEvent.PayeePaymentData> payees =
                saved.getPayees()
                        .stream()
                        .map(payee ->
                                new DisbursementCreatedEvent.PayeePaymentData(
                                        payee.getId(),
                                        payee.getPayeeId(),
                                        payee.getAmount()
                                )
                        )
                        .toList();

        event.setPayees(payees);

        // Publish event to Kafka
        disbursementKafkaProducer.publishDisbursementCreated(event);

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DisbursementResponse> getAllDisbursements() {

        String currentUserId = getCurrentUserId();

        return disbursementRepository
                .findByCreatedBy(currentUserId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public DisbursementResponse getDisbursementById(Long id) {

        String currentUserId = getCurrentUserId();

        Disbursement disbursement =
                disbursementRepository
                        .findById(id)
                        .filter(d ->
                                d.getCreatedBy().equals(currentUserId)
                        )
                        .orElseThrow(() ->
                                new DisbursementNotFoundException(
                                        "Disbursement not found with id: " + id
                                )
                        );

        return mapToResponse(disbursement);
    }

    private String getCurrentUserId() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        return authentication.getName();
    }

    private DisbursementResponse mapToResponse(
            Disbursement disbursement) {

        DisbursementResponse response =
                new DisbursementResponse();

        response.setId(disbursement.getId());
        response.setSchemeId(disbursement.getSchemeId());
        response.setDescription(disbursement.getDescription());
        response.setAmountPerPayee(
                disbursement.getAmountPerPayee()
        );
        response.setPayeeCount(disbursement.getPayeeCount());
        response.setTotalAmount(disbursement.getTotalAmount());
        response.setStatus(disbursement.getStatus());
        response.setCreatedBy(disbursement.getCreatedBy());
        response.setCreatedAt(disbursement.getCreatedAt());
        response.setUpdatedAt(disbursement.getUpdatedAt());

        List<DisbursementPayeeResponse> payeeResponses =
                disbursement.getPayees()
                        .stream()
                        .map(payee -> {

                            DisbursementPayeeResponse payeeResponse =
                                    new DisbursementPayeeResponse();

                            payeeResponse.setPayeeId(
                                    payee.getPayeeId()
                            );
                            payeeResponse.setAmount(
                                    payee.getAmount()
                            );
                            payeeResponse.setStatus(
                                    payee.getStatus()
                            );

                            return payeeResponse;
                        })
                        .toList();

        response.setPayees(payeeResponses);

        return response;
    }
}