package com.yupi.yuoj.model.dto.comment;

import java.io.Serializable;
import lombok.Data;

@Data
public class CommentEditRequest implements Serializable {

    private Long id;

    private String content;

    private static final long serialVersionUID = 1L;
}
