package com.digipay.scheme.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "schemes",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_scheme_code",
                        columnNames = "scheme_code"
                )
        }
)
@Getter
@Setter
public class Scheme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(
            name = "scheme_code",
            nullable = false,
            unique = true,
            length = 50
    )
    private String schemeCode;

    @Column(
            name = "scheme_name",
            nullable = false,
            length = 100
    )
    private String schemeName;

    @Column(
            nullable = false,
            length = 500
    )
    private String description;

    @Column(
            nullable = false,
            length = 20
    )
    private String status;

    @Column(
            name = "created_by",
            nullable = false
    )
    private String createdBy;

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
            status = "ACTIVE";
        }
    }

    @PreUpdate
    protected void onUpdate() {

        updatedAt = LocalDateTime.now();
    }
}