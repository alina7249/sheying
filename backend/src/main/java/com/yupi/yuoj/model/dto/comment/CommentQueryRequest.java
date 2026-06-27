package com.yupi.yuoj.model.dto.comment;

import com.yupi.yuoj.common.PageRequest;
import java.io.Serializable;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class CommentQueryRequest extends PageRequest implements Serializable {

    private Long id;

    private Long postId;

    private Long userId;

    private String content;

    private static final long serialVersionUID = 1L;
}
