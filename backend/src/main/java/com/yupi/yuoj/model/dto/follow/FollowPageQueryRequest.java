package com.yupi.yuoj.model.dto.follow;

import com.yupi.yuoj.common.PageRequest;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class FollowPageQueryRequest extends PageRequest implements Serializable {

    private Long followerId;

    private Long followeeId;

    private static final long serialVersionUID = 1L;
}
