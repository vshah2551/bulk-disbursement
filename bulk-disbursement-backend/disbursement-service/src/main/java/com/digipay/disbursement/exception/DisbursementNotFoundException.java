package com.digipay.disbursement.exception;

public class DisbursementNotFoundException
        extends RuntimeException {

    public DisbursementNotFoundException(
            String message) {

        super(message);
    }
}