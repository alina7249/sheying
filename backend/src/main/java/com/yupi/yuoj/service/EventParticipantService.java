package com.yupi.yuoj.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.yupi.yuoj.model.entity.EventParticipant;

public interface EventParticipantService extends IService<EventParticipant> {
    boolean isRegistered(Long eventId, Long userId);
    long countByEventId(Long eventId);
}