package com.yupi.yuoj.model.dto.message;

import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;
import java.io.Serializable;

@Data
public class MessageAddRequest implements Serializable {
    private Long toUserId;
    private String content;
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}