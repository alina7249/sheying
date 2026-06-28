package com.yupi.yuoj.model.dto.notification;

import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;
import java.io.Serializable;

@Data
public class NotificationAddRequest implements Serializable {
    private Long userId;
    private String type;
    private String title;
    private String content;
    private Long relatedId;
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}