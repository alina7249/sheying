package com.yupi.yuoj.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.util.Date;

@TableName(value = "equipment_review")
@Data
public class EquipmentReview implements Serializable {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    private Long equipmentId;
    private Long userId;
    private String title;
    private String content;
    private Integer rating;
    private Integer thumbNum;
    private Date createTime;
    private Date updateTime;
    @TableLogic
    private Integer isDelete;
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}