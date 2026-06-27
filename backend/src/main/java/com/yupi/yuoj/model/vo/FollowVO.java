package com.yupi.yuoj.model.vo;

import com.yupi.yuoj.model.entity.Follow;
import java.io.Serializable;
import java.util.Date;
import lombok.Data;
import org.springframework.beans.BeanUtils;

@Data
public class FollowVO implements Serializable {

    private Long id;

    private Long followerId;

    private Long followeeId;

    private Date createTime;

    private Date updateTime;

    private UserVO follower;

    private UserVO followee;

    public static Follow voToObj(FollowVO followVO) {
        if (followVO == null) {
            return null;
        }
        Follow follow = new Follow();
        BeanUtils.copyProperties(followVO, follow);
        return follow;
    }

    public static FollowVO objToVo(Follow follow) {
        if (follow == null) {
            return null;
        }
        FollowVO followVO = new FollowVO();
        BeanUtils.copyProperties(follow, followVO);
        return followVO;
    }
}
