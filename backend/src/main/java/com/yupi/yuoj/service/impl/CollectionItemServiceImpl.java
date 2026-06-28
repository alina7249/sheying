package com.yupi.yuoj.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yupi.yuoj.mapper.CollectionItemMapper;
import com.yupi.yuoj.model.entity.CollectionItem;
import com.yupi.yuoj.service.CollectionItemService;
import org.springframework.stereotype.Service;

@Service
public class CollectionItemServiceImpl extends ServiceImpl<CollectionItemMapper, CollectionItem> implements CollectionItemService {
}