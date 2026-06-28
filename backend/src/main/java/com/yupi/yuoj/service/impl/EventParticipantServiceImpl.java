package com.yupi.yuoj.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yupi.yuoj.mapper.EventParticipantMapper;
import com.yupi.yuoj.model.entity.EventParticipant;
import com.yupi.yuoj.service.EventParticipantService;
import org.springframework.stereotype.Service;

@Service
public class EventParticipantServiceImpl extends ServiceImpl<EventParticipantMapper, EventParticipant> implements EventParticipantService {

    @Override
    public boolean isRegistered(Long eventId, Long userId) {
        QueryWrapper<EventParticipant> qw = new QueryWrapper<>();
        qw.eq("eventId", eventId).eq("userId", userId);
        return this.count(qw) > 0;
    }

    @Override
    public long countByEventId(Long eventId) {
        QueryWrapper<EventParticipant> qw = new QueryWrapper<>();
        qw.eq("eventId", eventId);
        return this.count(qw);
    }
}