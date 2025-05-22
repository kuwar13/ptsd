package com.example.ptsd.controller;

import com.example.ptsd.model.PclRequest;
import com.example.ptsd.model.PclResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pcl")
@CrossOrigin(origins = "http://localhost:4200") // Angular frontend
public class PclController {

    @PostMapping("/pcl-c/score")
    public PclResponse calculateScore(@RequestBody PclRequest request) {
        List<Integer> responses = request.getResponses();
        int total = responses.stream().mapToInt(Integer::intValue).sum();
        String risk = getRiskLevel(total);

        return new PclResponse(total, risk);
    }

    @PostMapping("/pcl-5/score")
    public PclResponse scorePcl5(@RequestBody PclRequest request) {
        int total = request.getResponses().stream().mapToInt(Integer::intValue).sum();
        String risk = getRiskLevelForPcl5(total);
        return new PclResponse(total, risk);
    }

    private String getRiskLevel(int score) {
        if (score >= 50) return "High Risk";
        if (score >= 30) return "Moderate Risk";
        return "Low Risk";
    }

    private String getRiskLevelForPcl5(int score) {
        if (score >= 60) return "High Risk";
        if (score >= 44) return "Moderate Risk";
        if (score >= 32) return "Low Risk";
        return "No PTSD";
    }
}
