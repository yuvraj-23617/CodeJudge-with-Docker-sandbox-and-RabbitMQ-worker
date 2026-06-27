package com.onlinejudge.codejudge.repository;

import com.onlinejudge.codejudge.entity.TestCase;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestCaseRepository
        extends JpaRepository<TestCase, Long> {
}