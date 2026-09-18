package com.digipay.payment.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class DisbursementCreatedEvent {

    private String eventId;

    private String eventType;

    private Long disbursementId;

    private List<PayeePaymentData> payees;

    @Getter
    @Setter
    public static class PayeePaymentData {

        private Long disbursementPayeeId;

        private Long payeeId;

        private BigDecimal amount;
    }
}