package com.onlinejudge.codejudge.service;

import com.onlinejudge.codejudge.config.RabbitConfig;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class JudgeWorker {

    @RabbitListener(
            queues = RabbitConfig.QUEUE
    )
    public void consume(String submissionId) {

        System.out.println(
                "Processing Submission ID = "
                        + submissionId
        );
    }
}