package com.yupi.yuoj.job.cycle;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.yupi.yuoj.model.entity.User;
import com.yupi.yuoj.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import javax.annotation.Resource;
import java.util.Date;

@Component
@Slf4j
public class DailyResetTask {

    @Resource
    private UserService userService;

    @Scheduled(cron = "0 0 0 * * ?")
    public void resetDailyUpload() {
        log.info("Starting daily upload reset...");
        User updateUser = new User();
        updateUser.setDailyUploadUsed(0);
        QueryWrapper<User> qw = new QueryWrapper<>();
        qw.gt("dailyUploadUsed", 0);
        userService.update(updateUser, qw);
        log.info("Daily upload reset completed");
    }

    @Scheduled(cron = "0 0 1 * * ?")
    public void checkExpiredMembers() {
        log.info("Checking expired members...");
        User updateUser = new User();
        updateUser.setMemberLevel(0);
        updateUser.setMemberExpireTime(null);
        updateUser.setMemberBadge(null);
        updateUser.setDailyUploadLimit(10);
        QueryWrapper<User> qw = new QueryWrapper<>();
        qw.lt("memberExpireTime", new Date()).gt("memberLevel", 0);
        userService.update(updateUser, qw);
        log.info("Expired member check completed");
    }
}