package com.yupi.yuoj.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yupi.yuoj.common.BaseResponse;
import com.yupi.yuoj.common.ResultUtils;
import com.yupi.yuoj.model.entity.Post;
import com.yupi.yuoj.model.vo.PostVO;
import com.yupi.yuoj.service.PostService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/post/hot")
@Slf4j
public class HotPostController {

    @Resource
    private PostService postService;

    @GetMapping
    public BaseResponse<Page<PostVO>> getHotPosts(@RequestParam(defaultValue = "1") long current,
                                                   @RequestParam(defaultValue = "10") long pageSize,
                                                   HttpServletRequest request) {
        QueryWrapper<Post> qw = new QueryWrapper<>();
        qw.orderByDesc("thumbNum");
        qw.orderByDesc("favourNum");
        Page<Post> page = new Page<>(current, pageSize);
        Page<Post> postPage = postService.page(page, qw);
        Page<PostVO> voPage = postService.getPostVOPage(postPage, request);
        return ResultUtils.success(voPage);
    }
}