package com.yupi.yuoj.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yupi.yuoj.common.BaseResponse;
import com.yupi.yuoj.common.DeleteRequest;
import com.yupi.yuoj.common.ErrorCode;
import com.yupi.yuoj.common.ResultUtils;
import com.yupi.yuoj.exception.BusinessException;
import com.yupi.yuoj.exception.ThrowUtils;
import com.yupi.yuoj.model.dto.event.EventAddRequest;
import com.yupi.yuoj.model.dto.event.EventQueryRequest;
import com.yupi.yuoj.model.dto.event.EventUpdateRequest;
import com.yupi.yuoj.model.entity.Event;
import com.yupi.yuoj.model.entity.EventParticipant;
import com.yupi.yuoj.model.entity.User;
import com.yupi.yuoj.model.vo.EventVO;
import com.yupi.yuoj.service.EventParticipantService;
import com.yupi.yuoj.service.EventService;
import com.yupi.yuoj.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/event")
@Slf4j
public class EventController {

    @Resource
    private EventService eventService;
    @Resource
    private EventParticipantService participantService;
    @Resource
    private UserService userService;

    @PostMapping("/add")
    public BaseResponse<Long> addEvent(@RequestBody EventAddRequest req, HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        if (loginUser == null) throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        Event event = new Event();
        BeanUtils.copyProperties(req, event);
        event.setUserId(loginUser.getId());
        event.setStatus("upcoming");
        eventService.validEvent(event, true);
        boolean result = eventService.save(event);
        ThrowUtils.throwIf(!result, ErrorCode.OPERATION_ERROR);
        return ResultUtils.success(event.getId());
    }

    @DeleteMapping("/delete")
    public BaseResponse<Boolean> deleteEvent(@RequestBody DeleteRequest req, HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        if (loginUser == null) throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        Event event = eventService.getById(req.getId());
        if (event == null) throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        if (!event.getUserId().equals(loginUser.getId()) && !userService.isAdmin(loginUser))
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR);
        boolean result = eventService.removeById(req.getId());
        return ResultUtils.success(result);
    }

    @PutMapping("/update")
    public BaseResponse<Boolean> updateEvent(@RequestBody EventUpdateRequest req, HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        if (loginUser == null) throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        Event event = eventService.getById(req.getId());
        if (event == null) throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        if (!event.getUserId().equals(loginUser.getId()) && !userService.isAdmin(loginUser))
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR);
        BeanUtils.copyProperties(req, event);
        eventService.validEvent(event, false);
        boolean result = eventService.updateById(event);
        return ResultUtils.success(result);
    }

    @GetMapping("/get/{id}")
    public BaseResponse<EventVO> getEventById(@PathVariable Long id, HttpServletRequest request) {
        Event event = eventService.getById(id);
        if (event == null) throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        EventVO vo = EventVO.objToVo(event);
        User user = userService.getById(event.getUserId());
        if (user != null) {
            com.yupi.yuoj.model.vo.UserVO userVO = new com.yupi.yuoj.model.vo.UserVO();
            BeanUtils.copyProperties(user, userVO);
            vo.setUser(userVO);
        }
        User loginUser = null;
        try { loginUser = userService.getLoginUser(request); } catch (Exception ignored) {}
        if (loginUser != null) {
            vo.setIsRegistered(participantService.isRegistered(id, loginUser.getId()));
        }
        return ResultUtils.success(vo);
    }

    @GetMapping("/list")
    public BaseResponse<Page<Event>> listEvents(EventQueryRequest req) {
        QueryWrapper<Event> qw = new QueryWrapper<>();
        if (req.getTitle() != null) qw.like("title", req.getTitle());
        if (req.getStatus() != null) qw.eq("status", req.getStatus());
        qw.orderByDesc("createTime");
        Page<Event> page = new Page<>(req.getCurrent(), req.getPageSize());
        Page<Event> result = eventService.page(page, qw);
        return ResultUtils.success(result);
    }

    @PostMapping("/register/{eventId}")
    public BaseResponse<Boolean> registerEvent(@PathVariable Long eventId, HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        if (loginUser == null) throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        Event event = eventService.getById(eventId);
        if (event == null) throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        if (participantService.isRegistered(eventId, loginUser.getId()))
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "已报名该活动");
        if (event.getMaxParticipants() != null && event.getCurrentParticipants() >= event.getMaxParticipants())
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "活动报名已满");
        EventParticipant participant = new EventParticipant();
        participant.setEventId(eventId);
        participant.setUserId(loginUser.getId());
        participant.setStatus("registered");
        boolean result = participantService.save(participant);
        if (result) {
            event.setCurrentParticipants(event.getCurrentParticipants() + 1);
            eventService.updateById(event);
        }
        return ResultUtils.success(result);
    }

    @PostMapping("/cancel/{eventId}")
    public BaseResponse<Boolean> cancelRegistration(@PathVariable Long eventId, HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        if (loginUser == null) throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        QueryWrapper<EventParticipant> qw = new QueryWrapper<>();
        qw.eq("eventId", eventId).eq("userId", loginUser.getId());
        EventParticipant participant = participantService.getOne(qw);
        if (participant == null) throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "未报名该活动");
        boolean result = participantService.removeById(participant.getId());
        if (result) {
            Event event = eventService.getById(eventId);
            if (event != null && event.getCurrentParticipants() > 0) {
                event.setCurrentParticipants(event.getCurrentParticipants() - 1);
                eventService.updateById(event);
            }
        }
        return ResultUtils.success(result);
    }

    @GetMapping("/my-registrations")
    public BaseResponse<List<EventVO>> getMyRegistrations(HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        if (loginUser == null) throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        QueryWrapper<EventParticipant> qw = new QueryWrapper<>();
        qw.eq("userId", loginUser.getId());
        List<EventParticipant> participants = participantService.list(qw);
        List<EventVO> voList = participants.stream().map(p -> {
            Event event = eventService.getById(p.getEventId());
            return event != null ? EventVO.objToVo(event) : null;
        }).filter(v -> v != null).collect(Collectors.toList());
        return ResultUtils.success(voList);
    }
}