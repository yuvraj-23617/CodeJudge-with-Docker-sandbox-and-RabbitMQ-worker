package com.onlinejudge.codejudge.controller;

import com.onlinejudge.codejudge.service.SubmissionProducer;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RabbitTestController {

    private final SubmissionProducer producer;

    public RabbitTestController(
            SubmissionProducer producer) {

        this.producer = producer;
    }

    @GetMapping("/rabbit-test")
    public String test() {

        producer.send(123L);

        return "sent";
    }
}