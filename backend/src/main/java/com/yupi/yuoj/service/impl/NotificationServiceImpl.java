package com.yupi.yuoj.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yupi.yuoj.mapper.NotificationMapper;
import com.yupi.yuoj.model.entity.Notification;
import com.yupi.yuoj.service.NotificationService;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class NotificationServiceImpl extends ServiceImpl<NotificationMapper, Notification> implements NotificationService {

    @Override
    public int getUnreadCount(Long userId) {
        QueryWrapper<Notification> qw = new QueryWrapper<>();
        qw.eq("userId", userId).eq("isRead", 0);
        return Math.toIntExact(this.count(qw));
    }

    @Override
    public int markAllAsRead(Long userId) {
        Notification update = new Notification();
        update.setIsRead(1);
        QueryWrapper<Notification> qw = new QueryWrapper<>();
        qw.eq("userId", userId).eq("isRead", 0);
        return this.baseMapper.update(update, qw);
    }

    @Override
    @Async
    public void createNotification(Long userId, String type, String title, String content, Long relatedId) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setType(type);
        notification.setTitle(title);
        notification.setContent(content);
        notification.setRelatedId(relatedId);
        notification.setIsRead(0);
        notification.setCreateTime(new Date());
        this.save(notification);
    }
}