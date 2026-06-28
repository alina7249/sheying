package com.yupi.yuoj.model.vo;

import com.baomidou.mybatisplus.annotation.TableField;
import com.yupi.yuoj.model.entity.Equipment;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.beans.BeanUtils;
import java.io.Serializable;

@EqualsAndHashCode(callSuper = true)
@Data
public class EquipmentVO extends Equipment implements Serializable {
    private UserVO user;
    @TableField(exist = false)
    private static final long serialVersionUID = 1L;

    public static EquipmentVO objToVo(Equipment equipment) {
        if (equipment == null) return null;
        EquipmentVO vo = new EquipmentVO();
        BeanUtils.copyProperties(equipment, vo);
        return vo;
    }
}