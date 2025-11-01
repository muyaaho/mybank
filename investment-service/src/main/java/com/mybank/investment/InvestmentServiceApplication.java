package com.mybank.investment;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

/**
 * Investment Service
 * Handles micro-investing, round-up logic, and portfolio management
 * Consumes payment events from Kafka for automatic round-up investing
 */
@EnableDiscoveryClient
@EnableMongoRepositories
@SpringBootApplication(scanBasePackages = {"com.mybank.investment", "com.mybank.common"})
public class InvestmentServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(InvestmentServiceApplication.class, args);
    }
}
