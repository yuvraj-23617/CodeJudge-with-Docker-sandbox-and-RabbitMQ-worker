package com.onlinejudge.codejudge.dto;

import java.io.Serializable;

public class SubmissionMessage implements Serializable {

    private Long submissionId;

    public Long getSubmissionId() {
        return submissionId;
    }

    public void setSubmissionId(Long submissionId) {
        this.submissionId = submissionId;
    }
}