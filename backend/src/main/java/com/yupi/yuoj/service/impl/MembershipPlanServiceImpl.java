package com.yupi.yuoj.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yupi.yuoj.mapper.MembershipPlanMapper;
import com.yupi.yuoj.model.entity.MembershipPlan;
import com.yupi.yuoj.service.MembershipPlanService;
import org.springframework.stereotype.Service;

@Service
public class MembershipPlanServiceImpl extends ServiceImpl<MembershipPlanMapper, MembershipPlan> implements MembershipPlanService {
}