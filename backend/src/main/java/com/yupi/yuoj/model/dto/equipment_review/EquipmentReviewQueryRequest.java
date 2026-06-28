package com.yupi.yuoj.model.dto.equipment_review;

import com.baomidou.mybatisplus.annotation.TableField;
import com.yupi.yuoj.common.PageRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.io.Serializable;

@EqualsAndHashCode(callSuper = true)
@Data
public class EquipmentReviewQueryRequest extends PageRequest implements Serializable {
    private Long equipmentId;
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}