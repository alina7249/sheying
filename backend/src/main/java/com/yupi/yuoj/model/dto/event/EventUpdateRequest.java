package com.yupi.yuoj.model.dto.event;

import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;
import java.io.Serializable;
import java.util.Date;

@Data
public class EventUpdateRequest implements Serializable {
    private Long id;
    private String title;
    private String content;
    private String coverImage;
    private String location;
    private Date startTime;
    private Date endTime;
    private Integer maxParticipants;
    private String status;
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}