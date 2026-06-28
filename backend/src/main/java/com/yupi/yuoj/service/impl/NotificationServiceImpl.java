package com.yupi.yuoj.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yupi.yuoj.mapper.NotificationMapper;
import com.yupi.yuoj.model.entity.Notification;
import com.yupi.yuoj.service.NotificationService;
import org.springframework.stereotype.Service;

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
}