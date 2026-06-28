package com.yupi.yuoj.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.yupi.yuoj.model.entity.Message;
import com.yupi.yuoj.model.vo.MessageVO;
import javax.servlet.http.HttpServletRequest;
import java.util.List;

public interface MessageService extends IService<Message> {
    List<MessageVO> getConversation(Long userId, Long targetUserId, HttpServletRequest request);
    List<MessageVO> getConversationList(Long userId, HttpServletRequest request);
    Long sendMessage(Message message, HttpServletRequest request);
    int markAsRead(Long fromUserId, Long toUserId);
}