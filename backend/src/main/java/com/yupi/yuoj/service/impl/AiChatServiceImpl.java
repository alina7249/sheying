package com.yupi.yuoj.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yupi.yuoj.common.ErrorCode;
import com.yupi.yuoj.exception.BusinessException;
import com.yupi.yuoj.mapper.AiChatMapper;
import com.yupi.yuoj.model.entity.AiChat;
import com.yupi.yuoj.model.entity.User;
import com.yupi.yuoj.model.vo.AiChatVO;
import com.yupi.yuoj.service.AiChatService;
import com.yupi.yuoj.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.*;

@Service
public class AiChatServiceImpl extends ServiceImpl<AiChatMapper, AiChat> implements AiChatService {

    @Resource
    private UserService userService;

    @Value("${zhipu.api-key:}")
    private String apiKey;

    private static final String ZHIPU_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
    private static final String MODEL = "glm-4-flash";
    private static final String SYSTEM_PROMPT = "你是一个专业的摄影助手，名叫「光影小助手」。请你用中文回答用户关于摄影技巧、器材推荐、后期处理、构图美学等方面的问题。回答要专业、简洁、有温度。";

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public AiChatVO chat(String message, String sessionId, HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        if (loginUser == null) throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);

        if (sessionId == null || sessionId.isEmpty()) {
            sessionId = "session_" + loginUser.getId() + "_" + System.currentTimeMillis();
        }

        // Save user message
        AiChat userChat = new AiChat();
        userChat.setUserId(loginUser.getId());
        userChat.setRole("user");
        userChat.setContent(message);
        userChat.setSessionId(sessionId);
        this.save(userChat);

        String reply;
        try {
            reply = callZhipuApi(message, sessionId);
        } catch (Exception e) {
            reply = "抱歉，AI服务暂时不可用，请稍后再试。错误信息：" + e.getMessage();
        }

        // Save assistant reply
        AiChat assistantChat = new AiChat();
        assistantChat.setUserId(loginUser.getId());
        assistantChat.setRole("assistant");
        assistantChat.setContent(reply);
        assistantChat.setSessionId(sessionId);
        this.save(assistantChat);

        AiChatVO vo = AiChatVO.objToVo(assistantChat);
        vo.setSessionId(sessionId);
        return vo;
    }

    private String callZhipuApi(String message, String sessionId) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        Map<String, Object> body = new HashMap<>();
        body.put("model", MODEL);

        List<Map<String, String>> messages = new ArrayList<>();
        Map<String, String> sysMsg = new HashMap<>();
        sysMsg.put("role", "system");
        sysMsg.put("content", SYSTEM_PROMPT);
        messages.add(sysMsg);

        Map<String, String> userMsg = new HashMap<>();
        userMsg.put("role", "user");
        userMsg.put("content", message);
        messages.add(userMsg);

        body.put("messages", messages);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(ZHIPU_URL, entity, Map.class);

        if (response.getBody() != null) {
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
            if (choices != null && !choices.isEmpty()) {
                Map<String, Object> msg = (Map<String, Object>) choices.get(0).get("message");
                if (msg != null) {
                    return (String) msg.get("content");
                }
            }
        }
        return "抱歉，我没有理解你的问题，请换个方式问问看。";
    }

    @Override
    public List<AiChatVO> getHistory(String sessionId, HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        if (loginUser == null) throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);

        QueryWrapper<AiChat> qw = new QueryWrapper<>();
        qw.eq("userId", loginUser.getId()).eq("sessionId", sessionId);
        qw.orderByAsc("createTime");
        List<AiChat> list = this.list(qw);
        List<AiChatVO> voList = new ArrayList<>();
        for (AiChat chat : list) {
            voList.add(AiChatVO.objToVo(chat));
        }
        return voList;
    }
}