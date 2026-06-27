package com.yupi.yuoj.model.dto.follow;

import java.io.Serializable;
import lombok.Data;

@Data
public class FollowQueryRequest implements Serializable {

    private Long id;

    private Long followerId;

    private Long followeeId;

    private static final long serialVersionUID = 1L;
}
