package com.example.ptsd.model;

public class PclResponse {
    private int totalScore;
    private String riskLevel;

    public PclResponse(int totalScore, String riskLevel) {
        this.totalScore = totalScore;
        this.riskLevel = riskLevel;
    }

    public int getTotalScore() {
        return totalScore;
    }

    public String getRiskLevel() {
        return riskLevel;
    }
}
