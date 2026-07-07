package com.onlinejudge.codejudge.controller;

import com.onlinejudge.codejudge.repository.ProblemRepository;
import com.onlinejudge.codejudge.repository.SubmissionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin; // Add this import

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/admin")
public class AdminController {

    private final ProblemRepository problemRepository;
    private final SubmissionRepository submissionRepository;

    public AdminController(ProblemRepository problemRepository,
                           SubmissionRepository submissionRepository) {
        this.problemRepository = problemRepository;
        this.submissionRepository = submissionRepository;
    }

    // Helper to validate admin role manually (since we don't have JWT/Spring Sec method security yet)
    // In production, use @PreAuthorize("hasRole('ADMIN')") instead
    private ResponseEntity<String> checkAdminRole(String roleHeader) {
        if (!"ADMIN".equals(roleHeader)) {
            return ResponseEntity.status(403).body("Forbidden: Admin access required");
        }
        return null; // null means OK
    }

    @DeleteMapping("/problems")
    public ResponseEntity<String> deleteAllProblems(@RequestHeader(value = "X-User-Role", required = false) String role) {
        ResponseEntity<String> authCheck = checkAdminRole(role);
        if (authCheck != null) return authCheck;

        try {
            problemRepository.deleteAll();
            return ResponseEntity.ok("✅ All problems deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("❌ Failed: " + e.getMessage());
        }
    }

    @DeleteMapping("/submissions")
    public ResponseEntity<String> deleteAllSubmissions(@RequestHeader(value = "X-User-Role", required = false) String role) {
        ResponseEntity<String> authCheck = checkAdminRole(role);
        if (authCheck != null) return authCheck;

        try {
            submissionRepository.deleteAll();
            return ResponseEntity.ok("✅ All submissions deleted.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("❌ Failed: " + e.getMessage());
        }
    }
}