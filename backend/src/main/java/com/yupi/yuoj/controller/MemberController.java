package com.yupi.yuoj.controller;

import com.yupi.yuoj.common.BaseResponse;
import com.yupi.yuoj.common.ErrorCode;
import com.yupi.yuoj.common.ResultUtils;
import com.yupi.yuoj.exception.BusinessException;
import com.yupi.yuoj.model.entity.User;
import com.yupi.yuoj.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/member")
@Slf4j
public class MemberController {

    @Resource
    private UserService userService;

    @GetMapping("/info")
    public BaseResponse<Map<String, Object>> getMemberInfo(HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        if (loginUser == null) throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        Map<String, Object> info = new HashMap<>();
        info.put("memberLevel", loginUser.getMemberLevel() != null ? loginUser.getMemberLevel() : 0);
        info.put("memberBadge", loginUser.getMemberBadge());
        info.put("uploadQuota", loginUser.getUploadQuota() != null ? loginUser.getUploadQuota() : 10);
        String levelName;
        switch (loginUser.getMemberLevel() != null ? loginUser.getMemberLevel() : 0) {
            case 1: levelName = "银牌会员"; break;
            case 2: levelName = "金牌会员"; break;
            case 3: levelName = "钻石会员"; break;
            default: levelName = "普通用户"; break;
        }
        info.put("levelName", levelName);
        return ResultUtils.success(info);
    }

    @PostMapping("/upgrade")
    public BaseResponse<Map<String, Object>> upgradeMember(@RequestParam int level, HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        if (loginUser == null) throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        if (level < 1 || level > 3) throw new BusinessException(ErrorCode.PARAMS_ERROR, "会员等级无效");
        // 会员需要充钱，这里模拟支付成功
        loginUser.setMemberLevel(level);
        switch (level) {
            case 1: loginUser.setMemberBadge("silver"); loginUser.setUploadQuota(30); break;
            case 2: loginUser.setMemberBadge("gold"); loginUser.setUploadQuota(100); break;
            case 3: loginUser.setMemberBadge("diamond"); loginUser.setUploadQuota(500); break;
        }
        userService.updateById(loginUser);
        Map<String, Object> result = new HashMap<>();
        result.put("memberLevel", level);
        result.put("memberBadge", loginUser.getMemberBadge());
        result.put("uploadQuota", loginUser.getUploadQuota());
        return ResultUtils.success(result);
    }
}