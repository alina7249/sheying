package com.yupi.yuoj.controller;

import com.yupi.yuoj.common.BaseResponse;
import com.yupi.yuoj.common.ErrorCode;
import com.yupi.yuoj.common.ResultUtils;
import com.yupi.yuoj.exception.BusinessException;
import com.yupi.yuoj.model.dto.ai_chat.AiChatRequest;
import com.yupi.yuoj.model.entity.User;
import com.yupi.yuoj.model.vo.AiChatVO;
import com.yupi.yuoj.service.AiChatService;
import com.yupi.yuoj.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/ai")
@Slf4j
public class AiChatController {

    @Resource
    private AiChatService aiChatService;
    @Resource
    private UserService userService;

    @PostMapping("/chat")
    public BaseResponse<AiChatVO> chat(@RequestBody AiChatRequest req, HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        if (loginUser == null) throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        if (req.getMessage() == null || req.getMessage().trim().isEmpty())
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "消息不能为空");
        AiChatVO vo = aiChatService.chat(req.getMessage(), req.getSessionId(), request);
        return ResultUtils.success(vo);
    }

    @GetMapping("/history")
    public BaseResponse<List<AiChatVO>> getHistory(@RequestParam String sessionId, HttpServletRequest request) {
        if (sessionId == null || sessionId.isEmpty())
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        List<AiChatVO> list = aiChatService.getHistory(sessionId, request);
        return ResultUtils.success(list);
    }
}