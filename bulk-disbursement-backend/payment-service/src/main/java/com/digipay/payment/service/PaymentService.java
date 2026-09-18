package com.digipay.payment.service;

import com.digipay.payment.dto.DisbursementCreatedEvent;
import com.digipay.payment.dto.PaymentResultEvent;
import com.digipay.payment.entity.Payment;
import com.digipay.payment.kafka.PaymentKafkaProducer;
import com.digipay.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;

    private final PaymentKafkaProducer paymentKafkaProducer;

    private final ExecutorService paymentExecutor;

    private static final int BATCH_SIZE = 500;

    public void processDisbursement(
            DisbursementCreatedEvent event
    ) {

        List<DisbursementCreatedEvent.PayeePaymentData> payees =
                event.getPayees();

        List<List<DisbursementCreatedEvent.PayeePaymentData>> batches =
                partition(payees, BATCH_SIZE);

        List<CompletableFuture<Void>> futures =
                new ArrayList<>();

        for (
                List<DisbursementCreatedEvent.PayeePaymentData> batch
                : batches
        ) {

            CompletableFuture<Void> future =
                    CompletableFuture.runAsync(
                            () -> processBatch(event, batch),
                            paymentExecutor
                    );

            futures.add(future);
        }

        CompletableFuture.allOf(
                futures.toArray(new CompletableFuture[0])
        ).join();
    }

    private void processBatch(
            DisbursementCreatedEvent event,
            List<DisbursementCreatedEvent.PayeePaymentData> batch
    ) {

        for (
                DisbursementCreatedEvent.PayeePaymentData payee
                : batch
        ) {

            processPayee(
                    event.getDisbursementId(),
                    payee
            );
        }
    }

    @Transactional
    protected void processPayee(
            Long disbursementId,
            DisbursementCreatedEvent.PayeePaymentData payee
    ) {

        Payment payment =
                paymentRepository
                        .findByDisbursementPayeeId(
                                payee.getDisbursementPayeeId()
                        )
                        .orElseGet(() -> {

                            Payment newPayment =
                                    new Payment();

                            newPayment.setDisbursementId(
                                    disbursementId
                            );

                            newPayment.setDisbursementPayeeId(
                                    payee.getDisbursementPayeeId()
                            );

                            newPayment.setPayeeId(
                                    payee.getPayeeId()
                            );

                            newPayment.setAmount(
                                    payee.getAmount()
                            );

                            newPayment.setStatus(
                                    "PENDING"
                            );

                            newPayment.setAttemptCount(0);

                            return newPayment;
                        });

        processPayment(payment);
    }

    private void processPayment(
            Payment payment
    ) {

        payment.setStatus("PROCESSING");

        payment.setAttemptCount(
                payment.getAttemptCount() + 1
        );

        paymentRepository.save(payment);

        /*
         * Dummy payment processing.
         *
         * Later:
         * - actual payment gateway
         * - failure handling
         * - retry
         * - circuit breaker
         */

        payment.setStatus("COMPLETED");

        paymentRepository.save(payment);

        publishSuccessEvent(payment);
    }

    private void publishSuccessEvent(
            Payment payment
    ) {

        PaymentResultEvent event =
                new PaymentResultEvent();

        event.setEventId(
                UUID.randomUUID().toString()
        );

        event.setEventType(
                "PAYMENT_COMPLETED"
        );

        event.setPaymentId(
                payment.getId()
        );

        event.setDisbursementId(
                payment.getDisbursementId()
        );

        event.setDisbursementPayeeId(
                payment.getDisbursementPayeeId()
        );

        event.setPayeeId(
                payment.getPayeeId()
        );

        event.setAmount(
                payment.getAmount()
        );

        event.setAttempt(
                payment.getAttemptCount()
        );

        event.setStatus(
                payment.getStatus()
        );

        paymentKafkaProducer.publishPaymentResult(event);
    }

    private <T> List<List<T>> partition(
            List<T> list,
            int batchSize
    ) {

        List<List<T>> batches = new ArrayList<>();

        for (int i = 0; i < list.size(); i += batchSize) {

            batches.add(
                    list.subList(
                            i,
                            Math.min(
                                    i + batchSize,
                                    list.size()
                            )
                    )
            );
        }

        return batches;
    }
}