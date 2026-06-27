package com.yupi.yuoj.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.yupi.yuoj.model.dto.follow.FollowPageQueryRequest;
import com.yupi.yuoj.model.entity.Follow;
import com.yupi.yuoj.model.vo.FollowVO;
import javax.servlet.http.HttpServletRequest;

public interface FollowService extends IService<Follow> {

    void validFollow(Follow follow, boolean add);

    QueryWrapper<Follow> getQueryWrapper(FollowPageQueryRequest followQueryRequest);

    FollowVO getFollowVO(Follow follow, HttpServletRequest request);

    Page<FollowVO> getFollowVOPage(Page<Follow> followPage, HttpServletRequest request);

    boolean doFollow(Long followeeId, Long followerId);
}
