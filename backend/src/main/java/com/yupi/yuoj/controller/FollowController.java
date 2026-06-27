package com.yupi.yuoj.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yupi.yuoj.common.BaseResponse;
import com.yupi.yuoj.common.DeleteRequest;
import com.yupi.yuoj.common.ErrorCode;
import com.yupi.yuoj.common.ResultUtils;
import com.yupi.yuoj.exception.BusinessException;
import com.yupi.yuoj.exception.ThrowUtils;
import com.yupi.yuoj.model.dto.follow.FollowAddRequest;
import com.yupi.yuoj.model.dto.follow.FollowPageQueryRequest;
import com.yupi.yuoj.model.entity.Follow;
import com.yupi.yuoj.model.entity.User;
import com.yupi.yuoj.model.vo.FollowVO;
import com.yupi.yuoj.service.FollowService;
import com.yupi.yuoj.service.UserService;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/follow")
@Slf4j
public class FollowController {

    @Resource
    private FollowService followService;

    @Resource
    private UserService userService;

    @PostMapping("/do")
    public BaseResponse<Boolean> doFollow(@RequestBody FollowAddRequest followAddRequest, HttpServletRequest request) {
        if (followAddRequest == null || followAddRequest.getFolloweeId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User loginUser = userService.getLoginUser(request);
        boolean result = followService.doFollow(followAddRequest.getFolloweeId(), loginUser.getId());
        return ResultUtils.success(result);
    }

    @PostMapping("/delete")
    public BaseResponse<Boolean> deleteFollow(@RequestBody DeleteRequest deleteRequest, HttpServletRequest request) {
        if (deleteRequest == null || deleteRequest.getId() <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User user = userService.getLoginUser(request);
        long id = deleteRequest.getId();
        Follow oldFollow = followService.getById(id);
        ThrowUtils.throwIf(oldFollow == null, ErrorCode.NOT_FOUND_ERROR);
        if (!oldFollow.getFollowerId().equals(user.getId()) && !userService.isAdmin(request)) {
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR);
        }
        boolean b = followService.removeById(id);
        return ResultUtils.success(b);
    }

    @GetMapping("/get/vo")
    public BaseResponse<FollowVO> getFollowVOById(long id, HttpServletRequest request) {
        if (id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        Follow follow = followService.getById(id);
        if (follow == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        }
        return ResultUtils.success(followService.getFollowVO(follow, request));
    }

    @PostMapping("/list/page/vo")
    public BaseResponse<Page<FollowVO>> listFollowVOByPage(@RequestBody FollowPageQueryRequest followQueryRequest,
            HttpServletRequest request) {
        long current = followQueryRequest.getCurrent();
        long size = followQueryRequest.getPageSize();
        ThrowUtils.throwIf(size > 50, ErrorCode.PARAMS_ERROR);
        Page<Follow> followPage = followService.page(new Page<>(current, size),
                followService.getQueryWrapper(followQueryRequest));
        return ResultUtils.success(followService.getFollowVOPage(followPage, request));
    }

    @GetMapping("/my/followers")
    public BaseResponse<Page<FollowVO>> listMyFollowers(long current, long size, HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        ThrowUtils.throwIf(size > 50, ErrorCode.PARAMS_ERROR);
        FollowPageQueryRequest queryRequest = new FollowPageQueryRequest();
        queryRequest.setFolloweeId(loginUser.getId());
        queryRequest.setCurrent(current);
        queryRequest.setPageSize(size);
        Page<Follow> followPage = followService.page(new Page<>(current, size),
                followService.getQueryWrapper(queryRequest));
        return ResultUtils.success(followService.getFollowVOPage(followPage, request));
    }

    @GetMapping("/my/following")
    public BaseResponse<Page<FollowVO>> listMyFollowing(long current, long size, HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        ThrowUtils.throwIf(size > 50, ErrorCode.PARAMS_ERROR);
        FollowPageQueryRequest queryRequest = new FollowPageQueryRequest();
        queryRequest.setFollowerId(loginUser.getId());
        queryRequest.setCurrent(current);
        queryRequest.setPageSize(size);
        Page<Follow> followPage = followService.page(new Page<>(current, size),
                followService.getQueryWrapper(queryRequest));
        return ResultUtils.success(followService.getFollowVOPage(followPage, request));
    }

    @GetMapping("/check")
    public BaseResponse<Boolean> checkFollow(Long followeeId, HttpServletRequest request) {
        if (followeeId == null || followeeId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User loginUser = userService.getLoginUserPermitNull(request);
        if (loginUser == null) {
            return ResultUtils.success(false);
        }
        QueryWrapper<Follow> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("followerId", loginUser.getId());
        queryWrapper.eq("followeeId", followeeId);
        Follow follow = followService.getOne(queryWrapper);
        return ResultUtils.success(follow != null);
    }

}
