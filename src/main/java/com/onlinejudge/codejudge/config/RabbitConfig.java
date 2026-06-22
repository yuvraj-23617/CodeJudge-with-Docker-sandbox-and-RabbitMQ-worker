package com.onlinejudge.codejudge.config;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitConfig {

    public static final String QUEUE =
            "submission-queue";

    @Bean
    public Queue submissionQueue() {

        System.out.println("RABBIT QUEUE CREATED");

        return new Queue(QUEUE, true);
    }
}