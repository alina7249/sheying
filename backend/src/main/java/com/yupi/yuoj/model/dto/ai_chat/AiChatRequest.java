package com.yupi.yuoj.model.dto.ai_chat;

import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;
import java.io.Serializable;

@Data
public class AiChatRequest implements Serializable {
    private String message;
    private String sessionId;
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}