package com.digipay.payment.kafka;

import com.digipay.payment.dto.PaymentResultEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentKafkaProducer {

    private static final String TOPIC =
            "payment-completed";

    private final KafkaTemplate<String, PaymentResultEvent>
            kafkaTemplate;

    public void publishPaymentResult(
            PaymentResultEvent event
    ) {

        log.info(
                "Publishing payment result. " +
                        "eventType={}, paymentId={}, payeeId={}",
                event.getEventType(),
                event.getPaymentId(),
                event.getPayeeId()
        );

        kafkaTemplate.send(
                TOPIC,
                String.valueOf(
                        event.getDisbursementId()
                ),
                event
        );
    }
}