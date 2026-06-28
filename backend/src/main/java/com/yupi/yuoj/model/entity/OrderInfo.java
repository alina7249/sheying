package com.yupi.yuoj.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

@TableName(value = "order_info")
@Data
public class OrderInfo implements Serializable {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    private String orderNo;
    private Long userId;
    private Long planId;
    private String planName;
    private Integer duration;
    private BigDecimal amount;
    private String payType;
    private Date payTime;
    private String status;
    private String transactionId;
    private Date expireTime;
    private Date createTime;
    private Date updateTime;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}