package com.yupi.yuoj.model.vo;

import com.baomidou.mybatisplus.annotation.TableField;
import com.yupi.yuoj.model.entity.Notification;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.beans.BeanUtils;
import java.io.Serializable;

@EqualsAndHashCode(callSuper = true)
@Data
public class NotificationVO extends Notification implements Serializable {
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;

    public static NotificationVO objToVo(Notification notification) {
        if (notification == null) return null;
        NotificationVO vo = new NotificationVO();
        BeanUtils.copyProperties(notification, vo);
        return vo;
    }
}