package com.yupi.yuoj.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

@TableName(value = "membership_plan")
@Data
public class MembershipPlan implements Serializable {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private Integer duration;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private String benefits;
    private String description;
    private Integer sort;
    private Integer isActive;
    private Date createTime;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}