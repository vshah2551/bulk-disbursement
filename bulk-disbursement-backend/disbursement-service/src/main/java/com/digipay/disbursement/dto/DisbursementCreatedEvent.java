package com.digipay.disbursement.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DisbursementCreatedEvent {

    private String eventId;

    private String eventType;

    private Long disbursementId;

    private List<PayeePaymentData> payees;


    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PayeePaymentData {

        private Long disbursementPayeeId;

        private Long payeeId;

        private BigDecimal amount;
    }
}