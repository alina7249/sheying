package com.yupi.yuoj.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yupi.yuoj.common.BaseResponse;
import com.yupi.yuoj.common.ErrorCode;
import com.yupi.yuoj.common.ResultUtils;
import com.yupi.yuoj.exception.BusinessException;
import com.yupi.yuoj.model.dto.notification.NotificationQueryRequest;
import com.yupi.yuoj.model.entity.Notification;
import com.yupi.yuoj.model.entity.User;
import com.yupi.yuoj.service.NotificationService;
import com.yupi.yuoj.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/notification")
@Slf4j
public class NotificationController {

    @Resource
    private NotificationService notificationService;
    @Resource
    private UserService userService;

    @GetMapping("/list")
    public BaseResponse<Page<Notification>> listNotifications(NotificationQueryRequest req, HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        if (loginUser == null) throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        QueryWrapper<Notification> qw = new QueryWrapper<>();
        qw.eq("userId", loginUser.getId());
        if (req.getType() != null) qw.eq("type", req.getType());
        if (req.getIsRead() != null) qw.eq("isRead", req.getIsRead());
        qw.orderByDesc("createTime");
        Page<Notification> page = new Page<>(req.getCurrent(), req.getPageSize());
        Page<Notification> result = notificationService.page(page, qw);
        return ResultUtils.success(result);
    }

    @GetMapping("/unread-count")
    public BaseResponse<Integer> getUnreadCount(HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        if (loginUser == null) throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        int count = notificationService.getUnreadCount(loginUser.getId());
        return ResultUtils.success(count);
    }

    @PostMapping("/read-all")
    public BaseResponse<Boolean> markAllAsRead(HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        if (loginUser == null) throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        notificationService.markAllAsRead(loginUser.getId());
        return ResultUtils.success(true);
    }
}