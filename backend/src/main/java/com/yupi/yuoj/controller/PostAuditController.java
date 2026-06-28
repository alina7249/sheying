package com.yupi.yuoj.controller;

import com.yupi.yuoj.annotation.AuthCheck;
import com.yupi.yuoj.common.BaseResponse;
import com.yupi.yuoj.common.ErrorCode;
import com.yupi.yuoj.common.ResultUtils;
import com.yupi.yuoj.constant.UserConstant;
import com.yupi.yuoj.exception.BusinessException;
import com.yupi.yuoj.model.dto.post.PostAuditRequest;
import com.yupi.yuoj.model.entity.Post;
import com.yupi.yuoj.service.PostService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import javax.annotation.Resource;

@RestController
@RequestMapping("/api/post")
@Slf4j
public class PostAuditController {

    @Resource
    private PostService postService;

    @PostMapping("/audit")
    @AuthCheck(mustRole = UserConstant.ADMIN_ROLE)
    public BaseResponse<Boolean> auditPost(@RequestBody PostAuditRequest req) {
        Post post = postService.getById(req.getPostId());
        if (post == null) throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        post.setAuditStatus(req.getAuditStatus());
        post.setAuditNote(req.getAuditNote());
        postService.updateById(post);
        return ResultUtils.success(true);
    }
}