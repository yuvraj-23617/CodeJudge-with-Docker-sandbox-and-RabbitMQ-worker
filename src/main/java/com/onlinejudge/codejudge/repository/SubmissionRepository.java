package com.onlinejudge.codejudge.repository;

import com.onlinejudge.codejudge.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubmissionRepository
        extends JpaRepository<Submission, Long> {
}