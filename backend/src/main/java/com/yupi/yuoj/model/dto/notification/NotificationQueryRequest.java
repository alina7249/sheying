package com.yupi.yuoj.model.dto.notification;

import com.baomidou.mybatisplus.annotation.TableField;
import com.yupi.yuoj.common.PageRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.io.Serializable;

@EqualsAndHashCode(callSuper = true)
@Data
public class NotificationQueryRequest extends PageRequest implements Serializable {
    private Long userId;
    private String type;
    private Integer isRead;
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}