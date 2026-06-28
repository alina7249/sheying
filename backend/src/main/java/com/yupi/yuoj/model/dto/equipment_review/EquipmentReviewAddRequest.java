package com.yupi.yuoj.model.dto.equipment_review;

import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;
import java.io.Serializable;

@Data
public class EquipmentReviewAddRequest implements Serializable {
    private Long equipmentId;
    private String title;
    private String content;
    private Integer rating;
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}