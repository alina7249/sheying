package com.yupi.yuoj.model.dto.post;

import lombok.Data;

@Data
public class PostAuditRequest {
    private Long postId;
    private String auditStatus;
    private String auditNote;
}