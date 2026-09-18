package com.digipay.payee.exception;

public class PayeeNotFoundException extends RuntimeException {

    public PayeeNotFoundException(String message) {
        super(message);
    }
}