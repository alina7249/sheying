package com.yupi.yuoj.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yupi.yuoj.common.BaseResponse;
import com.yupi.yuoj.common.ErrorCode;
import com.yupi.yuoj.common.ResultUtils;
import com.yupi.yuoj.exception.BusinessException;
import com.yupi.yuoj.model.dto.order.CreateOrderRequest;
import com.yupi.yuoj.model.entity.MembershipPlan;
import com.yupi.yuoj.model.entity.OrderInfo;
import com.yupi.yuoj.model.entity.User;
import com.yupi.yuoj.service.MembershipPlanService;
import com.yupi.yuoj.service.OrderInfoService;
import com.yupi.yuoj.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/order")
@Slf4j
public class OrderController {

    @Resource
    private OrderInfoService orderInfoService;

    @Resource
    private MembershipPlanService membershipPlanService;

    @Resource
    private UserService userService;

    @PostMapping("/create")
    public BaseResponse<Map<String, Object>> createOrder(@RequestBody CreateOrderRequest req, HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        if (loginUser == null) throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        MembershipPlan plan = membershipPlanService.getById(req.getPlanId());
        if (plan == null || plan.getIsActive() == 0) throw new BusinessException(ErrorCode.PARAMS_ERROR, "套餐不存在");

        String orderNo = "M" + new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()) + String.format("%04d", new Random().nextInt(10000));
        OrderInfo order = new OrderInfo();
        order.setOrderNo(orderNo);
        order.setUserId(loginUser.getId());
        order.setPlanId(plan.getId());
        order.setPlanName(plan.getName());
        order.setDuration(plan.getDuration());
        order.setAmount(plan.getPrice());
        order.setPayType("mock");
        order.setStatus("unpaid");
        orderInfoService.save(order);

        Map<String, Object> result = new HashMap<>();
        result.put("orderId", order.getId());
        result.put("orderNo", orderNo);
        result.put("amount", plan.getPrice());
        return ResultUtils.success(result);
    }

    @PostMapping("/pay/mock")
    @Transactional
    public BaseResponse<Map<String, Object>> mockPay(@RequestBody Map<String, Long> body, HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        if (loginUser == null) throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        Long orderId = body.get("orderId");
        OrderInfo order = orderInfoService.getById(orderId);
        if (order == null) throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        if (!order.getUserId().equals(loginUser.getId())) throw new BusinessException(ErrorCode.NO_AUTH_ERROR);
        if (!"unpaid".equals(order.getStatus())) throw new BusinessException(ErrorCode.PARAMS_ERROR, "订单已处理");

        MembershipPlan plan = membershipPlanService.getById(order.getPlanId());
        if (plan == null) throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);

        // 标记支付成功
        order.setStatus("paid");
        order.setPayTime(new Date());
        order.setTransactionId("MOCK_" + System.currentTimeMillis());
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DAY_OF_MONTH, plan.getDuration());
        order.setExpireTime(cal.getTime());
        orderInfoService.updateById(order);

        // 更新会员
        int level = plan.getDuration() == 30 ? 1 : plan.getDuration() == 90 ? 2 : 3;
        loginUser.setMemberLevel(level);
        switch (level) {
            case 1: loginUser.setMemberBadge("bronze"); loginUser.setDailyUploadLimit(30); break;
            case 2: loginUser.setMemberBadge("silver"); loginUser.setDailyUploadLimit(50); break;
            case 3: loginUser.setMemberBadge("gold"); loginUser.setDailyUploadLimit(100); break;
        }
        loginUser.setMemberExpireTime(cal.getTime());
        userService.updateById(loginUser);

        Map<String, Object> result = new HashMap<>();
        result.put("status", "paid");
        result.put("memberLevel", level);
        result.put("memberBadge", loginUser.getMemberBadge());
        result.put("expireTime", cal.getTime());
        return ResultUtils.success(result);
    }

    @GetMapping("/my/list")
    public BaseResponse<Page<OrderInfo>> getMyOrders(@RequestParam(defaultValue = "1") int current,
                                                      @RequestParam(defaultValue = "10") int pageSize,
                                                      HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        if (loginUser == null) throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        QueryWrapper<OrderInfo> qw = new QueryWrapper<>();
        qw.eq("userId", loginUser.getId()).orderByDesc("createTime");
        Page<OrderInfo> page = orderInfoService.page(new Page<>(current, pageSize), qw);
        return ResultUtils.success(page);
    }
}