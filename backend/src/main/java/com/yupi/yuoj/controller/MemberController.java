package com.yupi.yuoj.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.yupi.yuoj.common.BaseResponse;
import com.yupi.yuoj.common.ErrorCode;
import com.yupi.yuoj.common.ResultUtils;
import com.yupi.yuoj.exception.BusinessException;
import com.yupi.yuoj.model.entity.MembershipPlan;
import com.yupi.yuoj.model.entity.User;
import com.yupi.yuoj.service.MembershipPlanService;
import com.yupi.yuoj.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/membership")
@Slf4j
public class MemberController {

    @Resource
    private MembershipPlanService membershipPlanService;

    @Resource
    private UserService userService;

    @GetMapping("/plans")
    public BaseResponse<List<Map<String, Object>>> getPlans() {
        QueryWrapper<MembershipPlan> qw = new QueryWrapper<>();
        qw.eq("isActive", 1).orderByAsc("sort");
        List<MembershipPlan> plans = membershipPlanService.list(qw);
        List<Map<String, Object>> result = plans.stream().map(p -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", p.getId());
            m.put("name", p.getName());
            m.put("duration", p.getDuration());
            m.put("price", p.getPrice());
            m.put("originalPrice", p.getOriginalPrice());
            m.put("description", p.getDescription());
            m.put("benefits", p.getBenefits());
            return m;
        }).collect(Collectors.toList());
        return ResultUtils.success(result);
    }

    @GetMapping("/info")
    public BaseResponse<Map<String, Object>> getMemberInfo(HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        if (loginUser == null) throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        Map<String, Object> info = new HashMap<>();
        info.put("memberLevel", loginUser.getMemberLevel() != null ? loginUser.getMemberLevel() : 0);
        info.put("memberBadge", loginUser.getMemberBadge());
        info.put("memberExpireTime", loginUser.getMemberExpireTime());
        String levelName;
        switch (loginUser.getMemberLevel() != null ? loginUser.getMemberLevel() : 0) {
            case 1: levelName = "铜牌会员"; break;
            case 2: levelName = "银牌会员"; break;
            case 3: levelName = "金牌会员"; break;
            default: levelName = "普通用户"; break;
        }
        info.put("levelName", levelName);
        info.put("dailyUploadUsed", loginUser.getDailyUploadUsed() != null ? loginUser.getDailyUploadUsed() : 0);
        info.put("dailyUploadLimit", loginUser.getDailyUploadLimit() != null ? loginUser.getDailyUploadLimit() : 10);

        long remainingDays = 0;
        if (loginUser.getMemberExpireTime() != null) {
            remainingDays = (loginUser.getMemberExpireTime().getTime() - System.currentTimeMillis()) / (1000 * 60 * 60 * 24);
            if (remainingDays < 0) remainingDays = 0;
        }
        info.put("remainingDays", remainingDays);
        return ResultUtils.success(info);
    }
}