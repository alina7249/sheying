package com.yupi.yuoj.model.dto.equipment;

import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;

@Data
public class EquipmentUpdateRequest implements Serializable {
    private Long id;
    private String name;
    private String brand;
    private String category;
    private String coverImage;
    private String description;
    private BigDecimal price;
    private String specs;
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}