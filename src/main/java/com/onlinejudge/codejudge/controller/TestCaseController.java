package com.onlinejudge.codejudge.controller;

import com.onlinejudge.codejudge.dto.TestCaseRequest;
import com.onlinejudge.codejudge.entity.Problem;
import com.onlinejudge.codejudge.entity.TestCase;
import com.onlinejudge.codejudge.repository.ProblemRepository;
import com.onlinejudge.codejudge.repository.TestCaseRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/testcases")
public class TestCaseController {

    private final TestCaseRepository testCaseRepository;
    private final ProblemRepository problemRepository;

    public TestCaseController(
            TestCaseRepository testCaseRepository,
            ProblemRepository problemRepository) {

        this.testCaseRepository = testCaseRepository;
        this.problemRepository = problemRepository;
    }

    @PostMapping
    public TestCase createTestCase(
            @RequestBody TestCaseRequest request) {

        Problem problem = problemRepository
                .findById(request.getProblemId())
                .orElse(null);

        if (problem == null) {
            return null;
        }

        TestCase testCase = new TestCase();

        testCase.setInput(request.getInput());
        testCase.setExpectedOutput(request.getExpectedOutput());
        testCase.setHidden(request.isHidden());
        testCase.setProblem(problem);

        return testCaseRepository.save(testCase);
    }
}