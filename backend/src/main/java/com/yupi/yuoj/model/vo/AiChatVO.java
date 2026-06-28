package com.yupi.yuoj.model.vo;

import com.baomidou.mybatisplus.annotation.TableField;
import com.yupi.yuoj.model.entity.AiChat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.beans.BeanUtils;
import java.io.Serializable;

@EqualsAndHashCode(callSuper = true)
@Data
public class AiChatVO extends AiChat implements Serializable {
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;

    public static AiChatVO objToVo(AiChat aiChat) {
        if (aiChat == null) return null;
        AiChatVO vo = new AiChatVO();
        BeanUtils.copyProperties(aiChat, vo);
        return vo;
    }
}