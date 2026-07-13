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

    public JudgeWorker(SubmissionRepository submissionRepository,
                       JudgeService judgeService) {
        this.submissionRepository = submissionRepository;
        this.judgeService = judgeService;
    }

    @RabbitListener(queues = RabbitConfig.QUEUE)
    public void consume(String submissionIdString) {
        Long submissionId = Long.parseLong(submissionIdString);
        Submission submission = submissionRepository.findById(submissionId).orElse(null);
        if (submission == null) return;

        Problem problem = submission.getProblem();
        long totalExecutionTime = 0;
        int testCaseIndex = 0;

        for (TestCase tc : problem.getTestCases()) {
            long start = System.currentTimeMillis();

            String verdict = judgeService.judge(
                    submission.getLanguage(),
                    submission.getCode(),
                    tc.getInput(),
                    tc.getExpectedOutput(),
                    submissionId,
                    testCaseIndex
            );

            long end = System.currentTimeMillis();
            totalExecutionTime += (end - start);

            if (!verdict.equals("ACCEPTED")) {
                submission.setVerdict(verdict);
                submission.setExecutionTime(totalExecutionTime);
                submissionRepository.save(submission);
                return;
            }

            testCaseIndex++;
        }

        submission.setVerdict("ACCEPTED");
        submission.setExecutionTime(totalExecutionTime);
        submissionRepository.save(submission);
    }
}