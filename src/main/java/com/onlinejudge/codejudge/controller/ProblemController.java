package com.onlinejudge.codejudge.controller;

import com.onlinejudge.codejudge.entity.Problem;
import com.onlinejudge.codejudge.entity.TestCase;
import com.onlinejudge.codejudge.repository.ProblemRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/problems")
public class ProblemController {

    private final ProblemRepository problemRepository;

    public ProblemController(
            ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }

    @PostMapping
    public Problem createProblem(@RequestBody Problem problem) {

        if (problem.getTestCases() != null) {

            for (TestCase testCase : problem.getTestCases()) {
                testCase.setProblem(problem);
            }

        }

        return problemRepository.save(problem);
    }

    @GetMapping
    public List<Problem> getAllProblems() {

        return problemRepository.findAll();
    }

    @GetMapping("/{id}")
    public Problem getProblemById(
            @PathVariable Long id) {

        Optional<Problem> problem =
                problemRepository.findById(id);

        return problem.orElse(null);
    }

    @DeleteMapping("/{id}")
    public void deleteProblem(
            @PathVariable Long id) {

        problemRepository.deleteById(id);
    }
}