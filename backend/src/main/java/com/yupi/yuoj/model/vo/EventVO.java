package com.yupi.yuoj.model.vo;

import com.baomidou.mybatisplus.annotation.TableField;
import com.yupi.yuoj.model.entity.Event;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.beans.BeanUtils;
import java.io.Serializable;

@EqualsAndHashCode(callSuper = true)
@Data
public class EventVO extends Event implements Serializable {
    private UserVO user;
    private Boolean isRegistered;
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;

    public static EventVO objToVo(Event event) {
        if (event == null) return null;
        EventVO vo = new EventVO();
        BeanUtils.copyProperties(event, vo);
        return vo;
    }
}