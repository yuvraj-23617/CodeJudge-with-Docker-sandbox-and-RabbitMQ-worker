package com.onlinejudge.codejudge.controller;

import com.onlinejudge.codejudge.entity.Submission;
import com.onlinejudge.codejudge.repository.SubmissionRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/submissions")
public class SubmissionQueryController {

    private final SubmissionRepository submissionRepository;

    public SubmissionQueryController(
            SubmissionRepository submissionRepository) {

        this.submissionRepository =
                submissionRepository;
    }

    @GetMapping("/{id}")
    public Submission getSubmission(
            @PathVariable Long id) {

        return submissionRepository
                .findById(id)
                .orElse(null);
    }
}