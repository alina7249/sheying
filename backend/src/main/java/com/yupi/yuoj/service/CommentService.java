package com.yupi.yuoj.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.yupi.yuoj.model.dto.comment.CommentQueryRequest;
import com.yupi.yuoj.model.entity.Comment;
import com.yupi.yuoj.model.vo.CommentVO;
import javax.servlet.http.HttpServletRequest;

public interface CommentService extends IService<Comment> {

    void validComment(Comment comment, boolean add);

    QueryWrapper<Comment> getQueryWrapper(CommentQueryRequest commentQueryRequest);

    CommentVO getCommentVO(Comment comment, HttpServletRequest request);

    Page<CommentVO> getCommentVOPage(Page<Comment> commentPage, HttpServletRequest request);
}
