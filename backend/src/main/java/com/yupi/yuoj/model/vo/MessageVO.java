package com.yupi.yuoj.model.vo;

import com.baomidou.mybatisplus.annotation.TableField;
import com.yupi.yuoj.model.entity.Message;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.beans.BeanUtils;
import java.io.Serializable;
import java.util.Date;

@EqualsAndHashCode(callSuper = true)
@Data
public class MessageVO extends Message implements Serializable {
    private UserVO fromUser;
    private UserVO toUser;
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;

    public static MessageVO objToVo(Message message) {
        if (message == null) return null;
        MessageVO vo = new MessageVO();
        BeanUtils.copyProperties(message, vo);
        return vo;
    }
}