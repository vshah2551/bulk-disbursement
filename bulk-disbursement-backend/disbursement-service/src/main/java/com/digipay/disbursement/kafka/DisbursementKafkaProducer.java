package com.digipay.disbursement.kafka;

import com.digipay.disbursement.dto.DisbursementCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DisbursementKafkaProducer {

    private static final String TOPIC =
            "disbursement-created";

    private final KafkaTemplate<String, DisbursementCreatedEvent>
            kafkaTemplate;

    public void publishDisbursementCreated(
            DisbursementCreatedEvent event
    ) {

        log.info(
                "Publishing DISBURSEMENT_CREATED event. " +
                        "eventId={}, disbursementId={}",
                event.getEventId(),
                event.getDisbursementId()
        );

        kafkaTemplate.send(
                TOPIC,
                String.valueOf(event.getDisbursementId()),
                event
        );
    }
}