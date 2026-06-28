package com.yupi.yuoj.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.yupi.yuoj.common.BaseResponse;
import com.yupi.yuoj.common.DeleteRequest;
import com.yupi.yuoj.common.ErrorCode;
import com.yupi.yuoj.common.ResultUtils;
import com.yupi.yuoj.exception.BusinessException;
import com.yupi.yuoj.exception.ThrowUtils;
import com.yupi.yuoj.model.dto.equipment.EquipmentAddRequest;
import com.yupi.yuoj.model.dto.equipment.EquipmentQueryRequest;
import com.yupi.yuoj.model.dto.equipment.EquipmentUpdateRequest;
import com.yupi.yuoj.model.entity.Equipment;
import com.yupi.yuoj.model.entity.User;
import com.yupi.yuoj.model.vo.EquipmentVO;
import com.yupi.yuoj.service.EquipmentService;
import com.yupi.yuoj.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/equipment")
@Slf4j
public class EquipmentController {

    @Resource
    private EquipmentService equipmentService;
    @Resource
    private UserService userService;

    @PostMapping("/add")
    public BaseResponse<Long> addEquipment(@RequestBody EquipmentAddRequest req, HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        if (loginUser == null) throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        Equipment equipment = new Equipment();
        BeanUtils.copyProperties(req, equipment);
        equipment.setUserId(loginUser.getId());
        equipmentService.validEquipment(equipment, true);
        boolean result = equipmentService.save(equipment);
        ThrowUtils.throwIf(!result, ErrorCode.OPERATION_ERROR);
        return ResultUtils.success(equipment.getId());
    }

    @DeleteMapping("/delete")
    public BaseResponse<Boolean> deleteEquipment(@RequestBody DeleteRequest req, HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        if (loginUser == null) throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        Equipment equipment = equipmentService.getById(req.getId());
        if (equipment == null) throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        if (!equipment.getUserId().equals(loginUser.getId()) && !userService.isAdmin(loginUser))
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR);
        boolean result = equipmentService.removeById(req.getId());
        return ResultUtils.success(result);
    }

    @PutMapping("/update")
    public BaseResponse<Boolean> updateEquipment(@RequestBody EquipmentUpdateRequest req, HttpServletRequest request) {
        User loginUser = userService.getLoginUser(request);
        if (loginUser == null) throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        Equipment equipment = equipmentService.getById(req.getId());
        if (equipment == null) throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        if (!equipment.getUserId().equals(loginUser.getId()) && !userService.isAdmin(loginUser))
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR);
        BeanUtils.copyProperties(req, equipment);
        equipmentService.validEquipment(equipment, false);
        boolean result = equipmentService.updateById(equipment);
        return ResultUtils.success(result);
    }

    @GetMapping("/get/{id}")
    public BaseResponse<EquipmentVO> getEquipmentById(@PathVariable Long id) {
        Equipment equipment = equipmentService.getById(id);
        if (equipment == null) throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        EquipmentVO vo = EquipmentVO.objToVo(equipment);
        User user = userService.getById(equipment.getUserId());
        if (user != null) {
            com.yupi.yuoj.model.vo.UserVO userVO = new com.yupi.yuoj.model.vo.UserVO();
            BeanUtils.copyProperties(user, userVO);
            vo.setUser(userVO);
        }
        return ResultUtils.success(vo);
    }

    @GetMapping("/list")
    public BaseResponse<Page<Equipment>> listEquipment(EquipmentQueryRequest req) {
        QueryWrapper<Equipment> qw = new QueryWrapper<>();
        if (req.getName() != null) qw.like("name", req.getName());
        if (req.getBrand() != null) qw.eq("brand", req.getBrand());
        if (req.getCategory() != null) qw.eq("category", req.getCategory());
        qw.orderByDesc("createTime");
        Page<Equipment> page = new Page<>(req.getCurrent(), req.getPageSize());
        Page<Equipment> result = equipmentService.page(page, qw);
        return ResultUtils.success(result);
    }
}