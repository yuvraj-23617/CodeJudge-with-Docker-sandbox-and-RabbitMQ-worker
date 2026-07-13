package com.onlinejudge.codejudge.controller;

import com.onlinejudge.codejudge.dto.SubmissionRequest;
import com.onlinejudge.codejudge.entity.Problem;
import com.onlinejudge.codejudge.entity.Submission;
import com.onlinejudge.codejudge.repository.ProblemRepository;
import com.onlinejudge.codejudge.repository.SubmissionRepository;
import com.onlinejudge.codejudge.service.JudgeService;
import com.onlinejudge.codejudge.entity.TestCase;
import com.onlinejudge.codejudge.service.SubmissionProducer;
import org.springframework.web.bind.annotation.CrossOrigin; // Add this import

import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@CrossOrigin(origins = "*")
@RestController
public class SubmissionController {

    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;
    private final JudgeService judgeService;
    private final SubmissionProducer submissionProducer;

    public SubmissionController(
            SubmissionRepository submissionRepository,
            ProblemRepository problemRepository,
            JudgeService judgeService,
            SubmissionProducer submissionProducer) {

        this.submissionRepository = submissionRepository;
        this.problemRepository = problemRepository;
        this.judgeService = judgeService;
        this.submissionProducer = submissionProducer;
    }

//    @PostMapping("/run-python")
//    public String runPython(@RequestBody String code) {
//        return judgeService.executePython(code);
//    }

    // Add this inside your SubmissionController class
    @GetMapping("/submissions/{id}")
    public Submission getSubmissionStatus(@PathVariable Long id) {
        return submissionRepository.findById(id).orElse(null);
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

        submission.setVerdict("PENDING");

        Submission savedSubmission =
                submissionRepository.save(submission);

        submissionProducer.send(
                savedSubmission.getId()
        );

        return savedSubmission;
    }
}