package com.onlinejudge.codejudge.repository;

import com.onlinejudge.codejudge.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

}