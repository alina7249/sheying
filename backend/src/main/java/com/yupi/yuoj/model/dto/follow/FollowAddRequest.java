package com.yupi.yuoj.model.dto.follow;

import java.io.Serializable;
import lombok.Data;

@Data
public class FollowAddRequest implements Serializable {

    private Long followeeId;

    private static final long serialVersionUID = 1L;
}
