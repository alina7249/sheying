package com.yupi.yuoj.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.io.Serializable;
import java.util.Date;

@TableName(value = "event_participant")
@Data
public class EventParticipant implements Serializable {
    @TableId(type = IdType.ASSIGN_ID)
    private Long id;
    private Long eventId;
    private Long userId;
    private String status;
    private Date createTime;
    private Date updateTime;
    @TableLogic
    private Integer isDelete;
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}