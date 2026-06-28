package com.yupi.yuoj.model.dto.report;

import lombok.Data;

@Data
public class ReportAddRequest {
    private Long targetId;
    private String targetType;
    private String reason;
    private String description;
}