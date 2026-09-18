package com.digipay.payee.dto;

import java.util.concurrent.atomic.AtomicInteger;

public record BulkPayeeResponse(
        AtomicInteger totalRecords,
        AtomicInteger successfulRecords,
        AtomicInteger skippedRecords
) {
}