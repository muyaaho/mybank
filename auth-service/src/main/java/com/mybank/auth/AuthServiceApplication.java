package com.mybank.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * Authentication Service
 * Handles user authentication, authorization, and token management
 * Supports OAuth 2.0, JWT, and FIDO2 biometric authentication
 */
@EnableDiscoveryClient
@SpringBootApplication(scanBasePackages = {"com.mybank.auth", "com.mybank.common"})
public class AuthServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthServiceApplication.class, args);
    }
}
