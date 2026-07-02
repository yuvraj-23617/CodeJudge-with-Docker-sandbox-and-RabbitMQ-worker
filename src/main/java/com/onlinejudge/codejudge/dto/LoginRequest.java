package com.onlinejudge.codejudge.dto;

public class LoginRequest {
    private String username; // Changed from email to username
    private String password;

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}