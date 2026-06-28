package com.yupi.yuoj.model.vo;

import com.baomidou.mybatisplus.annotation.TableField;
import com.yupi.yuoj.model.entity.EquipmentReview;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.beans.BeanUtils;
import java.io.Serializable;

@EqualsAndHashCode(callSuper = true)
@Data
public class EquipmentReviewVO extends EquipmentReview implements Serializable {
    private UserVO user;
    private EquipmentVO equipment;
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;

    public static EquipmentReviewVO objToVo(EquipmentReview review) {
        if (review == null) return null;
        EquipmentReviewVO vo = new EquipmentReviewVO();
        BeanUtils.copyProperties(review, vo);
        return vo;
    }
}