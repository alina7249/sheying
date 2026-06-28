package com.yupi.yuoj.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.yupi.yuoj.model.entity.AiChat;
import com.yupi.yuoj.model.vo.AiChatVO;
import javax.servlet.http.HttpServletRequest;
import java.util.List;

public interface AiChatService extends IService<AiChat> {
    AiChatVO chat(String message, String sessionId, HttpServletRequest request);
    List<AiChatVO> getHistory(String sessionId, HttpServletRequest request);
}