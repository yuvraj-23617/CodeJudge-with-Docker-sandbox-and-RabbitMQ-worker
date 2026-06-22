package com.onlinejudge.codejudge.service;

import com.onlinejudge.codejudge.config.RabbitConfig;
import com.onlinejudge.codejudge.dto.SubmissionMessage;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class SubmissionProducer {

    private final RabbitTemplate rabbitTemplate;

    public SubmissionProducer(
            RabbitTemplate rabbitTemplate) {

        this.rabbitTemplate = rabbitTemplate;
    }

    public void send(Long submissionId) {

        rabbitTemplate.convertAndSend(
                RabbitConfig.QUEUE,
                submissionId.toString()
        );
    }
}