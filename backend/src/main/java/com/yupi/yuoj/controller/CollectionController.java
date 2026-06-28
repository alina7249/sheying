package com.yupi.yuoj.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.yupi.yuoj.common.BaseResponse;
import com.yupi.yuoj.common.ErrorCode;
import com.yupi.yuoj.common.ResultUtils;
import com.yupi.yuoj.exception.BusinessException;
import com.yupi.yuoj.model.dto.collection.CollectionAddRequest;
import com.yupi.yuoj.model.dto.collection.CollectionPostRequest;
import com.yupi.yuoj.model.entity.Collection;
import com.yupi.yuoj.model.entity.CollectionItem;
import com.yupi.yuoj.model.entity.Post;
import com.yupi.yuoj.model.entity.User;
import com.yupi.yuoj.service.CollectionItemService;
import com.yupi.yuoj.service.CollectionService;
import com.yupi.yuoj.service.PostService;
import com.yupi.yuoj.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/collection")
@Slf4j
public class CollectionController {

    @Resource
    private CollectionService collectionService;

    @Resource
    private CollectionItemService collectionItemService;

    @Resource
    private UserService userService;

    @Resource
    private PostService postService;

    @PostMapping("/add")
    public BaseResponse<Long> addCollection(@RequestBody CollectionAddRequest req, HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        if (loginUser == null) throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        Collection collection = new Collection();
        collection.setUserId(loginUser.getId());
        collection.setTitle(req.getTitle());
        collection.setDescription(req.getDescription());
        collection.setPostCount(0);
        collection.setIsPublic(1);
        collectionService.save(collection);
        return ResultUtils.success(collection.getId());
    }

    @GetMapping("/list")
    public BaseResponse<List<Map<String, Object>>> getCollections(HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        if (loginUser == null) throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        QueryWrapper<Collection> qw = new QueryWrapper<>();
        qw.eq("userId", loginUser.getId()).orderByDesc("createTime");
        List<Collection> list = collectionService.list(qw);
        List<Map<String, Object>> result = list.stream().map(c -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", c.getId());
            m.put("title", c.getTitle());
            m.put("description", c.getDescription());
            m.put("coverImage", c.getCoverImage());
            m.put("postCount", c.getPostCount());
            m.put("isPublic", c.getIsPublic());
            m.put("createTime", c.getCreateTime());
            return m;
        }).collect(Collectors.toList());
        return ResultUtils.success(result);
    }

    @GetMapping("/get/vo")
    public BaseResponse<Map<String, Object>> getCollectionDetail(@RequestParam Long id, HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        if (loginUser == null) throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        Collection collection = collectionService.getById(id);
        if (collection == null) throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        if (!collection.getUserId().equals(loginUser.getId())) throw new BusinessException(ErrorCode.NO_AUTH_ERROR);

        QueryWrapper<CollectionItem> qw = new QueryWrapper<>();
        qw.eq("collectionId", id).orderByDesc("createTime");
        List<CollectionItem> items = collectionItemService.list(qw);
        List<Post> posts = new ArrayList<>();
        if (!items.isEmpty()) {
            List<Long> postIds = items.stream().map(CollectionItem::getPostId).collect(Collectors.toList());
            posts = postService.listByIds(postIds);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("id", collection.getId());
        result.put("title", collection.getTitle());
        result.put("description", collection.getDescription());
        result.put("postCount", collection.getPostCount());
        result.put("posts", posts);
        return ResultUtils.success(result);
    }

    @PostMapping("/add-post")
    @Transactional
    public BaseResponse<Boolean> addPostToCollection(@RequestBody CollectionPostRequest req, HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        if (loginUser == null) throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        Collection collection = collectionService.getById(req.getCollectionId());
        if (collection == null || !collection.getUserId().equals(loginUser.getId()))
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR);

        QueryWrapper<CollectionItem> qw = new QueryWrapper<>();
        qw.eq("collectionId", req.getCollectionId()).eq("postId", req.getPostId());
        if (collectionItemService.count(qw) > 0) return ResultUtils.success(true);

        CollectionItem item = new CollectionItem();
        item.setCollectionId(req.getCollectionId());
        item.setPostId(req.getPostId());
        collectionItemService.save(item);
        collection.setPostCount((collection.getPostCount() != null ? collection.getPostCount() : 0) + 1);
        collectionService.updateById(collection);
        return ResultUtils.success(true);
    }

    @PostMapping("/delete-post")
    @Transactional
    public BaseResponse<Boolean> removePostFromCollection(@RequestBody CollectionPostRequest req, HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        if (loginUser == null) throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        Collection collection = collectionService.getById(req.getCollectionId());
        if (collection == null || !collection.getUserId().equals(loginUser.getId()))
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR);

        QueryWrapper<CollectionItem> qw = new QueryWrapper<>();
        qw.eq("collectionId", req.getCollectionId()).eq("postId", req.getPostId());
        collectionItemService.remove(qw);
        collection.setPostCount(Math.max(0, (collection.getPostCount() != null ? collection.getPostCount() : 1) - 1));
        collectionService.updateById(collection);
        return ResultUtils.success(true);
    }

    @PostMapping("/delete")
    public BaseResponse<Boolean> deleteCollection(@RequestBody Map<String, Long> body, HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        if (loginUser == null) throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        Long collectionId = body.get("id");
        Collection collection = collectionService.getById(collectionId);
        if (collection == null || !collection.getUserId().equals(loginUser.getId()))
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR);
        collectionService.removeById(collectionId);
        QueryWrapper<CollectionItem> qw = new QueryWrapper<>();
        qw.eq("collectionId", collectionId);
        collectionItemService.remove(qw);
        return ResultUtils.success(true);
    }
}