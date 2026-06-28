package com.yupi.yuoj.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;

@TableName(value = "collection_item")
@Data
public class CollectionItem implements Serializable {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long collectionId;

    private Long postId;

    private Date createTime;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}