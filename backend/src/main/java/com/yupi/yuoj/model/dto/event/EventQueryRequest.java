package com.yupi.yuoj.model.dto.event;

import com.baomidou.mybatisplus.annotation.TableField;
import com.yupi.yuoj.common.PageRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.io.Serializable;

@EqualsAndHashCode(callSuper = true)
@Data
public class EventQueryRequest extends PageRequest implements Serializable {
    private String title;
    private String status;
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}