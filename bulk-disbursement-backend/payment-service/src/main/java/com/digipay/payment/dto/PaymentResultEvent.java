package com.digipay.payment.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class PaymentResultEvent {

    private String eventId;

    private String eventType;

    private Long paymentId;

    private Long disbursementId;

    private Long disbursementPayeeId;

    private Long payeeId;

    private BigDecimal amount;

    private Integer attempt;

    private String status;
}