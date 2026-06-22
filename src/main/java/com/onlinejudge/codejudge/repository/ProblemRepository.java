package com.onlinejudge.codejudge.repository;

import com.onlinejudge.codejudge.entity.Problem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProblemRepository
        extends JpaRepository<Problem, Long> {
}