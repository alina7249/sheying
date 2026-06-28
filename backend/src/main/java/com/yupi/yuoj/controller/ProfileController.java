package com.yupi.yuoj.controller;

import com.yupi.yuoj.common.BaseResponse;
import com.yupi.yuoj.common.ErrorCode;
import com.yupi.yuoj.common.ResultUtils;
import com.yupi.yuoj.exception.BusinessException;
import com.yupi.yuoj.model.entity.User;
import com.yupi.yuoj.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.*;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/profile")
@Slf4j
public class ProfileController {

    @Resource
    private UserService userService;

    @PutMapping("/update")
    public BaseResponse<Boolean> updateProfile(@RequestBody User updateUser, HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        if (loginUser == null) throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        if (StringUtils.isNotBlank(updateUser.getUserName()) && updateUser.getUserName().length() > 30)
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "昵称过长");
        if (StringUtils.isNotBlank(updateUser.getUserProfile()) && updateUser.getUserProfile().length() > 200)
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "简介过长");
        loginUser.setUserName(StringUtils.isNotBlank(updateUser.getUserName()) ? updateUser.getUserName() : loginUser.getUserName());
        loginUser.setUserAvatar(StringUtils.isNotBlank(updateUser.getUserAvatar()) ? updateUser.getUserAvatar() : loginUser.getUserAvatar());
        loginUser.setUserProfile(updateUser.getUserProfile());
        boolean result = userService.updateById(loginUser);
        return ResultUtils.success(result);
    }
}