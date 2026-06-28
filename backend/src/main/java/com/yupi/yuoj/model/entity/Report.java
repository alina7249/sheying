package com.yupi.yuoj.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.util.Date;

@TableName(value = "report")
@Data
public class Report implements Serializable {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private Long targetId;
    private String targetType;
    private String reason;
    private String description;
    private String status;
    private Long handledBy;
    private String handleNote;
    private Date createTime;
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}