package com.yupi.yuoj.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yupi.yuoj.common.ErrorCode;
import com.yupi.yuoj.constant.CommonConstant;
import com.yupi.yuoj.exception.ThrowUtils;
import com.yupi.yuoj.mapper.CommentMapper;
import com.yupi.yuoj.model.dto.comment.CommentQueryRequest;
import com.yupi.yuoj.model.entity.Comment;
import com.yupi.yuoj.model.entity.User;
import com.yupi.yuoj.model.vo.CommentVO;
import com.yupi.yuoj.model.vo.UserVO;
import com.yupi.yuoj.service.CommentService;
import com.yupi.yuoj.service.UserService;
import com.yupi.yuoj.utils.SqlUtils;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class CommentServiceImpl extends ServiceImpl<CommentMapper, Comment> implements CommentService {

    @Resource
    private UserService userService;

    @Override
    public void validComment(Comment comment, boolean add) {
        ThrowUtils.throwIf(comment == null, ErrorCode.PARAMS_ERROR);
        String content = comment.getContent();
        Long postId = comment.getPostId();
        if (add) {
            ThrowUtils.throwIf(StringUtils.isBlank(content), ErrorCode.PARAMS_ERROR, "评论内容不能为空");
            ThrowUtils.throwIf(postId == null || postId <= 0, ErrorCode.PARAMS_ERROR, "帖子 id 不能为空");
        }
        if (StringUtils.isNotBlank(content) && content.length() > 1024) {
            throw new com.yupi.yuoj.exception.BusinessException(ErrorCode.PARAMS_ERROR, "评论内容过长");
        }
    }

    @Override
    public QueryWrapper<Comment> getQueryWrapper(CommentQueryRequest commentQueryRequest) {
        QueryWrapper<Comment> queryWrapper = new QueryWrapper<>();
        if (commentQueryRequest == null) {
            return queryWrapper;
        }
        Long id = commentQueryRequest.getId();
        Long postId = commentQueryRequest.getPostId();
        Long userId = commentQueryRequest.getUserId();
        String content = commentQueryRequest.getContent();
        String sortField = commentQueryRequest.getSortField();
        String sortOrder = commentQueryRequest.getSortOrder();
        queryWrapper.eq(ObjectUtils.isNotEmpty(id), "id", id);
        queryWrapper.eq(ObjectUtils.isNotEmpty(postId), "postId", postId);
        queryWrapper.eq(ObjectUtils.isNotEmpty(userId), "userId", userId);
        queryWrapper.like(StringUtils.isNotBlank(content), "content", content);
        queryWrapper.eq("isDelete", false);
        queryWrapper.orderBy(SqlUtils.validSortField(sortField), sortOrder.equals(CommonConstant.SORT_ORDER_ASC),
                sortField);
        queryWrapper.orderByDesc("createTime");
        return queryWrapper;
    }

    @Override
    public CommentVO getCommentVO(Comment comment, HttpServletRequest request) {
        CommentVO commentVO = CommentVO.objToVo(comment);
        Long userId = comment.getUserId();
        User user = null;
        if (userId != null && userId > 0) {
            user = userService.getById(userId);
        }
        UserVO userVO = userService.getUserVO(user);
        commentVO.setUser(userVO);
        return commentVO;
    }

    @Override
    public Page<CommentVO> getCommentVOPage(Page<Comment> commentPage, HttpServletRequest request) {
        List<Comment> commentList = commentPage.getRecords();
        Page<CommentVO> commentVOPage = new Page<>(commentPage.getCurrent(), commentPage.getSize(), commentPage.getTotal());
        if (commentList == null || commentList.isEmpty()) {
            return commentVOPage;
        }
        Set<Long> userIdSet = commentList.stream().map(Comment::getUserId).collect(Collectors.toSet());
        Map<Long, List<User>> userIdUserListMap = userService.listByIds(userIdSet).stream()
                .collect(Collectors.groupingBy(User::getId));
        List<CommentVO> commentVOList = commentList.stream().map(comment -> {
            CommentVO commentVO = CommentVO.objToVo(comment);
            Long userId = comment.getUserId();
            User user = null;
            if (userIdUserListMap.containsKey(userId)) {
                user = userIdUserListMap.get(userId).get(0);
            }
            commentVO.setUser(userService.getUserVO(user));
            return commentVO;
        }).collect(Collectors.toList());
        commentVOPage.setRecords(commentVOList);
        return commentVOPage;
    }
}
