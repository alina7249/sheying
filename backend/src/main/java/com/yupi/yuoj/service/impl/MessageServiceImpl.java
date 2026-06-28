package com.yupi.yuoj.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yupi.yuoj.common.ErrorCode;
import com.yupi.yuoj.exception.BusinessException;
import com.yupi.yuoj.mapper.MessageMapper;
import com.yupi.yuoj.model.entity.Message;
import com.yupi.yuoj.model.entity.User;
import com.yupi.yuoj.model.vo.MessageVO;
import com.yupi.yuoj.model.vo.UserVO;
import com.yupi.yuoj.service.MessageService;
import com.yupi.yuoj.service.UserService;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

@Service
public class MessageServiceImpl extends ServiceImpl<MessageMapper, Message> implements MessageService {

    @Resource
    private UserService userService;

    @Override
    public List<MessageVO> getConversation(Long userId, Long targetUserId, HttpServletRequest request) {
        QueryWrapper<Message> qw = new QueryWrapper<>();
        qw.and(w -> w.eq("fromUserId", userId).eq("toUserId", targetUserId)
                .or().eq("fromUserId", targetUserId).eq("toUserId", userId));
        qw.orderByAsc("createTime");
        List<Message> messages = this.list(qw);
        List<MessageVO> voList = new ArrayList<>();
        for (Message msg : messages) {
            MessageVO vo = MessageVO.objToVo(msg);
            User fromUser = userService.getById(msg.getFromUserId());
            User toUser = userService.getById(msg.getToUserId());
            if (fromUser != null) {
                UserVO fromVO = new UserVO();
                BeanUtils.copyProperties(fromUser, fromVO);
                vo.setFromUser(fromVO);
            }
            if (toUser != null) {
                UserVO toVO = new UserVO();
                BeanUtils.copyProperties(toUser, toVO);
                vo.setToUser(toVO);
            }
            voList.add(vo);
        }
        return voList;
    }

    @Override
    public List<MessageVO> getConversationList(Long userId, HttpServletRequest request) {
        QueryWrapper<Message> qw = new QueryWrapper<>();
        qw.eq("toUserId", userId).or().eq("fromUserId", userId);
        qw.orderByDesc("createTime");
        qw.groupBy("LEAST(fromUserId, toUserId), GREATEST(fromUserId, toUserId)");
        List<Message> messages = this.list(qw);
        List<MessageVO> voList = new ArrayList<>();
        for (Message msg : messages) {
            MessageVO vo = MessageVO.objToVo(msg);
            Long otherUserId = msg.getFromUserId().equals(userId) ? msg.getToUserId() : msg.getFromUserId();
            User otherUser = userService.getById(otherUserId);
            if (otherUser != null) {
                UserVO otherVO = new UserVO();
                BeanUtils.copyProperties(otherUser, otherVO);
                vo.setFromUser(otherVO);
            }
            voList.add(vo);
        }
        return voList;
    }

    @Override
    public Long sendMessage(Message message, HttpServletRequest request) {
        if (message.getFromUserId() == null || message.getToUserId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        if (message.getContent() == null || message.getContent().trim().isEmpty()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "消息内容不能为空");
        }
        this.save(message);
        return message.getId();
    }

    @Override
    public int markAsRead(Long fromUserId, Long toUserId) {
        Message update = new Message();
        update.setIsRead(1);
        QueryWrapper<Message> qw = new QueryWrapper<>();
        qw.eq("fromUserId", fromUserId).eq("toUserId", toUserId).eq("isRead", 0);
        return this.baseMapper.update(update, qw);
    }
}