package com.yupi.yuoj.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yupi.yuoj.annotation.AuthCheck;
import com.yupi.yuoj.common.BaseResponse;
import com.yupi.yuoj.common.ErrorCode;
import com.yupi.yuoj.common.ResultUtils;
import com.yupi.yuoj.constant.UserConstant;
import com.yupi.yuoj.exception.BusinessException;
import com.yupi.yuoj.model.dto.report.ReportAddRequest;
import com.yupi.yuoj.model.dto.report.ReportHandleRequest;
import com.yupi.yuoj.model.entity.Report;
import com.yupi.yuoj.model.entity.User;
import com.yupi.yuoj.service.ReportService;
import com.yupi.yuoj.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.Date;

@RestController
@RequestMapping("/api/report")
@Slf4j
public class ReportController {

    @Resource
    private ReportService reportService;

    @Resource
    private UserService userService;

    @PostMapping("/add")
    public BaseResponse<Long> addReport(@RequestBody ReportAddRequest req, HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        if (loginUser == null) throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        Report report = new Report();
        report.setUserId(loginUser.getId());
        report.setTargetId(req.getTargetId());
        report.setTargetType(req.getTargetType());
        report.setReason(req.getReason());
        report.setDescription(req.getDescription());
        report.setStatus("pending");
        report.setCreateTime(new Date());
        reportService.save(report);
        return ResultUtils.success(report.getId());
    }

    @GetMapping("/list/page")
    @AuthCheck(mustRole = UserConstant.ADMIN_ROLE)
    public BaseResponse<Page<Report>> listReport(@RequestParam(defaultValue = "1") int current,
                                                  @RequestParam(defaultValue = "10") int pageSize,
                                                  @RequestParam(required = false) String status) {
        QueryWrapper<Report> qw = new QueryWrapper<>();
        if (status != null && !status.isEmpty()) qw.eq("status", status);
        qw.orderByDesc("createTime");
        Page<Report> page = reportService.page(new Page<>(current, pageSize), qw);
        return ResultUtils.success(page);
    }

    @PostMapping("/handle")
    @AuthCheck(mustRole = UserConstant.ADMIN_ROLE)
    public BaseResponse<Boolean> handleReport(@RequestBody ReportHandleRequest req, HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        Report report = reportService.getById(req.getReportId());
        if (report == null) throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        report.setStatus(req.getStatus());
        report.setHandledBy(loginUser.getId());
        report.setHandleNote(req.getHandleNote());
        reportService.updateById(report);
        return ResultUtils.success(true);
    }
}