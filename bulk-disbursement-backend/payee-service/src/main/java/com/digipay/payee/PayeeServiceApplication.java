package com.digipay.payee;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class PayeeServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(PayeeServiceApplication.class, args);
	}

}
