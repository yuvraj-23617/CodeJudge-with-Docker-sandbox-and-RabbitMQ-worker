package com.onlinejudge.codejudge.service;

import com.onlinejudge.codejudge.config.RabbitConfig;
import com.onlinejudge.codejudge.entity.Problem;
import com.onlinejudge.codejudge.entity.Submission;
import com.onlinejudge.codejudge.entity.TestCase;
import com.onlinejudge.codejudge.repository.SubmissionRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class JudgeWorker {

    private final SubmissionRepository submissionRepository;
    private final JudgeService judgeService;

    public JudgeWorker(
            SubmissionRepository submissionRepository,
            JudgeService judgeService) {

        this.submissionRepository = submissionRepository;
        this.judgeService = judgeService;
    }

    @RabbitListener(
            queues = RabbitConfig.QUEUE
    )
    public void consume(String submissionIdString) {
        System.out.println("WORKER START");
        Long submissionId = Long.parseLong(submissionIdString);

        System.out.println("Submission = " + submissionId);

        Submission submission =
                submissionRepository
                        .findById(submissionId)
                        .orElse(null);

        if (submission == null) {
            return;
        }

        Problem problem =
                submission.getProblem();

        System.out.println(
                "Test cases count = "
                        + problem.getTestCases().size()
        );

        for (TestCase tc : problem.getTestCases()) {

            long start = System.currentTimeMillis();

            String verdict =
                    judgeService.judge(
                            submission.getLanguage(),
                            submission.getCode(),
                            tc.getInput(),
                            tc.getExpectedOutput()
                    );

            long end = System.currentTimeMillis();

            submission.setExecutionTime(end - start);

            if (!verdict.equals("ACCEPTED")) {

                submission.setVerdict(verdict);

                submissionRepository.save(submission);

                return;
            }
        }

        submission.setVerdict("ACCEPTED");

        submissionRepository.save(submission);
        System.out.println("SETTING ACCEPTED");
    }
}