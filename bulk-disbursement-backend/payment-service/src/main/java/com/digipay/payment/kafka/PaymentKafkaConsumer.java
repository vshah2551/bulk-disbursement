package com.digipay.payment.kafka;

import com.digipay.payment.dto.DisbursementCreatedEvent;
import com.digipay.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentKafkaConsumer {

    private final PaymentService paymentService;

    @KafkaListener(
            topics = "disbursement-created",
            groupId = "payment-service"
    )
    public void consume(
            DisbursementCreatedEvent event
    ) {

        log.info(
                "Received DISBURSEMENT_CREATED event. " +
                        "eventId={}, disbursementId={}",
                event.getEventId(),
                event.getDisbursementId()
        );

        paymentService.processDisbursement(event);
    }
}