import React, { useState, useEffect, useContext, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";
import { useTheme } from "../hooks/useTheme";
import { toast } from "sonner";

interface FormData {
    username: string;
    email: string;
    phone: string;
    bio: string;
    location: string;
    website: string;
    avatar: string;
    coverImage: string;
}

interface PrivacySettings {
    profileVisible: boolean;
    photosPublic: boolean;
    allowComments: boolean;
    allowFollowing: boolean;
    showLocation: boolean;
    showEmail: boolean;
    showPhone: boolean;
}

interface Preferences {
    theme: string;
    language: string;
    defaultTab: string;
    notifications: {
        newFollower: boolean;
        newLike: boolean;
        newComment: boolean;
        newMessage: boolean;
        systemUpdates: boolean;
        activityReminders: boolean;
    };
    emailNotifications: {
        weeklyDigest: boolean;
        eventReminders: boolean;
        promotionalOffers: boolean;
    };
    messageSettings: {
        pushEnabled: boolean;
        soundEnabled: boolean;
        notificationPreview: boolean;
        readReceipts: boolean;
        typingIndicators: boolean;
        autoDownloadMedia: "wifi" | "all" | "none";
        notificationSound: string;
    };
}

interface SecuritySettings {
    twoFactorEnabled: boolean;
    lastLogin: string;
    lastIp: string;
}

const ProfileSettings: React.FC = () => {
    const {
        isAuthenticated,
        user,
        logout
    } = useContext(AuthContext);

    const {
        theme,
        toggleTheme
    } = useTheme();

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<"account" | "privacy" | "preferences" | "messages" | "security">("account");
    const [isEditing, setIsEditing] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        username: user?.username || "@光影捕手",
        email: user?.email || "photographer@example.com",
        phone: "138****6789",
        bio: "热爱风光和人像摄影，正在不断学习和进步中",
        location: "上海",
        website: "https://photographer.example.com",
        avatar: user?.avatar || "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc",
        coverImage: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=photography%20studio%20background%20professional&sign=47d4a7099d77fa3997b410d6959c5bc6"
    });

    const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
        profileVisible: true,
        photosPublic: true,
        allowComments: true,
        allowFollowing: true,
        showLocation: true,
        showEmail: false,
        showPhone: false
    });

    const [preferences, setPreferences] = useState<Preferences>({
        theme: "dark",
        language: "zh-CN",
        defaultTab: "feed",

        notifications: {
            newFollower: true,
            newLike: true,
            newComment: true,
            newMessage: true,
            systemUpdates: true,
            activityReminders: true
        },

        emailNotifications: {
            weeklyDigest: true,
            eventReminders: true,
            promotionalOffers: false
        },

        messageSettings: {
            pushEnabled: true,
            soundEnabled: true,
            notificationPreview: true,
            readReceipts: true,
            typingIndicators: true,
            autoDownloadMedia: "wifi",
            notificationSound: "default"
        }
    });

    const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
        twoFactorEnabled: false,
        lastLogin: "2023-10-25 14:30:22",
        lastIp: "192.168.1.1"
    });

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                username: user.username || prev.username,
                email: user.email || prev.email,
                avatar: user.avatar || prev.avatar
            }));
        }
    }, [user]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePrivacyChange = (field: keyof PrivacySettings, value: boolean) => {
        setPrivacySettings(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePreferencesChange = (field: keyof Preferences, value: string) => {
        setPreferences(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleNotificationChange = (field: keyof Preferences["notifications"], value: boolean) => {
        setPreferences(prev => ({
            ...prev,

            notifications: {
                ...prev.notifications,
                [field]: value
            }
        }));
    };

    const handleEmailNotificationChange = (field: keyof Preferences["emailNotifications"], value: boolean) => {
        setPreferences(prev => ({
            ...prev,

            emailNotifications: {
                ...prev.emailNotifications,
                [field]: value
            }
        }));
    };

    const handleMessageSettingChange = (field: keyof Preferences["messageSettings"], value: any) => {
        setPreferences(prev => ({
            ...prev,

            messageSettings: {
                ...prev.messageSettings,
                [field]: value
            }
        }));
    };

    const handleSecurityChange = (field: keyof SecuritySettings, value: boolean) => {
        setSecuritySettings(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveAccount = () => {
        setIsEditing(false);
        setShowSuccessToast(true);

        setTimeout(() => {
            setShowSuccessToast(false);
        }, 1500);
    };

    const handleSaveSettings = () => {
        setShowSuccessToast(true);

        setTimeout(() => {
            setShowSuccessToast(false);
        }, 1500);
    };

    const handleChangePassword = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.warning("请填写所有密码字段");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.warning("新密码与确认密码不匹配");
            return;
        }

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordModal(false);
        setShowSuccessToast(true);

        setTimeout(() => {
            setShowSuccessToast(false);
        }, 1500);
    };

    const closePasswordModal = () => {
        setShowPasswordModal(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    };

    const handleLogout = () => {
        logout();
    };

    const handleFileSelect = (type: "avatar" | "cover", event: React.ChangeEvent<HTMLInputElement>) => {
        if (!isEditing)
            return;

        const file = event.target.files?.[0];

        if (!file)
            return;

        if (!file.type.match("image.*")) {
            toast.warning("请选择图片文件");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.warning("文件大小不能超过5MB");
            return;
        }

        const reader = new FileReader();

        reader.onload = e => {
            if (type === "avatar") {
                setAvatarFile(file);

                setFormData(prev => ({
                    ...prev,
                    avatar: e.target?.result as string
                }));
            } else {
                setCoverFile(file);

                setFormData(prev => ({
                    ...prev,
                    coverImage: e.target?.result as string
                }));
            }
        };

        reader.readAsDataURL(file);
        simulateUpload(type);
    };

    const simulateUpload = (type: "avatar" | "cover") => {
        setIsUploading(true);
        setUploadProgress(0);

        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev === null || prev >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);
                    setUploadProgress(null);
                    toast.success(`${type === "avatar" ? "头像" : "封面"}更新成功`);
                    return null;
                }

                return prev + 10;
            });
        }, 200);
    };

    const triggerFileInput = (type: "avatar" | "cover") => {
        if (!isEditing)
            return;

        if (type === "avatar") {
            avatarInputRef.current?.click();
        } else {
            coverInputRef.current?.click();
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="container mx-auto px-4 py-8 bg-[#1E2A3A] min-h-screen">
                <div
                    className="flex flex-col items-center justify-center h-[60vh] text-center">
                    <div
                        className="w-16 h-16 bg-[#4A5F8B] rounded-full flex items-center justify-center text-[#F5F7FA] mb-4">
                        <i className="fa-solid fa-user-lock text-2xl"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-[#F5F7FA] mb-2">请先登录</h2>
                    <p className="text-[#B8C6D8] mb-6 max-w-md">登录后管理您的账号设置和隐私偏好</p>
                    <Link
                        to="/login"
                        className="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#63B3ED] transition-colors">立即登录
                                                          </Link>
                </div>
            </div>
        );
    }

    return (
        <div
            className="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
            <motion.div
                initial={{
                    opacity: 0,
                    y: 20
                }}
                animate={{
                    opacity: 1,
                    y: 0
                }}
                transition={{
                    duration: 0.5
                }}>
                {}
                <div className="mb-6">
                    <Link
                        to="/profile-center"
                        className="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors">
                        <i className="fa-solid fa-arrow-left"></i>
                        <span>返回个人中心</span>
                    </Link>
                </div>
                {}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-[#F5F7FA] mb-2">账号设置</h1>
                    <p className="text-[#B8C6D8] max-w-2xl mx-auto">管理您的账号信息、隐私设置和通知偏好
                                                          </p>
                </div>
                {}
                <div className="bg-[#2D3748] rounded-xl p-1 mb-8 flex flex-wrap">
                    <button
                        onClick={() => setActiveTab("account")}
                        className={`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${activeTab === "account" ? "bg-[#4A5F8B] text-[#F5F7FA] font-medium" : "bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]"}`}>账号信息
                                                          </button>
                    <button
                        onClick={() => setActiveTab("privacy")}
                        className={`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${activeTab === "privacy" ? "bg-[#4A5F8B] text-[#F5F7FA] font-medium" : "bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]"}`}>隐私设置
                                                          </button>
                    <button
                        onClick={() => setActiveTab("preferences")}
                        className={`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${activeTab === "preferences" ? "bg-[#4A5F8B] text-[#F5F7FA] font-medium" : "bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]"}`}>偏好设置
                                                          </button>
                    <button
                        onClick={() => setActiveTab("messages")}
                        className={`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${activeTab === "messages" ? "bg-[#4A5F8B] text-[#F5F7FA] font-medium" : "bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]"}`}>消息设置
                                                          </button>
                    <button
                        onClick={() => setActiveTab("security")}
                        className={`flex-1 py-3 px-4 text-center rounded-lg transition-colors ${activeTab === "security" ? "bg-[#4A5F8B] text-[#F5F7FA] font-medium" : "bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]"}`}>安全设置
                                                          </button>
                </div>
                {}
                {showSuccessToast && <motion.div
                    initial={{
                        opacity: 0,
                        y: -20
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    exit={{
                        opacity: 0,
                        y: -20
                    }}
                    className="fixed top-4 right-4 bg-[#4A5F8B] text-[#F5F7FA] px-4 py-3 rounded-lg shadow-lg z-50 flex items-center">
                    <i className="fa-solid fa-check-circle mr-2"></i>
                    <span>保存成功！</span>
                </motion.div>}
                {}
                {activeTab === "account" && <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                    <div
                        className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-[#F5F7FA]">个人信息</h3>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B] mt-3 md:mt-0">
                            {isEditing ? "取消" : "编辑"}
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {}
                        <div>
                            <h4 className="text-sm font-medium text-[#F5F7FA] mb-4">头像设置</h4>
                            <div className="flex flex-col items-center mb-8">
                                <div className="relative mb-4">
                                    <div
                                        className="w-32 h-32 rounded-full border-4 border-[#B8C6D8] overflow-hidden shadow-md">
                                        <img
                                            src={formData.avatar}
                                            alt="User avatar"
                                            className="w-full h-full object-cover" />
                                    </div>
                                    {isEditing && <div
                                        className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[#4A5F8B] text-[#F5F7FA] flex items-center justify-center cursor-pointer hover:bg-[#6B7C93] transition-colors"
                                        onClick={() => triggerFileInput("avatar")}>
                                        <i className="fa-solid fa-camera"></i>
                                    </div>}
                                </div>
                                {isEditing && <button
                                    className="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B] text-sm"
                                    onClick={() => triggerFileInput("avatar")}>更换头像
                                                                                            </button>}
                                {}
                                {isUploading && avatarFile && <div className="w-full mt-2">
                                    <div className="flex justify-between items-center text-xs text-[#B8C6D8] mb-1">
                                        <span>上传头像...</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-[#1E2532] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#4A5F8B]"
                                            style={{
                                                width: `${uploadProgress}%`
                                            }}></div>
                                    </div>
                                </div>}
                            </div>
                            <h4 className="text-sm font-medium text-[#F5F7FA] mb-4">封面设置</h4>
                            <div className="relative mb-4">
                                <div className="h-40 rounded-lg overflow-hidden border-2 border-[#B8C6D8]">
                                    <img
                                        src={formData.coverImage}
                                        alt="Cover image"
                                        className="w-full h-full object-cover" />
                                </div>
                                {isEditing && <div
                                    className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-[#4A5F8B] text-[#F5F7FA] flex items-center justify-center cursor-pointer hover:bg-[#6B7C93] transition-colors"
                                    onClick={() => triggerFileInput("cover")}>
                                    <i className="fa-solid fa-camera"></i>
                                </div>}
                            </div>
                            {isEditing && <button
                                className="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B] text-sm"
                                onClick={() => triggerFileInput("cover")}>更换封面
                                                                                  </button>}
                            {}
                            {isUploading && coverFile && <div className="w-full mt-2">
                                <div className="flex justify-between items-center text-xs text-[#B8C6D8] mb-1">
                                    <span>上传封面...</span>
                                    <span>{uploadProgress}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-[#1E2532] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#4A5F8B]"
                                        style={{
                                            width: `${uploadProgress}%`
                                        }}></div>
                                </div>
                            </div>}
                            {}
                            <input
                                ref={avatarInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={e => handleFileSelect("avatar", e)} />
                            <input
                                ref={coverInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={e => handleFileSelect("cover", e)} />
                        </div>
                        {}
                        <div className="space-y-6">
                            <div>
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-[#F5F7FA] mb-1">用户名
                                                                                          </label>
                                <input
                                    type="text"
                                    id="username"
                                    value={formData.username}
                                    onChange={e => handleInputChange("username", e.target.value)}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all ${!isEditing ? "cursor-not-allowed" : ""}`} />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-[#F5F7FA] mb-1">电子邮箱
                                                                                          </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={e => handleInputChange("email", e.target.value)}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all ${!isEditing ? "cursor-not-allowed" : ""}`} />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-[#F5F7FA] mb-1">手机号码
                                                                                          </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={formData.phone}
                                    onChange={e => handleInputChange("phone", e.target.value)}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all ${!isEditing ? "cursor-not-allowed" : ""}`} />
                            </div>
                            <div>
                                <label htmlFor="bio" className="block text-sm font-medium text-[#F5F7FA] mb-1">个人简介
                                                                                          </label>
                                <textarea
                                    id="bio"
                                    value={formData.bio}
                                    onChange={e => handleInputChange("bio", e.target.value)}
                                    disabled={!isEditing}
                                    rows={3}
                                    className={`w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all resize-none ${!isEditing ? "cursor-not-allowed" : ""}`} />
                            </div>
                            <div>
                                <label
                                    htmlFor="location"
                                    className="block text-sm font-medium text-[#F5F7FA] mb-1">所在地区
                                                                                          </label>
                                <input
                                    type="text"
                                    id="location"
                                    value={formData.location}
                                    onChange={e => handleInputChange("location", e.target.value)}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all ${!isEditing ? "cursor-not-allowed" : ""}`} />
                            </div>
                            <div>
                                <label
                                    htmlFor="website"
                                    className="block text-sm font-medium text-[#F5F7FA] mb-1">个人网站
                                                                                          </label>
                                <input
                                    type="url"
                                    id="website"
                                    value={formData.website}
                                    onChange={e => handleInputChange("website", e.target.value)}
                                    disabled={!isEditing}
                                    className={`w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all ${!isEditing ? "cursor-not-allowed" : ""}`} />
                            </div>
                            {isEditing && <div className="flex justify-end mt-4">
                                <button
                                    onClick={handleSaveAccount}
                                    className="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors">保存更改
                                                                                            </button>
                            </div>}
                        </div>
                    </div>
                </div>}
                {}
                {activeTab === "privacy" && <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-[#F5F7FA]">隐私设置</h3>
                        <button
                            onClick={handleSaveSettings}
                            className="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors">保存设置
                                                                      </button>
                    </div>
                    <div className="space-y-6">
                        <div className="p-4 bg-[#1E2532] rounded-lg">
                            <h4 className="font-medium text-[#F5F7FA] mb-4">个人资料可见性</h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">允许他人查看我的个人资料</label>
                                        <p className="text-xs text-[#B8C6D8]">关闭后，其他用户将无法找到和查看您的个人主页</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={privacySettings.profileVisible}
                                            onChange={e => handlePrivacyChange("profileVisible", e.target.checked)} />
                                        <div
                                            className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">作品公开可见</label>
                                        <p className="text-xs text-[#B8C6D8]">关闭后，只有您关注的用户可以查看您的作品</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={privacySettings.photosPublic}
                                            onChange={e => handlePrivacyChange("photosPublic", e.target.checked)} />
                                        <div
                                            className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">允许评论我的作品</label>
                                        <p className="text-xs text-[#B8C6D8]">关闭后，其他用户将无法对您的作品发表评论</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={privacySettings.allowComments}
                                            onChange={e => handlePrivacyChange("allowComments", e.target.checked)} />
                                        <div
                                            className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">允许他人关注我</label>
                                        <p className="text-xs text-[#B8C6D8]">关闭后，其他用户将无法关注您的账号</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={privacySettings.allowFollowing}
                                            onChange={e => handlePrivacyChange("allowFollowing", e.target.checked)} />
                                        <div
                                            className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-[#1E2532] rounded-lg">
                            <h4 className="font-medium text-[#F5F7FA] mb-4">个人信息展示</h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">显示我的所在地区</label>
                                        <p className="text-xs text-[#B8C6D8]">在个人主页显示您设置的所在地区信息</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={privacySettings.showLocation}
                                            onChange={e => handlePrivacyChange("showLocation", e.target.checked)} />
                                        <div
                                            className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">显示我的电子邮箱</label>
                                        <p className="text-xs text-[#B8C6D8]">在个人主页显示您的电子邮箱地址</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={privacySettings.showEmail}
                                            onChange={e => handlePrivacyChange("showEmail", e.target.checked)} />
                                        <div
                                            className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">显示我的手机号码</label>
                                        <p className="text-xs text-[#B8C6D8]">在个人主页显示您的手机号码</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={privacySettings.showPhone}
                                            onChange={e => handlePrivacyChange("showPhone", e.target.checked)} />
                                        <div
                                            className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-[#1E2532] rounded-lg">
                            <h4 className="font-medium text-[#F5F7FA] mb-2">隐私提示</h4>
                            <p className="text-sm text-[#B8C6D8]">保护您的隐私对我们至关重要。请根据您的需求调整上述设置，控制谁可以查看您的个人信息和作品。如果您有任何疑问或需要帮助，请联系我们的客服团队。
                                                                                </p>
                        </div>
                    </div>
                </div>}
                {}
                {activeTab === "preferences" && <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-[#F5F7FA]">偏好设置</h3>
                        <button
                            onClick={handleSaveSettings}
                            className="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors">保存设置
                                                                      </button>
                    </div>
                    <div className="space-y-6">
                        {}
                        <div className="p-4 bg-[#1E2532] rounded-lg">
                            <h4 className="font-medium text-[#F5F7FA] mb-4">界面设置</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#F5F7FA] mb-1">主题偏好</label>
                                    <select
                                        value={preferences.theme}
                                        onChange={e => handlePreferencesChange("theme", e.target.value)}
                                        className="w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
                                        <option value="dark">深色模式</option>
                                        <option value="light">浅色模式</option>
                                        <option value="system">跟随系统</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#F5F7FA] mb-1">语言</label>
                                    <select
                                        value={preferences.language}
                                        onChange={e => handlePreferencesChange("language", e.target.value)}
                                        className="w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
                                        <option value="zh-CN">简体中文</option>
                                        <option value="en-US">English (US)</option>
                                        <option value="ja-JP">日本語</option>
                                        <option value="ko-KR">한국어</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#F5F7FA] mb-1">默认首页</label>
                                    <select
                                        value={preferences.defaultTab}
                                        onChange={e => handlePreferencesChange("defaultTab", e.target.value)}
                                        className="w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
                                        <option value="feed">推荐动态</option>
                                        <option value="explore">发现作品</option>
                                        <option value="profile">个人主页</option>
                                        <option value="community">社区</option>
                                    </select>
                                </div>
                                <></>
                                <></>
                            </div>
                        </div>
                        {}
                        <div className="p-4 bg-[#1E2532] rounded-lg">
                            <h4 className="font-medium text-[#F5F7FA] mb-4">内容显示设置</h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">显示作品作者信息</label>
                                        <p className="text-xs text-[#B8C6D8]">在作品卡片上显示作者头像和名称</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked={true} />
                                        <div
                                            className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">显示作品数据统计</label>
                                        <p className="text-xs text-[#B8C6D8]">显示点赞、评论和收藏数量</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked={true} />
                                        <div
                                            className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">显示EXIF信息</label>
                                        <p className="text-xs text-[#B8C6D8]">在作品详情页显示拍摄参数</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked={true} />
                                        <div
                                            className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#F5F7FA] mb-1">作品列表显示方式</label>
                                    <select
                                        className="w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
                                        <option value="grid">网格视图</option>
                                        <option value="list">列表视图</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#F5F7FA] mb-1">默认排序方式</label>
                                    <select
                                        className="w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
                                        <option value="latest">最新发布</option>
                                        <option value="popular">热门推荐</option>
                                        <option value="trending">趋势上升</option>
                                        <option value="distance">距离最近</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        {}
                        <div className="p-4 bg-[#1E2532] rounded-lg">
                            <h4 className="font-medium text-[#F5F7FA] mb-4">上传设置</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#F5F7FA] mb-1">默认作品隐私</label>
                                    <select
                                        className="w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
                                        <option value="public">公开</option>
                                        <option value="friends">仅关注可见</option>
                                        <option value="private">私有</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#F5F7FA] mb-1">上传质量设置</label>
                                    <select
                                        className="w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
                                        <option value="high">高质量</option>
                                        <option value="balanced">平衡</option>
                                        <option value="compressed">节省空间</option>
                                    </select>
                                    <p className="text-xs text-[#B8C6D8] mt-1">影响上传速度和存储空间占用</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">自动保存EXIF信息</label>
                                        <p className="text-xs text-[#B8C6D8]">保留拍摄参数和位置信息</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked={true} />
                                        <div
                                            className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">上传时添加水印</label>
                                        <p className="text-xs text-[#B8C6D8]">在作品右下角添加您的用户名</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked={false} />
                                        <div
                                            className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                        {}
                        <div className="p-4 bg-[#1E2532] rounded-lg">
                            <h4 className="font-medium text-[#F5F7FA] mb-4">快捷键设置</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">启用快捷键</label>
                                        <p className="text-xs text-[#B8C6D8]">使用键盘快捷键快速操作</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked={true} />
                                        <div
                                            className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-[#B8C6D8]">点赞作品</span>
                                        <span className="px-3 py-1 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg text-sm">L</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-[#B8C6D8]">收藏作品</span>
                                        <span className="px-3 py-1 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg text-sm">Ctrl+B</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-[#B8C6D8]">查看下一个作品</span>
                                        <span className="px-3 py-1 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg text-sm">→</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-[#B8C6D8]">查看上一个作品</span>
                                        <span className="px-3 py-1 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg text-sm">←</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-[#B8C6D8]">搜索</span>
                                        <span className="px-3 py-1 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg text-sm">Ctrl+F</span>
                                    </div>
                                </div>
                                <button
                                    className="w-full py-2 bg-[#1E2532] text-[#B8C6D8] border border-[#4A5F8B] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors text-sm">查看全部快捷键
                                                                    </button>
                            </div>
                        </div>
                        {}
                        <div className="p-4 bg-[#1E2532] rounded-lg">
                            <h4 className="font-medium text-[#F5F7FA] mb-4">存储空间管理</h4>
                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm text-[#B8C6D8]">已用存储</span>
                                    <span className="text-sm text-[#F5F7FA]">2.4GB / 10GB</span>
                                </div>
                                <div
                                    className="w-full h-2 bg-[#1E2532] rounded-full overflow-hidden border border-[#4A5F8B]">
                                    <div
                                        className="h-full bg-[#4A5F8B]"
                                        style={{
                                            width: "24%"
                                        }}></div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">自动清理临时文件</label>
                                        <p className="text-xs text-[#B8C6D8]">定期清理缓存和临时文件</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked={true} />
                                        <div
                                            className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#F5F7FA] mb-1">清理频率</label>
                                    <select
                                        className="w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
                                        <option value="weekly">每周</option>
                                        <option value="biweekly">每两周</option>
                                        <option value="monthly">每月</option>
                                        <option value="quarterly">每季度</option>
                                    </select>
                                </div>
                                <button
                                    className="w-full py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors text-sm flex items-center justify-center">
                                    <i className="fa-solid fa-broom mr-2"></i>立即清理存储空间
                                                                    </button>
                                <button
                                    className="w-full py-2 bg-[#1E2532] text-[#B8C6D8] border border-[#4A5F8B] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors text-sm flex items-center justify-center">
                                    <i className="fa-solid fa-expand mr-2"></i>升级存储空间
                                                                    </button>
                            </div>
                        </div>
                        {}
                        <div className="p-4 bg-[#1E2532] rounded-lg">
                            <h4 className="font-medium text-[#F5F7FA] mb-4">数据管理</h4>
                            <div className="space-y-4">
                                <div className="p-3 bg-[#4A5F8B]/10 rounded-lg border border-[#4A5F8B]/30">
                                    <h5 className="font-medium text-[#F5F7FA] mb-2">导出您的个人数据</h5>
                                    <p className="text-sm text-[#B8C6D8] mb-3">您可以导出账户中的所有个人数据，包括作品、评论、点赞等信息</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <button
                                            className="py-2 bg-[#1E2532] text-[#B8C6D8] border border-[#4A5F8B] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors text-sm flex items-center justify-center">
                                            <i className="fa-solid fa-download mr-2"></i>导出所有数据
                                                                                    </button>
                                        <button
                                            className="py-2 bg-[#1E2532] text-[#B8C6D8] border border-[#4A5F8B] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors text-sm flex items-center justify-center">
                                            <i className="fa-solid fa-image mr-2"></i>仅导出作品
                                                                                    </button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">保留浏览历史</label>
                                        <p className="text-xs text-[#B8C6D8]">记录您浏览过的作品和页面</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked={true} />
                                        <div
                                            className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">保留搜索历史</label>
                                        <p className="text-xs text-[#B8C6D8]">记录您的搜索关键词</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked={true} />
                                        <div
                                            className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                                <button
                                    className="w-full py-2 bg-[#1E2532] text-[#B8C6D8] border border-[#4A5F8B] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors text-sm flex items-center justify-center">
                                    <i className="fa-solid fa-trash-can mr-2"></i>清除所有历史记录
                                                                    </button>
                            </div>
                        </div>
                    </div>
                </div>}
                {}
                {activeTab === "security" && <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-[#F5F7FA]">安全设置</h3>
                    </div>
                    <div className="space-y-6">
                        <div className="p-4 bg-[#1E2532] rounded-lg">
                            <h4 className="font-medium text-[#F5F7FA] mb-4">账号安全</h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">修改密码</label>
                                        <p className="text-xs text-[#B8C6D8]">定期修改密码可以提高账号安全性</p>
                                    </div>
                                    <button
                                        className="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B] text-sm"
                                        onClick={() => setShowPasswordModal(true)}>修改
                                                                                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">两步验证</label>
                                        <p className="text-xs text-[#B8C6D8]">开启后登录需要额外的验证码确认</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={securitySettings.twoFactorEnabled}
                                            onChange={e => handleSecurityChange("twoFactorEnabled", e.target.checked)} />
                                        <div
                                            className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">绑定手机</label>
                                        <p className="text-xs text-[#B8C6D8]">绑定手机可以用于账号恢复和安全验证</p>
                                    </div>
                                    <button
                                        className="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B] text-sm">绑定
                                                                                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 bg-[#1E2532] rounded-lg">
                            <h4 className="font-medium text-[#F5F7FA] mb-4">登录记录</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#B8C6D8]">上次登录时间</span>
                                    <span className="text-[#F5F7FA]">{securitySettings.lastLogin}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[#B8C6D8]">上次登录IP</span>
                                    <span className="text-[#F5F7FA]">{securitySettings.lastIp}</span>
                                </div>
                                <button
                                    className="w-full py-2 text-center text-sm text-[#4A5F8B] hover:underline transition-colors">查看更多登录记录
                                                                                          </button>
                            </div>
                        </div>
                        <div className="p-4 bg-[#1E2532] rounded-lg">
                            <h4 className="font-medium text-[#F5F7FA] mb-2">安全建议</h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-[#B8C6D8]">
                                <li>定期修改密码，使用字母、数字和特殊字符的组合</li>
                                <li>开启两步验证，提高账号安全性</li>
                                <li>不要在不安全的网络环境下登录账号</li>
                                <li>不要将账号密码告诉他人或在其他网站使用相同密码</li>
                                <li>如果发现可疑登录，请立即修改密码并联系客服</li>
                            </ul>
                        </div>
                        <div className="p-4 bg-[#1E2532] rounded-lg border border-[#4A5F8B]">
                            <h4 className="font-medium text-[#F5F7FA] mb-2">账号注销</h4>
                            <p className="text-sm text-[#B8C6D8] mb-4">注销账号后，您的所有数据将被永久删除，此操作无法撤销。
                                                                                </p>
                            <button
                                className="px-4 py-2 bg-[#6B7C93] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#F56565] hover:text-[#F5F7FA] transition-colors text-sm">注销账号
                                                                                </button>
                        </div>
                        <div className="p-4 bg-[#1E2532] rounded-lg border border-[#4A5F8B]">
                            <h4 className="font-medium text-[#F5F7FA] mb-2">退出登录</h4>
                            <p className="text-sm text-[#B8C6D8] mb-4">退出当前账号，需要重新登录才能继续使用。
                                                                                </p>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] hover:text-[#F5F7FA] transition-colors text-sm">退出登录
                                                                                </button>
                        </div>
                    </div>
                    {}
                    {showPasswordModal && <motion.div
                        initial={{
                            opacity: 0
                        }}
                        animate={{
                            opacity: 1
                        }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div
                            className="bg-[#2D3748] rounded-xl p-6 max-w-md w-full border border-[#4A5F8B]">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-[#F5F7FA]">修改密码</h3>
                                <button
                                    onClick={closePasswordModal}
                                    className="text-[#F5F7FA] hover:text-[#4A5F8B]">
                                    <i className="fa-solid fa-times"></i>
                                </button>
                            </div>
                            <div className="space-y-4 mb-4">
                                <div>
                                    <label
                                        htmlFor="currentPassword"
                                        className="block text-sm font-medium text-[#F5F7FA] mb-1">当前密码</label>
                                    <input
                                        type="password"
                                        id="currentPassword"
                                        value={currentPassword}
                                        onChange={e => setCurrentPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all" />
                                </div>
                                <div>
                                    <label
                                        htmlFor="newPassword"
                                        className="block text-sm font-medium text-[#F5F7FA] mb-1">新密码</label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all" />
                                </div>
                                <div>
                                    <label
                                        htmlFor="confirmPassword"
                                        className="block text-sm font-medium text-[#F5F7FA] mb-1">确认新密码</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all" />
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={closePasswordModal}
                                    className="flex-1 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B] text-sm">取消
                                                                                            </button>
                                <button
                                    onClick={handleChangePassword}
                                    className="flex-1 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors text-sm">确认修改
                                                                                            </button>
                            </div>
                        </div>
                    </motion.div>}
                </div>}
                {}
                {activeTab === "messages" && <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-[#F5F7FA]">消息设置</h3>
                        <button
                            onClick={handleSaveSettings}
                            className="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors">保存设置
                                                                      </button>
                    </div>
                    <div className="space-y-6">
                        {}
                        <div className="p-4 bg-[#1E2532] rounded-lg">
                            <h4 className="font-medium text-[#F5F7FA] mb-4">通知设置</h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">新粉丝提醒</label>
                                        <p className="text-xs text-[#B8C6D8]">当有新用户关注您时接收通知</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={preferences.notifications.newFollower}
                                            onChange={e => handleNotificationChange("newFollower", e.target.checked)} />
                                        <div
                                            className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">新点赞提醒</label>
                                        <p className="text-xs text-[#B8C6D8]">当您的作品获得新点赞时接收通知</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={preferences.notifications.newLike}
                                            onChange={e => handleNotificationChange("newLike", e.target.checked)} />
                                        <div
                                            className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">新评论提醒</label>
                                        <p className="text-xs text-[#B8C6D8]">当您的作品收到新评论时接收通知</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={preferences.notifications.newComment}
                                            onChange={e => handleNotificationChange("newComment", e.target.checked)} />
                                        <div
                                            className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">新消息提醒</label>
                                        <p className="text-xs text-[#B8C6D8]">当您收到新私信时接收通知</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={preferences.notifications.newMessage}
                                            onChange={e => handleNotificationChange("newMessage", e.target.checked)} />
                                        <div
                                            className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">系统更新提醒</label>
                                        <p className="text-xs text-[#B8C6D8]">接收平台系统更新和维护通知</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={preferences.notifications.systemUpdates}
                                            onChange={e => handleNotificationChange("systemUpdates", e.target.checked)} />
                                        <div
                                            className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">活动提醒</label>
                                        <p className="text-xs text-[#B8C6D8]">接收您报名的活动和赛事提醒</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={preferences.notifications.activityReminders}
                                            onChange={e => handleNotificationChange("activityReminders", e.target.checked)} />
                                        <div
                                            className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                        {}
                        <div className="p-4 bg-[#1E2532] rounded-lg">
                            <h4 className="font-medium text-[#F5F7FA] mb-4">邮件通知设置</h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">每周精选</label>
                                        <p className="text-xs text-[#B8C6D8]">每周发送精选作品和摄影技巧到您的邮箱</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={preferences.emailNotifications.weeklyDigest}
                                            onChange={e => handleEmailNotificationChange("weeklyDigest", e.target.checked)} />
                                        <div
                                            className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">活动提醒邮件</label>
                                        <p className="text-xs text-[#B8C6D8]">通过邮件接收您报名的活动和赛事提醒</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={preferences.emailNotifications.eventReminders}
                                            onChange={e => handleEmailNotificationChange("eventReminders", e.target.checked)} />
                                        <div
                                            className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">优惠促销邮件</label>
                                        <p className="text-xs text-[#B8C6D8]">接收平台优惠活动和促销信息</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={preferences.emailNotifications.promotionalOffers}
                                            onChange={e => handleEmailNotificationChange("promotionalOffers", e.target.checked)} />
                                        <div
                                            className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                        {}
                        <div className="p-4 bg-[#1E2532] rounded-lg">
                            <h4 className="font-medium text-[#F5F7FA] mb-4">消息推送通知</h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">消息推送通知</label>
                                        <p className="text-xs text-[#B8C6D8]">接收新消息的推送通知</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={preferences.messageSettings.pushEnabled}
                                            onChange={e => handleMessageSettingChange("pushEnabled", e.target.checked)} />
                                        <div
                                            className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">消息提示音</label>
                                        <p className="text-xs text-[#B8C6D8]">收到新消息时播放提示音</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={preferences.messageSettings.soundEnabled}
                                            onChange={e => handleMessageSettingChange("soundEnabled", e.target.checked)} />
                                        <div
                                            className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">通知预览</label>
                                        <p className="text-xs text-[#B8C6D8]">在锁屏和通知中心显示消息内容</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={preferences.messageSettings.notificationPreview}
                                            onChange={e => handleMessageSettingChange("notificationPreview", e.target.checked)} />
                                        <div
                                            className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">夜间免打扰模式</label>
                                        <p className="text-xs text-[#B8C6D8]">在设定的时间段内不接收消息通知</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked={false} />
                                        <div
                                            className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#F5F7FA] mb-1">通知提示音</label>
                                    <select
                                        value={preferences.messageSettings.notificationSound}
                                        onChange={e => handleMessageSettingChange("notificationSound", e.target.value)}
                                        className="w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
                                        <option value="default">默认</option>
                                        <option value="classic">经典</option>
                                        <option value="chime">叮咚</option>
                                        <option value="bell">铃铛</option>
                                        <option value="silent">静音</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        {}
                        <div className="p-4 bg-[#1E2532] rounded-lg">
                            <h4 className="font-medium text-[#F5F7FA] mb-4">聊天设置</h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">已读回执</label>
                                        <p className="text-xs text-[#B8C6D8]">对方可以看到您是否已读消息</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={preferences.messageSettings.readReceipts}
                                            onChange={e => handleMessageSettingChange("readReceipts", e.target.checked)} />
                                        <div
                                            className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">输入状态提示</label>
                                        <p className="text-xs text-[#B8C6D8]">对方可以看到您正在输入</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={preferences.messageSettings.typingIndicators}
                                            onChange={e => handleMessageSettingChange("typingIndicators", e.target.checked)} />
                                        <div
                                            className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">保留聊天记录</label>
                                        <p className="text-xs text-[#B8C6D8]">选择聊天记录的保存时长</p>
                                    </div>
                                    <select
                                        className="px-4 py-2 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
                                        <option value="forever">永久保留</option>
                                        <option value="30days">30天</option>
                                        <option value="90days">90天</option>
                                        <option value="1year">1年</option>
                                    </select>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">自动清除聊天历史</label>
                                        <p className="text-xs text-[#B8C6D8]">退出应用时自动清除聊天记录</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked={false} />
                                        <div
                                            className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                        {}
                        <div className="p-4 bg-[#1E2532] rounded-lg">
                            <h4 className="font-medium text-[#F5F7FA] mb-4">媒体设置</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#F5F7FA] mb-1">媒体自动下载</label>
                                    <select
                                        value={preferences.messageSettings.autoDownloadMedia}
                                        onChange={e => handleMessageSettingChange("autoDownloadMedia", e.target.value)}
                                        className="w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
                                        <option value="wifi">仅在WiFi环境</option>
                                        <option value="all">任何网络环境</option>
                                        <option value="none">手动下载</option>
                                    </select>
                                    <p className="text-xs text-[#B8C6D8] mt-1">设置图片、视频等媒体内容的自动下载方式</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">保存到相册</label>
                                        <p className="text-xs text-[#B8C6D8]">自动保存收到的图片和视频到设备相册</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked={true} />
                                        <div
                                            className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <label className="block text-sm font-medium text-[#F5F7FA] mb-1">播放GIF自动播放</label>
                                        <p className="text-xs text-[#B8C6D8]">在聊天中自动播放GIF动画</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked={true} />
                                        <div
                                            className="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                                    </label>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#F5F7FA] mb-1">媒体质量</label>
                                    <select
                                        className="w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
                                        <option value="high">高质量</option>
                                        <option value="medium">中等质量</option>
                                        <option value="low">省流量</option>
                                    </select>
                                    <p className="text-xs text-[#B8C6D8] mt-1">设置发送媒体文件的默认质量</p>
                                </div>
                            </div>
                        </div>
                        {}
                        <div className="p-4 bg-[#1E2532] rounded-lg">
                            <h4 className="font-medium text-[#F5F7FA] mb-2">消息存储</h4>
                            <p className="text-sm text-[#B8C6D8] mb-4">您当前消息占用的存储空间约为 128MB，建议定期清理不需要的聊天记录以释放空间。
                                                                                </p>
                            <button
                                className="w-full py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B] text-sm">
                                <i className="fa-solid fa-trash-alt mr-2"></i>清理消息缓存
                                                                                </button>
                        </div>
                    </div>
                </div>}
                {}
            </motion.div>
        </div>
    );
};

export default ProfileSettings;