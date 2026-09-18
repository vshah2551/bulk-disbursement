package com.digipay.payee.repository;

import com.digipay.payee.entity.Payee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PayeeRepository extends JpaRepository<Payee, Long> {

    List<Payee> findByCreatedBy(String createdBy);
}