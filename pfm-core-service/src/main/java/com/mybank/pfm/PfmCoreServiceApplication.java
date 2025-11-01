package com.mybank.pfm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * PFM Core Service - Personal Financial Management
 * Manages integrated assets, consumption analysis, and financial recommendations
 */
@EnableAsync
@EnableDiscoveryClient
@EnableMongoRepositories
@SpringBootApplication(scanBasePackages = {"com.mybank.pfm", "com.mybank.common"})
public class PfmCoreServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(PfmCoreServiceApplication.class, args);
    }
}
