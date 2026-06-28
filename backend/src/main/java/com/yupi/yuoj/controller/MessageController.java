package com.yupi.yuoj.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yupi.yuoj.annotation.AuthCheck;
import com.yupi.yuoj.common.BaseResponse;
import com.yupi.yuoj.common.ErrorCode;
import com.yupi.yuoj.common.ResultUtils;
import com.yupi.yuoj.exception.BusinessException;
import com.yupi.yuoj.exception.ThrowUtils;
import com.yupi.yuoj.model.dto.message.MessageAddRequest;
import com.yupi.yuoj.model.dto.message.MessageQueryRequest;
import com.yupi.yuoj.model.entity.Message;
import com.yupi.yuoj.model.entity.User;
import com.yupi.yuoj.model.vo.MessageVO;
import com.yupi.yuoj.service.MessageService;
import com.yupi.yuoj.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/message")
@Slf4j
public class MessageController {

    @Resource
    private MessageService messageService;
    @Resource
    private UserService userService;

    @PostMapping("/send")
    public BaseResponse<Long> sendMessage(@RequestBody MessageAddRequest req, HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        if (loginUser == null) throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        Message message = new Message();
        message.setFromUserId(loginUser.getId());
        message.setToUserId(req.getToUserId());
        message.setContent(req.getContent());
        Long id = messageService.sendMessage(message, request);
        return ResultUtils.success(id);
    }

    @GetMapping("/conversation/{targetUserId}")
    public BaseResponse<List<MessageVO>> getConversation(@PathVariable Long targetUserId, HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        if (loginUser == null) throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        List<MessageVO> list = messageService.getConversation(loginUser.getId(), targetUserId, request);
        messageService.markAsRead(targetUserId, loginUser.getId());
        return ResultUtils.success(list);
    }

    @GetMapping("/conversations")
    public BaseResponse<List<MessageVO>> getConversationList(HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        if (loginUser == null) throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        List<MessageVO> list = messageService.getConversationList(loginUser.getId(), request);
        return ResultUtils.success(list);
    }

    @GetMapping("/list")
    public BaseResponse<Page<Message>> listMessages(MessageQueryRequest req) {
        QueryWrapper<Message> qw = new QueryWrapper<>();
        if (req.getFromUserId() != null) qw.eq("fromUserId", req.getFromUserId());
        if (req.getToUserId() != null) qw.eq("toUserId", req.getToUserId());
        if (req.getIsRead() != null) qw.eq("isRead", req.getIsRead());
        qw.orderByDesc("createTime");
        Page<Message> page = new Page<>(req.getCurrent(), req.getPageSize());
        Page<Message> result = messageService.page(page, qw);
        return ResultUtils.success(result);
    }
}