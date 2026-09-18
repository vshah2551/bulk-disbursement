package com.digipay.payment.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "payments",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_disbursement_payee",
                        columnNames = "disbursement_payee_id"
                )
        }
)
@Getter
@Setter
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*
     * ID of the parent disbursement.
     */
    @Column(
            name = "disbursement_id",
            nullable = false
    )
    private Long disbursementId;

    /*
     * ID of the specific row in
     * disbursement_payees.
     */
    @Column(
            name = "disbursement_payee_id",
            nullable = false
    )
    private Long disbursementPayeeId;

    /*
     * Payee Service's payee ID.
     */
    @Column(
            name = "payee_id",
            nullable = false
    )
    private Long payeeId;

    @Column(
            nullable = false,
            precision = 19,
            scale = 2
    )
    private BigDecimal amount;

    /*
     * PENDING
     * PROCESSING
     * COMPLETED
     * FAILED
     */
    @Column(
            nullable = false,
            length = 30
    )
    private String status;

    /*
     * Number of payment attempts.
     */
    @Column(
            name = "attempt_count",
            nullable = false
    )
    private Integer attemptCount;

    @Column(
            name = "created_at",
            nullable = false
    )
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {

        createdAt = LocalDateTime.now();

        if (status == null) {
            status = "PENDING";
        }

        if (attemptCount == null) {
            attemptCount = 0;
        }
    }

    @PreUpdate
    protected void onUpdate() {

        updatedAt = LocalDateTime.now();
    }
}