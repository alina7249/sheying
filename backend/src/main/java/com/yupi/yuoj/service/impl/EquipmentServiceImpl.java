package com.yupi.yuoj.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.yupi.yuoj.common.ErrorCode;
import com.yupi.yuoj.exception.BusinessException;
import com.yupi.yuoj.mapper.EquipmentMapper;
import com.yupi.yuoj.model.entity.Equipment;
import com.yupi.yuoj.service.EquipmentService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

@Service
public class EquipmentServiceImpl extends ServiceImpl<EquipmentMapper, Equipment> implements EquipmentService {

    @Override
    public void validEquipment(Equipment equipment, boolean add) {
        if (equipment == null) throw new BusinessException(ErrorCode.PARAMS_ERROR);
        String name = equipment.getName();
        String brand = equipment.getBrand();
        String category = equipment.getCategory();
        if (add) {
            if (StringUtils.isAnyBlank(name, brand, category))
                throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
    }
}