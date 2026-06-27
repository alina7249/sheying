package com.yupi.yuoj.controller;

import cn.hutool.core.io.FileUtil;
import com.yupi.yuoj.common.BaseResponse;
import com.yupi.yuoj.common.ErrorCode;
import com.yupi.yuoj.common.ResultUtils;
import com.yupi.yuoj.constant.FileConstant;
import com.yupi.yuoj.exception.BusinessException;
import com.yupi.yuoj.model.dto.file.UploadFileRequest;
import com.yupi.yuoj.model.entity.User;
import com.yupi.yuoj.model.enums.FileUploadBizEnum;
import com.yupi.yuoj.service.UserService;
import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * 文件接口
 *
 * @author <a href="https://github.com/liupi">程序员鱼皮</a>
 * @from <a href="https://yupi.icu">编程导航知识星球</a>
 */
@RestController
@RequestMapping("/file")
@Slf4j
public class FileController {

    @Resource
    private UserService userService;

    /**
     * 文件上传（本地存储）
     *
     * @param multipartFile 文件
     * @param uploadFileRequest 上传请求
     * @param request HTTP请求
     * @return 文件访问URL
     */
    @PostMapping("/upload")
    public BaseResponse<String> uploadFile(@RequestPart("file") MultipartFile multipartFile,
            UploadFileRequest uploadFileRequest, HttpServletRequest request) {
        String biz = uploadFileRequest.getBiz();
        FileUploadBizEnum fileUploadBizEnum = FileUploadBizEnum.getEnumByValue(biz);
        if (fileUploadBizEnum == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "业务类型错误");
        }
        validFile(multipartFile, fileUploadBizEnum);
        User loginUser = userService.getLoginUser(request);

        // 文件目录：根据业务、用户来划分
        String uuid = RandomStringUtils.randomAlphanumeric(16);
        String originalFilename = multipartFile.getOriginalFilename();
        String fileSuffix = FileUtil.getSuffix(originalFilename);
        String filename = uuid + "." + fileSuffix;

        // 创建存储目录
        String dirPath = String.format("%s/%s/%s",
                FileConstant.LOCAL_STORAGE_PATH,
                fileUploadBizEnum.getValue(),
                loginUser.getId());
        File dir = new File(dirPath);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        // 保存文件
        String filepath = dirPath + "/" + filename;
        try {
            multipartFile.transferTo(new File(filepath));
            // 返回可访问地址
            String accessUrl = FileConstant.SERVER_HOST + "/api/file/download/" +
                    fileUploadBizEnum.getValue() + "/" + loginUser.getId() + "/" + filename;
            return ResultUtils.success(accessUrl);
        } catch (IOException e) {
            log.error("file upload error, filepath = " + filepath, e);
            throw new BusinessException(ErrorCode.SYSTEM_ERROR, "上传失败");
        }
    }

    /**
     * 文件下载/访问
     *
     * @param biz 业务类型
     * @param userId 用户ID
     * @param filename 文件名
     * @return 文件内容
     */
    @GetMapping("/download/{biz}/{userId}/{filename}")
    public byte[] downloadFile(@PathVariable String biz, @PathVariable String userId,
            @PathVariable String filename) {
        String filepath = String.format("%s/%s/%s/%s",
                FileConstant.LOCAL_STORAGE_PATH, biz, userId, filename);
        File file = new File(filepath);
        if (!file.exists()) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "文件不存在");
        }
        try {
            return FileUtil.readBytes(file);
        } catch (Exception e) {
            log.error("file download error, filepath = {}", filepath, e);
            throw new BusinessException(ErrorCode.SYSTEM_ERROR, "文件读取失败");
        }
    }

    /**
     * 校验文件
     *
     * @param multipartFile 文件
     * @param fileUploadBizEnum 业务类型
     */
    private void validFile(MultipartFile multipartFile, FileUploadBizEnum fileUploadBizEnum) {
        long fileSize = multipartFile.getSize();
        String fileSuffix = FileUtil.getSuffix(multipartFile.getOriginalFilename());
        final long ONE_M = 1024 * 1024L;
        final long TEN_M = 10 * 1024 * 1024L;
        if (FileUploadBizEnum.USER_AVATAR.equals(fileUploadBizEnum)) {
            if (fileSize > ONE_M) {
                throw new BusinessException(ErrorCode.PARAMS_ERROR, "文件大小不能超过 1M");
            }
            if (!Arrays.asList("jpeg", "jpg", "svg", "png", "webp").contains(fileSuffix)) {
                throw new BusinessException(ErrorCode.PARAMS_ERROR, "文件类型错误");
            }
        }
        if (FileUploadBizEnum.POST_IMAGE.equals(fileUploadBizEnum)) {
            if (fileSize > TEN_M) {
                throw new BusinessException(ErrorCode.PARAMS_ERROR, "文件大小不能超过 10M");
            }
            if (!Arrays.asList("jpeg", "jpg", "png", "webp", "gif").contains(fileSuffix)) {
                throw new BusinessException(ErrorCode.PARAMS_ERROR, "文件类型错误");
            }
        }
    }
}
