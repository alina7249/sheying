package com.yupi.yuoj.model.dto.comment;

import java.io.Serializable;
import lombok.Data;

@Data
public class CommentAddRequest implements Serializable {

    private Long postId;

    private String content;

    private static final long serialVersionUID = 1L;
}
