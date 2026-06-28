package com.yupi.yuoj.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.yupi.yuoj.model.entity.EquipmentReview;

public interface EquipmentReviewService extends IService<EquipmentReview> {
    void validReview(EquipmentReview review, boolean add);
}