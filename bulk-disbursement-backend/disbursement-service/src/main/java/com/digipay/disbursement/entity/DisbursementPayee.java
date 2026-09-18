package com.digipay.disbursement.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "disbursement_payees",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_disbursement_payee",
                        columnNames = {"disbursement_id", "payee_id"}
                )
        }
)
@Getter
@Setter
public class DisbursementPayee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "disbursement_id",
            nullable = false
    )
    private Disbursement disbursement;

    /*
     * This is NOT a foreign key to Payee Service DB.
     *
     * It is simply the ID of the payee
     * owned by Payee Service.
     */
    @Column(name = "payee_id", nullable = false)
    private Long payeeId;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    @Column(nullable = false, length = 30)
    private String status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {

        createdAt = LocalDateTime.now();

        if (status == null) {
            status = "PENDING";
        }
    }
}