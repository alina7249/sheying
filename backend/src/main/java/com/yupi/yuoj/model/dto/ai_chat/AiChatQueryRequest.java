package com.yupi.yuoj.model.dto.ai_chat;

import com.baomidou.mybatisplus.annotation.TableField;
import com.yupi.yuoj.common.PageRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.io.Serializable;

@EqualsAndHashCode(callSuper = true)
@Data
public class AiChatQueryRequest extends PageRequest implements Serializable {
    private String sessionId;
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}