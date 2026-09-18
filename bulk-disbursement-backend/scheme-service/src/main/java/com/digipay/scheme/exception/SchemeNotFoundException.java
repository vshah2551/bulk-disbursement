package com.digipay.scheme.exception;

public class SchemeNotFoundException
        extends RuntimeException {

    public SchemeNotFoundException(String message) {
        super(message);
    }
}