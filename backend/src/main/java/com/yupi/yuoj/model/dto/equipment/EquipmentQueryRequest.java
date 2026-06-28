package com.yupi.yuoj.model.dto.equipment;

import com.baomidou.mybatisplus.annotation.TableField;
import com.yupi.yuoj.common.PageRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.io.Serializable;

@EqualsAndHashCode(callSuper = true)
@Data
public class EquipmentQueryRequest extends PageRequest implements Serializable {
    private String name;
    private String brand;
    private String category;
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}