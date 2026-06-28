package com.yupi.yuoj.model.dto.event;

import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;
import java.io.Serializable;
import java.util.Date;

@Data
public class EventAddRequest implements Serializable {
    private String title;
    private String content;
    private String coverImage;
    private String location;
    private Date startTime;
    private Date endTime;
    private Integer maxParticipants;
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}