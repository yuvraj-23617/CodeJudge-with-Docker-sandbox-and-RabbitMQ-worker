package com.onlinejudge.codejudge.controller;

import com.onlinejudge.codejudge.dto.SubmissionRequest;
import com.onlinejudge.codejudge.entity.Problem;
import com.onlinejudge.codejudge.entity.Submission;
import com.onlinejudge.codejudge.repository.ProblemRepository;
import com.onlinejudge.codejudge.repository.SubmissionRepository;
import com.onlinejudge.codejudge.service.JudgeService;
import com.onlinejudge.codejudge.entity.TestCase;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
public class SubmissionController {

    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;
    private final JudgeService judgeService;

    public SubmissionController(
            SubmissionRepository submissionRepository,
            ProblemRepository problemRepository,
            JudgeService judgeService) {

        this.submissionRepository = submissionRepository;
        this.problemRepository = problemRepository;
        this.judgeService = judgeService;
    }

    @PostMapping("/run-python")
    public String runPython(@RequestBody String code) {
        return judgeService.executePython(code);
    }

    @PostMapping("/submit")
    public Submission submit(
            @RequestBody SubmissionRequest request) {

        Problem problem = problemRepository
                .findById(request.getProblemId())
                .orElse(null);

        if (problem == null) {
            return null;
        }

        Submission submission = new Submission();

        submission.setCode(request.getCode());
        submission.setLanguage(request.getLanguage());
        submission.setProblem(problem);

        submission.setExecutionTime(0L);
        submission.setMemoryUsed(0L);
        submission.setSubmittedAt(LocalDateTime.now());

        for (TestCase tc : problem.getTestCases()) {

            String verdict =
                    judgeService.judge(
                            request.getLanguage(),
                            request.getCode(),
                            tc.getInput(),
                            tc.getExpectedOutput()
                    );

            if (!verdict.equals("ACCEPTED")) {

                submission.setVerdict(verdict);

                return submissionRepository.save(submission);
            }
        }


        for (TestCase tc : problem.getTestCases()) {

            String verdict =
                    judgeService.judge(
                            request.getLanguage(),
                            request.getCode(),
                            tc.getInput(),
                            tc.getExpectedOutput()
                    );

            if (!verdict.equals("ACCEPTED")) {

                submission.setVerdict(verdict);

                return submissionRepository.save(submission);
            }
        }

        submission.setVerdict("ACCEPTED");

        return submissionRepository.save(submission);
    }
}