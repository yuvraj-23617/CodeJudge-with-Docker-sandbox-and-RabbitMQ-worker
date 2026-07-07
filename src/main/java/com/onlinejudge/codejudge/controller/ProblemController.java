package com.onlinejudge.codejudge.controller;

import com.onlinejudge.codejudge.entity.Problem;
import com.onlinejudge.codejudge.entity.TestCase;
import com.onlinejudge.codejudge.repository.ProblemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin; // Add this import

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/problems")
public class ProblemController {

    private final ProblemRepository problemRepository;

    public ProblemController(ProblemRepository problemRepository) {
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

    // ✅ NEW: Update Problem (used for adding test cases to existing problems)
    @PutMapping("/{id}")
    public ResponseEntity<Problem> updateProblem(@PathVariable Long id, @RequestBody Problem problemDetails) {
        Optional<Problem> optionalProblem = problemRepository.findById(id);
        if (optionalProblem.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Problem problem = optionalProblem.get();
        problem.setTitle(problemDetails.getTitle());
        problem.setDescription(problemDetails.getDescription());
        problem.setDifficulty(problemDetails.getDifficulty());
        problem.setConstraints(problemDetails.getConstraints());
        problem.setSampleInput(problemDetails.getSampleInput());
        problem.setSampleOutput(problemDetails.getSampleOutput());

        // Handle Test Cases: Clear old ones and add new ones from request
        if (problemDetails.getTestCases() != null) {
            problem.getTestCases().clear();
            for (TestCase tc : problemDetails.getTestCases()) {
                tc.setProblem(problem);
                problem.getTestCases().add(tc);
            }
        }

        return ResponseEntity.ok(problemRepository.save(problem));
    }

    @GetMapping
    public List<Problem> getAllProblems() {
        return problemRepository.findAll();
    }

    @GetMapping("/{id}")
    public Problem getProblemById(@PathVariable Long id) {
        return problemRepository.findById(id).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void deleteProblem(@PathVariable Long id) {
        problemRepository.deleteById(id);
    }
}