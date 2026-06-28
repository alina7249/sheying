package com.yupi.yuoj.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yupi.yuoj.common.ErrorCode;
import com.yupi.yuoj.exception.BusinessException;
import com.yupi.yuoj.mapper.EventMapper;
import com.yupi.yuoj.model.entity.Event;
import com.yupi.yuoj.service.EventService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

@Service
public class EventServiceImpl extends ServiceImpl<EventMapper, Event> implements EventService {

    @Override
    public void validEvent(Event event, boolean add) {
        if (event == null) throw new BusinessException(ErrorCode.PARAMS_ERROR);
        if (add) {
            if (StringUtils.isAnyBlank(event.getTitle(), event.getContent()))
                throw new BusinessException(ErrorCode.PARAMS_ERROR);
            if (event.getStartTime() == null || event.getEndTime() == null)
                throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
    }
}