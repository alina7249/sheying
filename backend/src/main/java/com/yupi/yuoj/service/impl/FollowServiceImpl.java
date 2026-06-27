package com.yupi.yuoj.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yupi.yuoj.common.ErrorCode;
import com.yupi.yuoj.exception.BusinessException;
import com.yupi.yuoj.exception.ThrowUtils;
import com.yupi.yuoj.mapper.FollowMapper;
import com.yupi.yuoj.model.dto.follow.FollowPageQueryRequest;
import com.yupi.yuoj.model.entity.Follow;
import com.yupi.yuoj.model.entity.User;
import com.yupi.yuoj.model.vo.FollowVO;
import com.yupi.yuoj.model.vo.UserVO;
import com.yupi.yuoj.service.FollowService;
import com.yupi.yuoj.service.UserService;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
public class FollowServiceImpl extends ServiceImpl<FollowMapper, Follow> implements FollowService {

    @Resource
    private UserService userService;

    @Override
    public void validFollow(Follow follow, boolean add) {
        ThrowUtils.throwIf(follow == null, ErrorCode.PARAMS_ERROR);
        Long followerId = follow.getFollowerId();
        Long followeeId = follow.getFolloweeId();
        if (add) {
            ThrowUtils.throwIf(followerId == null || followerId <= 0, ErrorCode.PARAMS_ERROR, "关注者 id 不能为空");
            ThrowUtils.throwIf(followeeId == null || followeeId <= 0, ErrorCode.PARAMS_ERROR, "被关注者 id 不能为空");
            if (followerId.equals(followeeId)) {
                throw new BusinessException(ErrorCode.PARAMS_ERROR, "不能关注自己");
            }
        }
    }

    @Override
    public QueryWrapper<Follow> getQueryWrapper(FollowPageQueryRequest followQueryRequest) {
        QueryWrapper<Follow> queryWrapper = new QueryWrapper<>();
        if (followQueryRequest == null) {
            return queryWrapper;
        }
        Long followerId = followQueryRequest.getFollowerId();
        Long followeeId = followQueryRequest.getFolloweeId();
        queryWrapper.eq(ObjectUtils.isNotEmpty(followerId), "followerId", followerId);
        queryWrapper.eq(ObjectUtils.isNotEmpty(followeeId), "followeeId", followeeId);
        queryWrapper.eq("isDelete", false);
        queryWrapper.orderByDesc("createTime");
        return queryWrapper;
    }

    @Override
    public FollowVO getFollowVO(Follow follow, HttpServletRequest request) {
        FollowVO followVO = FollowVO.objToVo(follow);
        Long followerId = follow.getFollowerId();
        Long followeeId = follow.getFolloweeId();
        if (followerId != null && followerId > 0) {
            User follower = userService.getById(followerId);
            followVO.setFollower(userService.getUserVO(follower));
        }
        if (followeeId != null && followeeId > 0) {
            User followee = userService.getById(followeeId);
            followVO.setFollowee(userService.getUserVO(followee));
        }
        return followVO;
    }

    @Override
    public Page<FollowVO> getFollowVOPage(Page<Follow> followPage, HttpServletRequest request) {
        List<Follow> followList = followPage.getRecords();
        Page<FollowVO> followVOPage = new Page<>(followPage.getCurrent(), followPage.getSize(), followPage.getTotal());
        if (followList == null || followList.isEmpty()) {
            return followVOPage;
        }
        Set<Long> userIdSet = new HashSet<>();
        followList.forEach(follow -> {
            if (follow.getFollowerId() != null) {
                userIdSet.add(follow.getFollowerId());
            }
            if (follow.getFolloweeId() != null) {
                userIdSet.add(follow.getFolloweeId());
            }
        });
        Map<Long, List<User>> userIdUserListMap = userService.listByIds(userIdSet).stream()
                .collect(Collectors.groupingBy(User::getId));
        List<FollowVO> followVOList = followList.stream().map(follow -> {
            FollowVO followVO = FollowVO.objToVo(follow);
            Long followerId = follow.getFollowerId();
            Long followeeId = follow.getFolloweeId();
            if (followerId != null && userIdUserListMap.containsKey(followerId)) {
                followVO.setFollower(userService.getUserVO(userIdUserListMap.get(followerId).get(0)));
            }
            if (followeeId != null && userIdUserListMap.containsKey(followeeId)) {
                followVO.setFollowee(userService.getUserVO(userIdUserListMap.get(followeeId).get(0)));
            }
            return followVO;
        }).collect(Collectors.toList());
        followVOPage.setRecords(followVOList);
        return followVOPage;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean doFollow(Long followeeId, Long followerId) {
        if (followerId == null || followeeId == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        if (followerId.equals(followeeId)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "不能关注自己");
        }
        User followee = userService.getById(followeeId);
        if (followee == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "用户不存在");
        }
        QueryWrapper<Follow> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("followerId", followerId);
        queryWrapper.eq("followeeId", followeeId);
        Follow follow = this.getOne(queryWrapper);
        if (follow != null) {
            return this.removeById(follow.getId());
        } else {
            Follow newFollow = new Follow();
            newFollow.setFollowerId(followerId);
            newFollow.setFolloweeId(followeeId);
            return this.save(newFollow);
        }
    }
}
