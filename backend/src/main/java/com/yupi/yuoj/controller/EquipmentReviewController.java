package com.yupi.yuoj.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yupi.yuoj.common.BaseResponse;
import com.yupi.yuoj.common.DeleteRequest;
import com.yupi.yuoj.common.ErrorCode;
import com.yupi.yuoj.common.ResultUtils;
import com.yupi.yuoj.exception.BusinessException;
import com.yupi.yuoj.exception.ThrowUtils;
import com.yupi.yuoj.model.dto.equipment_review.EquipmentReviewAddRequest;
import com.yupi.yuoj.model.dto.equipment_review.EquipmentReviewQueryRequest;
import com.yupi.yuoj.model.dto.equipment_review.EquipmentReviewUpdateRequest;
import com.yupi.yuoj.model.entity.EquipmentReview;
import com.yupi.yuoj.model.entity.User;
import com.yupi.yuoj.model.vo.EquipmentReviewVO;
import com.yupi.yuoj.service.EquipmentReviewService;
import com.yupi.yuoj.service.EquipmentService;
import com.yupi.yuoj.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/equipment-review")
@Slf4j
public class EquipmentReviewController {

    @Resource
    private EquipmentReviewService reviewService;
    @Resource
    private EquipmentService equipmentService;
    @Resource
    private UserService userService;

    @PostMapping("/add")
    public BaseResponse<Long> addReview(@RequestBody EquipmentReviewAddRequest req, HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        if (loginUser == null) throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        EquipmentReview review = new EquipmentReview();
        BeanUtils.copyProperties(req, review);
        review.setUserId(loginUser.getId());
        reviewService.validReview(review, true);
        boolean result = reviewService.save(review);
        ThrowUtils.throwIf(!result, ErrorCode.OPERATION_ERROR);
        return ResultUtils.success(review.getId());
    }

    @DeleteMapping("/delete")
    public BaseResponse<Boolean> deleteReview(@RequestBody DeleteRequest req, HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        if (loginUser == null) throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        EquipmentReview review = reviewService.getById(req.getId());
        if (review == null) throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        if (!review.getUserId().equals(loginUser.getId()) && !userService.isAdmin(loginUser))
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR);
        boolean result = reviewService.removeById(req.getId());
        return ResultUtils.success(result);
    }

    @PutMapping("/update")
    public BaseResponse<Boolean> updateReview(@RequestBody EquipmentReviewUpdateRequest req, HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        if (loginUser == null) throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        EquipmentReview review = reviewService.getById(req.getId());
        if (review == null) throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        if (!review.getUserId().equals(loginUser.getId()) && !userService.isAdmin(loginUser))
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR);
        BeanUtils.copyProperties(req, review);
        reviewService.validReview(review, false);
        boolean result = reviewService.updateById(review);
        return ResultUtils.success(result);
    }

    @GetMapping("/list/{equipmentId}")
    public BaseResponse<Page<EquipmentReview>> listReviews(@PathVariable Long equipmentId, EquipmentReviewQueryRequest req) {
        QueryWrapper<EquipmentReview> qw = new QueryWrapper<>();
        qw.eq("equipmentId", equipmentId);
        qw.orderByDesc("createTime");
        Page<EquipmentReview> page = new Page<>(req.getCurrent(), req.getPageSize());
        Page<EquipmentReview> result = reviewService.page(page, qw);
        return ResultUtils.success(result);
    }
}