package com.yupi.yuoj.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yupi.yuoj.common.ErrorCode;
import com.yupi.yuoj.exception.BusinessException;
import com.yupi.yuoj.mapper.EquipmentReviewMapper;
import com.yupi.yuoj.model.entity.EquipmentReview;
import com.yupi.yuoj.service.EquipmentReviewService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

@Service
public class EquipmentReviewServiceImpl extends ServiceImpl<EquipmentReviewMapper, EquipmentReview> implements EquipmentReviewService {

    @Override
    public void validReview(EquipmentReview review, boolean add) {
        if (review == null) throw new BusinessException(ErrorCode.PARAMS_ERROR);
        if (add) {
            if (review.getEquipmentId() == null || StringUtils.isBlank(review.getTitle()) || StringUtils.isBlank(review.getContent()))
                throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
    }
}