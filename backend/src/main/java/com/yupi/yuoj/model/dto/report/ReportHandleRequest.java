package com.yupi.yuoj.model.dto.report;

import lombok.Data;

@Data
public class ReportHandleRequest {
    private Long reportId;
    private String status;
    private String handleNote;
}