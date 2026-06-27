package com.yupi.yuoj.model.vo;

import com.yupi.yuoj.model.entity.Comment;
import java.io.Serializable;
import java.util.Date;
import lombok.Data;
import org.springframework.beans.BeanUtils;

@Data
public class CommentVO implements Serializable {

    private Long id;

    private Long postId;

    private Long userId;

    private String content;

    private Date createTime;

    private Date updateTime;

    private UserVO user;

    public static Comment voToObj(CommentVO commentVO) {
        if (commentVO == null) {
            return null;
        }
        Comment comment = new Comment();
        BeanUtils.copyProperties(commentVO, comment);
        return comment;
    }

    public static CommentVO objToVo(Comment comment) {
        if (comment == null) {
            return null;
        }
        CommentVO commentVO = new CommentVO();
        BeanUtils.copyProperties(comment, commentVO);
        return commentVO;
    }
}
