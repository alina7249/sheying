import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

import { AuthContext } from "../contexts/authContext";
import { toast } from "sonner";

const recentActivities = [{
    id: 1,
    text: "3天前发布作品《城市剪影》，获赞23次",
    type: "post"
}, {
    id: 2,
    text: "1周前获得新粉丝5人",
    type: "follower"
}, {
    id: 3,
    text: "2周前完成新手任务《发布第一张作品》",
    type: "task"
}, {
    id: 4,
    text: "3周前作品《森林晨雾》被推荐到首页",
    type: "featured"
}, {
    id: 5,
    text: "1个月前参加摄影比赛《城市风光》",
    type: "contest"
}];

const mockUserPosts = [{
    id: "1",
    title: "晨曦中的山峦",
    description: "捕捉清晨第一缕阳光洒在山峦上的壮丽景色，使用长曝光展现云海的流动感。",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=morning%20sunrise%20mountain%20landscape%20mist%20china&sign=a50c8d6084b10f76978cc2afb1ca29a9",

    author: {
        id: "user-123",
        name: "@光影捕手",
        avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc"
    },

    likes: 324,
    comments: 45,
    tags: ["风光", "日出", "云海", "自然"],
    date: "2023-10-25",
    views: 1256,
    format: "RAW",
    visibility: "公开",
    copyrightType: "独家授权",

    exif: {
        camera: "索尼 A7R IV",
        lens: "FE 16-35mm F2.8 GM",
        aperture: "f/8",
        shutter: "1/125s",
        iso: "100",
        focalLength: "24mm",
        whiteBalance: "自动",
        date: "2023-10-25 06:45:32"
    }
}, {
    id: "2",
    title: "城市剪影",
    description: "从高处俯瞰城市天际线，记录夕阳下城市建筑的剪影效果。",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=city%20skyline%20silhouette%20sunset%20urban%20architecture%20modern&sign=8de72287cf83cda70c057b89bfc1d186",

    author: {
        id: "user-123",
        name: "@光影捕手",
        avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc"
    },

    likes: 289,
    comments: 37,
    tags: ["城市", "建筑", "剪影", "夕阳"],
    date: "2023-10-22",
    views: 987,
    format: "JPG",
    visibility: "公开",
    copyrightType: "非独家",

    exif: {
        camera: "佳能 EOS R6",
        lens: "RF 24-70mm F2.8 L USM",
        aperture: "f/5.6",
        shutter: "1/250s",
        iso: "200",
        focalLength: "70mm",
        whiteBalance: "日光",
        date: "2023-10-22 18:30:15"
    }
}, {
    id: "3",
    title: "海浪与礁石",
    description: "长时间曝光拍摄海浪拍打礁石的场景，展现水的丝绸质感。",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=ocean%20waves%20crashing%20on%20rocks%20long%20exposure%20seascape&sign=e3c4cd3840caaaedc19f43f96183a958",

    author: {
        id: "user-123",
        name: "@光影捕手",
        avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc"
    },

    likes: 412,
    comments: 53,
    tags: ["海景", "慢门", "自然", "礁石"],
    date: "2023-10-18",
    views: 1452,
    format: "RAW",
    visibility: "仅好友可见",
    copyrightType: "独家授权",

    exif: {
        camera: "尼康 Z7 II",
        lens: "NIKKOR Z 14-24mm f/2.8 S",
        aperture: "f/16",
        shutter: "30s",
        iso: "64",
        focalLength: "14mm",
        whiteBalance: "自动",
        date: "2023-10-18 17:45:00"
    }
}, {
    id: "4",
    title: "森林晨雾",
    description: "在山间森林中捕捉晨雾弥漫的神秘氛围，阳光透过树叶形成丁达尔效应。",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=forest%20morning%20mist%20sunlight%20rays%20trees%20mystical&sign=0d866462637658cb7796789831e1cc68",

    author: {
        id: "user-123",
        name: "@光影捕手",
        avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc"
    },

    likes: 387,
    comments: 49,
    tags: ["森林", "晨雾", "丁达尔效应", "自然"],
    date: "2023-10-15",
    views: 1328,
    format: "JPG",
    visibility: "公开",
    copyrightType: "非独家",

    exif: {
        camera: "富士 X-T4",
        lens: "XF 16-80mm F4 R OIS WR",
        aperture: "f/5.6",
        shutter: "1/60s",
        iso: "400",
        focalLength: "35mm",
        whiteBalance: "阴天",
        date: "2023-10-15 07:30:45"
    }
}, {
    id: "5",
    title: "湖畔日落",
    description: "平静的湖面倒映着绚丽的晚霞，形成对称的美感。",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=lake%20sunset%20reflection%20mountains%20evening%20colorful%20sky&sign=c039f18a4bf0746344422a50690ffb6c",

    author: {
        id: "user-123",
        name: "@光影捕手",
        avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc"
    },

    likes: 456,
    comments: 61,
    tags: ["湖泊", "日落", "倒影", "晚霞"],
    date: "2023-10-12",
    views: 1689,
    format: "RAW",
    visibility: "公开",
    copyrightType: "独家授权",

    exif: {
        camera: "索尼 A7R V",
        lens: "FE 24-70mm F2.8 GM II",
        aperture: "f/11",
        shutter: "1/125s",
        iso: "100",
        focalLength: "40mm",
        whiteBalance: "日光",
        date: "2023-10-12 19:15:22"
    }
}, {
    id: "6",
    title: "星空下的古堡",
    description: "在远离城市光污染的地方，拍摄星空下的古堡遗迹，展现历史与自然的交融。",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=castle%20ruins%20under%20starry%20sky%20milky%20way%20night%20long%20exposure&sign=4f691b61d53a7e9b6b0869b95858dbb2",

    author: {
        id: "user-123",
        name: "@光影捕手",
        avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc"
    },

    likes: 523,
    comments: 78,
    tags: ["星空", "夜景", "古堡", "银河"],
    date: "2023-10-08",
    views: 1976,
    format: "RAW",
    visibility: "私密",
    copyrightType: "独家授权",

    exif: {
        camera: "佳能 EOS R5",
        lens: "RF 15-35mm F2.8 L IS USM",
        aperture: "f/2.8",
        shutter: "25s",
        iso: "3200",
        focalLength: "15mm",
        whiteBalance: "自定义",
        date: "2023-10-08 22:10:30"
    }
}];

const monthlyViewsData = [{
    date: "9/30",
    views: 120,
    likes: 20,
    workName: "晨曦中的山峦"
}, {
    date: "10/1",
    views: 150,
    likes: 25,
    workName: "城市剪影"
}, {
    date: "10/2",
    views: 80,
    likes: 15,
    workName: "海浪与礁石"
}, {
    date: "10/3",
    views: 200,
    likes: 35,
    workName: "森林晨雾"
}, {
    date: "10/4",
    views: 170,
    likes: 30,
    workName: "湖畔日落"
}, {
    date: "10/5",
    views: 250,
    likes: 45,
    workName: "星空下的古堡"
}, {
    date: "10/6",
    views: 220,
    likes: 40,
    workName: "晨曦中的山峦"
}, {
    date: "10/7",
    views: 180,
    likes: 32,
    workName: "城市剪影"
}, {
    date: "10/8",
    views: 190,
    likes: 36,
    workName: "海浪与礁石"
}, {
    date: "10/9",
    views: 230,
    likes: 42,
    workName: "森林晨雾"
}, {
    date: "10/10",
    views: 210,
    likes: 38,
    workName: "湖畔日落"
}, {
    date: "10/11",
    views: 260,
    likes: 48,
    workName: "星空下的古堡"
}, {
    date: "10/12",
    views: 170,
    likes: 30,
    workName: "晨曦中的山峦"
}, {
    date: "10/13",
    views: 190,
    likes: 34,
    workName: "城市剪影"
}, {
    date: "10/14",
    views: 200,
    likes: 36,
    workName: "海浪与礁石"
}, {
    date: "10/15",
    views: 240,
    likes: 44,
    workName: "森林晨雾"
}, {
    date: "10/16",
    views: 220,
    likes: 40,
    workName: "湖畔日落"
}, {
    date: "10/17",
    views: 270,
    likes: 50,
    workName: "星空下的古堡"
}, {
    date: "10/18",
    views: 180,
    likes: 32,
    workName: "晨曦中的山峦"
}, {
    date: "10/19",
    views: 210,
    likes: 38,
    workName: "城市剪影"
}, {
    date: "10/20",
    views: 190,
    likes: 35,
    workName: "海浪与礁石"
}, {
    date: "10/21",
    views: 230,
    likes: 42,
    workName: "森林晨雾"
}, {
    date: "10/22",
    views: 250,
    likes: 46,
    workName: "湖畔日落"
}, {
    date: "10/23",
    views: 280,
    likes: 52,
    workName: "星空下的古堡"
}, {
    date: "10/24",
    views: 200,
    likes: 36,
    workName: "晨曦中的山峦"
}, {
    date: "10/25",
    views: 220,
    likes: 40,
    workName: "城市剪影"
}, {
    date: "10/26",
    views: 210,
    likes: 38,
    workName: "海浪与礁石"
}, {
    date: "10/27",
    views: 250,
    likes: 46,
    workName: "森林晨雾"
}, {
    date: "10/28",
    views: 270,
    likes: 50,
    workName: "湖畔日落"
}, {
    date: "10/29",
    views: 300,
    likes: 56,
    workName: "星空下的古堡"
}];

const recentEquipment = [{
    id: 1,
    name: "索尼 A7R IV",
    type: "camera"
}, {
    id: 2,
    name: "佳能 EF 24-70mm f/2.8L",
    type: "lens"
}, {
    id: 3,
    name: "DJI Mavic 3",
    type: "drone"
}];

const ProfileCenter: React.FC = () => {
    const {
        isAuthenticated,
        user
    } = useContext(AuthContext);

    const [activeTab, setActiveTab] = useState<"posts" | "collections" | "likes">("posts");
    const [sortBy, setSortBy] = useState("latest");
    const [selectedTag, setSelectedTag] = useState("全部");
    const [searchTerm, setSearchTerm] = useState("");
    const [visibilityFilter, setVisibilityFilter] = useState("all");
    const [formatFilter, setFormatFilter] = useState("all");
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [newPostTitle, setNewPostTitle] = useState("");
    const [newPostDescription, setNewPostDescription] = useState("");
    const [newPostTags, setNewPostTags] = useState("");
    const [newPostVisibility, setNewPostVisibility] = useState("公开");

  useEffect(() => {
    const path = window.location.pathname;

    if (path.includes("/profile-center/collections")) {
      setActiveTab("collections");
    } else if (path.includes("/profile-center/likes")) {
      setActiveTab("likes");
    } else {
      setActiveTab("posts");
    }
  }, []);

    const mockUserData = {
        username: "@光影捕手",
        tags: "风光/人像双题材创作者",
        level: "新锐摄影师",
        levelNum: 3,
        progress: 120,
        progressMax: 200,
        memberStatus: "银河会员·年卡",
        memberDaysLeft: 128,
        avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc",
        coverImage: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=photography%20studio%20background%20professional&sign=47d4a7099d77fa3997b410d6959c5bc6",

  stats: {
    posts: mockUserPosts.length,
    newPosts: 2,
    likes: mockUserPosts.reduce((sum, post) => sum + post.likes, 0),
    newLikes: 45,
    collections: 48,
    newCollections: 8,
    followers: 72,
    following: 35
  }
    };

   const sidebarItems = [{
    id: "个人作品",
        icon: "fa-camera",
        text: "我的作品集"
    }, {
        id: "拍摄地点",
        icon: "fa-map-marker-alt",
        text: "我的拍摄地点"
    }, {
        id: "器材库",
        icon: "fa-video",
        text: "我的器材库"
    }, {
        id: "素材库",
        icon: "fa-microchip",
        text: "我的素材库"
    }, {
        id: "我的活动",
        icon: "fa-flag",
        text: "我的活动"
    }, {
        id: "我的赛事",
        icon: "fa-trophy",
        text: "我的赛事"
    }, {
        id: "后期工具",
        icon: "fa-palette",
        text: "后期工具"
    }, {
        id: "会员中心",
        icon: "fa-crown",
        text: "会员中心"
    }, {
        id: "我的订单",
        icon: "fa-shopping-cart",
        text: "我的订单"
    }, {
        id: "我的通知",
        icon: "fa-bell",
        text: "我的通知"
    }, {
        id: "设置",
        icon: "fa-cog",
        text: "设置"
    }];

    const memberBenefits = [{
        id: 1,
        name: "免费RAW素材",
        count: 10
    }, {
        id: 2,
        name: "赛事优先报名",
        count: null
    }, {
        id: 3,
        name: "专属后期预设包",
        count: null
    }, {
        id: 4,
        name: "作品优先推荐",
        count: null
    }];

    const getFilteredPosts = () => {
        let posts = [...mockUserPosts];

        if (selectedTag !== "全部") {
            posts = posts.filter(post => post.tags.includes(selectedTag));
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();

            posts = posts.filter(
                post => post.title.toLowerCase().includes(term) || post.description.toLowerCase().includes(term) || post.tags.some(tag => tag.toLowerCase().includes(term))
            );
        }

        if (visibilityFilter !== "all") {
            posts = posts.filter(post => {
                if (visibilityFilter === "public")
                    return post.visibility === "公开";

                if (visibilityFilter === "friends")
                    return post.visibility === "仅好友可见";

                if (visibilityFilter === "private")
                    return post.visibility === "私密";

                return true;
            });
        }

        if (formatFilter !== "all") {
            posts = posts.filter(post => {
                if (formatFilter === "raw")
                    return post.format === "RAW";

                if (formatFilter === "jpg")
                    return post.format === "JPG";

                return true;
            });
        }

        if (sortBy === "latest") {
            posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } else if (sortBy === "popular") {
            posts.sort((a, b) => b.likes - a.likes);
        } else if (sortBy === "views") {
            posts.sort((a, b) => b.views - a.views);
        }

        return posts;
    };

    const getAllTags = () => {
        const tags = ["全部"];

        mockUserPosts.forEach(post => {
            post.tags.forEach(tag => {
                if (!tags.includes(tag)) {
                    tags.push(tag);
                }
            });
        });

        return tags;
    };

    const filteredPosts = getFilteredPosts();
    const allTags = getAllTags();

    const openEditModal = (postId: string) => {
        console.log("Edit post:", postId);
    };

    const openDeleteModal = (postId: string) => {
        console.log("Delete post:", postId);
    };

    const openCopyrightModal = (postId: string) => {
        console.log("Set copyright for post:", postId);
    };

    const handleUpload = () => {
        setShowUploadModal(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setUploadProgress(0);
        }
    };

    const handleSubmitUpload = () => {
        if (!selectedFile || !newPostTitle.trim()) {
            toast.warning("请选择图片并填写标题");
            return;
        }

        setUploading(true);
        let progress = 0;

        const interval = setInterval(() => {
            progress += 10;
            setUploadProgress(progress);

            if (progress >= 100) {
                clearInterval(interval);

                setTimeout(() => {
                    toast.success("作品上传成功");
                    setSelectedFile(null);
                    setNewPostTitle("");
                    setNewPostDescription("");
                    setNewPostTags("");
                    setNewPostVisibility("公开");
                    setUploading(false);
                    setShowUploadModal(false);
                }, 500);
            }
        }, 200);
    };

    const handleCancelUpload = () => {
        setShowUploadModal(false);
        setSelectedFile(null);
        setNewPostTitle("");
        setNewPostDescription("");
        setNewPostTags("");
        setNewPostVisibility("公开");
        setUploadProgress(0);
    };

    if (!isAuthenticated) {
        return (
            <div className="container mx-auto px-4 py-8 bg-[#1E2532] min-h-screen">
                <div
                    className="flex flex-col items-center justify-center h-[60vh] text-center">
                    <div
                        className="w-16 h-16 bg-[#4A5F8B] rounded-full flex items-center justify-center text-[#F5F7FA] mb-4">
                        <i className="fa-solid fa-user-lock text-2xl"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-[#F5F7FA] mb-2">请先登录</h2>
                    <p className="text-[#B8C6D8] mb-6 max-w-md">登录后查看您的个人中心，管理作品和查看数据统计</p>
                    <Link
                        to="/login"
                        className="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors">立即登录
                                  </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 bg-[#1E2532] min-h-screen">
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
                        to="/"
                        className="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors">
                        <i className="fa-solid fa-arrow-left"></i>
                        <span>返回首页</span>
                    </Link>
                </div>
                {}
                <div
                    className="bg-[#2D3748] rounded-xl overflow-hidden shadow-sm border border-[#4A5F8B] mb-8">
                    {}
                    <div className="h-64 overflow-hidden">
                        <img
                            src={mockUserData.coverImage}
                            alt="Cover"
                            className="w-full h-full object-cover" />
                    </div>
                    {}
                    <div className="px-6 pb-6">
                        <div className="flex flex-col md:flex-row -mt-20 mb-6">
                            {}
                            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                                <div
                                    className="w-40 h-40 rounded-full border-4 border-[#2D3748] overflow-hidden shadow-md border-[#4A5F8B]">
                                    <img
                                        src={mockUserData.avatar}
                                        alt="User avatar"
                                        className="w-full h-full object-cover" />
                                </div>
                            </div>
                            {}
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center">
                                        <h1 className="text-2xl font-bold text-[#F5F7FA] mb-2">
                                            {mockUserData.username}
                                        </h1>
                                        <div className="ml-3 flex flex-wrap gap-2">
                                            <span className="px-2 py-0.5 text-xs bg-[#4A5F8B]/20 text-[#B8C6D8] rounded">
                                                {mockUserData.tags}
                                            </span>
                                        </div>
                                    </div>
                                    {}
                                    <div className="flex items-center mb-4">
                                        <span className="text-[#B8C6D8] text-sm mr-2">{mockUserData.level}LV.{mockUserData.levelNum}</span>
                                        <div className="flex-1 h-2 bg-[#1E2532] rounded-full overflow-hidden mr-2">
                                            <div
                                                className="h-full bg-[#4A5F8B]"
                                                style={{
                                                    width: `${mockUserData.progress / mockUserData.progressMax * 100}%`
                                                }}></div>
                                        </div>
                                        <span className="text-[#B8C6D8] text-xs">{mockUserData.progress}/{mockUserData.progressMax}</span>
                                    </div>
                                    {}
                                    <div className="flex items-center space-x-6">
                                        <div className="flex items-center">
                                            <span className="font-bold text-[#F5F7FA]">{mockUserData.stats.following}</span>
                                            <span className="text-[#B8C6D8]/70 text-sm ml-1">关注</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-bold text-[#F5F7FA]">{mockUserData.stats.followers}</span>
                                            <span className="text-[#B8C6D8]/70 text-sm ml-1">粉丝</span>
                                        </div>
                                    </div>
                                </div>
                                {}
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        className="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] border border-[#4A5F8B] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors">
                                        <i className="fa-solid fa-pen-to-square mr-2 text-[#F5F7FA]"></i>编辑资料
                                                          </button>
                                    <button
                                        className="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] border border-[#4A5F8B] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors">
                                        <i className="fa-solid fa-cog mr-2 text-[#F5F7FA]"></i>设置
                                                          </button>
                                </div>
                            </div>
                        </div>
                        {}
                        <div className="flex flex-wrap border-t border-[#4A5F8B] pt-4">
                            <div className="mr-8 mb-2">
                                <div className="flex items-center space-x-1">
                                    <span className="text-xl font-bold text-[#F5F7FA]">
                                        {mockUserData.stats.posts}
                                    </span>
                                    <i className="fa-solid fa-image text-[#B8C6D8]"></i>
                                </div>
                                <span className="text-sm text-[#B8C6D8]">作品</span>
                            </div>
                            <div className="mr-8 mb-2">
                                <div className="flex items-center space-x-1">
                                    <span className="text-xl font-bold text-[#F5F7FA]">
                                        {mockUserData.stats.likes}
                                    </span>
                                    <i className="fa-solid fa-heart text-[#B8C6D8]"></i>
                                </div>
                                <span className="text-sm text-[#B8C6D8]">获赞</span>
                            </div>
                            <div className="mr-8 mb-2">
                                <div className="flex items-center space-x-1">
                                    <span className="text-xl font-bold text-[#F5F7FA]">
                                        {mockUserData.stats.collections}
                                    </span>
                                    <i className="fa-solid fa-bookmark text-[#B8C6D8]"></i>
                                </div>
                                <span className="text-sm text-[#B8C6D8]">收藏</span>
                            </div>
                        </div>
                    </div>
                    {}
                    <div
                        className="bg-[#2D3748] rounded-xl shadow-sm border border-[#4A5F8B] mb-8">
                        <div className="flex border-b border-[#4A5F8B]">
                            <></>
                            <></>
                            <></>
                        </div>
                        {}
                        <div className="p-6">
                            {}
                            <div
                                className="bg-[#1E2532] rounded-xl p-6 shadow-sm border border-[#4A5F8B] mb-8">
                                <h2 className="text-xl font-bold text-[#F5F7FA] mb-4">创作数据</h2>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={monthlyViewsData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#4A5F8B" />
                                            <XAxis dataKey="date" stroke="#B8C6D8" />
                                            <YAxis stroke="#B8C6D8" />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "#2D3748",
                                                    borderColor: "#4A5F8B",
                                                    borderRadius: "8px"
                                                }}
                                                content={(
                                                    {
                                                        active,
                                                        payload,
                                                        label
                                                    }
                                                ) => {
                                                    if (active && payload && payload.length) {
                                                        const viewsData = payload.find(item => item.dataKey === "views");
                                                        const likesData = payload.find(item => item.dataKey === "likes");

                                                        return (
                                                            <div className="bg-[#2D3748] border border-[#4A5F8B] p-3 rounded-lg">
                                                                <p className="text-[#B8C6D8] font-medium mb-2">{`${label}数据`}</p>
                                                                {viewsData && <p className="text-[#B8C6D8] mb-1">浏览量: {viewsData.value}</p>}
                                                                {likesData && <p className="text-[#B8C6D8]">点赞量: {likesData.value}</p>}
                                                            </div>
                                                        );
                                                    }

                                                    return null;
                                                }} />
                                            <Legend />
                                            <Line
                                                type="monotone"
                                                dataKey="views"
                                                stroke="#4A5F8B"
                                                strokeWidth={2}
                                                dot={false}
                                                activeDot={{
                                                    r: 4,
                                                    stroke: "#4A5F8B",
                                                    strokeWidth: 2,
                                                    fill: "#FFFFFF"
                                                }}
                                                name="浏览量" />
                                            <Line
                                                type="monotone"
                                                dataKey="likes"
                                                stroke="#6B7C93"
                                                strokeWidth={2}
                                                dot={false}
                                                activeDot={{
                                                    r: 4,
                                                    stroke: "#6B7C93",
                                                    strokeWidth: 2,
                                                    fill: "#FFFFFF"
                                                }}
                                                name="点赞量" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            {}
                            <div
                                className="bg-[#1E2532] rounded-xl p-6 shadow-sm border border-[#4A5F8B] mb-8">
                                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            placeholder="搜索作品标题或描述..."
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                            className="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]" />
                                        <i
                                            className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
                                    </div>
                                    <div className="flex space-x-4">
                                        <select
                                            value={visibilityFilter}
                                            onChange={e => setVisibilityFilter(e.target.value)}
                                            className="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
                                            <option value="all">全部可见性</option>
                                            <option value="public">公开</option>
                                            <option value="friends">仅好友可见</option>
                                            <option value="private">私密</option>
                                        </select>
                                        <select
                                            value={formatFilter}
                                            onChange={e => setFormatFilter(e.target.value)}
                                            className="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
                                            <option value="all">全部格式</option>
                                            <option value="raw">RAW</option>
                                            <option value="jpg">JPG</option>
                                        </select>
                                        <select
                                            value={sortBy}
                                            onChange={e => setSortBy(e.target.value)}
                                            className="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
                                            <option value="latest">最新发布</option>
                                            <option value="popular">最受欢迎</option>
                                            <option value="views">最多浏览</option>
                                        </select>
                                    </div>
                                </div>
                                {}
                                <div className="mt-4">
                                    <h4 className="text-sm font-medium text-[#B8C6D8] mb-2">按标签筛选</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {allTags.map(tag => <button
                                            key={tag}
                                            onClick={() => setSelectedTag(tag)}
                                            className={`px-3 py-1 rounded-full text-sm ${selectedTag === tag ? "bg-[#4A5F8B] text-[#F5F7FA]" : "bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B]"} transition-colors`}>
                                            {tag}
                                        </button>)}
                                    </div>
                                </div>
                            </div>
                            {}
                            <div className="mb-8 text-center">
                                <button
                                    onClick={handleUpload}
                                    className="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors inline-flex items-center">
                                    <i className="fa-solid fa-plus mr-2"></i>添加新作品（支持RAW/JPG/视频）
                                                  </button>
                            </div>
                            {}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredPosts.map(post => <motion.div
                                    key={post.id}
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
                                    }}
                                    className="bg-[#1E2532] rounded-xl overflow-hidden border border-[#4A5F8B] transition-all shadow-sm">
                                    {}
                                    <div className="relative">
                                        <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                                        {}
                                        <div
                                            className={`absolute top-3 left-3 px-2 py-1 rounded text-xs ${post.copyrightType === "独家授权" ? "bg-[#4A5F8B] text-[#F5F7FA]" : "bg-[#6B7C93] text-[#F5F7FA]"}`}>
                                            {post.copyrightType}
                                        </div>
                                        {}
                                        <div className="absolute top-3 right-3 flex space-x-2">
                                            <span className="px-2 py-1 bg-[#2D3748]/80 text-[#B8C6D8] text-xs rounded">
                                                {post.format}
                                            </span>
                                            <span className="px-2 py-1 bg-[#2D3748]/80 text-[#B8C6D8] text-xs rounded">
                                                {post.visibility}
                                            </span>
                                        </div>
                                    </div>
                                    {}
                                    <div className="p-4">
                                        {}
                                        <h3 className="text-base font-bold text-[#F5F7FA] mb-2">{post.title}</h3>
                                        <p className="text-sm text-[#B8C6D8] mb-3 line-clamp-2">
                                            {post.description}
                                        </p>
                                        {}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {post.tags.map((tag, index) => <span
                                                key={index}
                                                className="px-2 py-1 bg-[#4A5F8B] text-[#F5F7FA] text-xs rounded">#{tag}
                                            </span>)}
                                        </div>
                                        {}
                                        <div className="flex items-center justify-between mb-4 text-sm text-[#B8C6D8]">
                                            <div className="flex items-center space-x-4">
                                                <span className="flex items-center">
                                                    <i className="fa-solid fa-heart mr-1"></i>
                                                    {post.likes}
                                                </span>
                                                <span className="flex items-center">
                                                    <i className="fa-solid fa-comment mr-1"></i>
                                                    {post.comments}
                                                </span>
                                                <span className="flex items-center">
                                                    <i className="fa-solid fa-eye mr-1"></i>
                                                    {post.views}
                                                </span>
                                            </div>
                                            <span>{post.date}</span>
                                        </div>
                                        {}
                                        <div className="flex justify-between space-x-2">
                                            <Link
                                                to={`/photo/${post.id}`}
                                                className="flex-1 py-2 text-center bg-[#2D3748] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors text-sm border border-[#4A5F8B]">查看详情
                                                                      </Link>
                                            <button
                                                onClick={() => openEditModal(post.id)}
                                                className="px-3 py-2 text-center bg-[#2D3748] text-[#B8C6D8] rounded-lg font-medium hover:border-[#4A5F8B] hover:text-[#F5F7FA] transition-colors text-sm border border-[#4A5F8B]">
                                                <i className="fa-solid fa-edit"></i>
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(post.id)}
                                                className="px-3 py-2 text-center bg-[#2D3748] text-[#B8C6D8] rounded-lg font-medium hover:border-[#4A5F8B] hover:text-[#F5F7FA] transition-colors text-sm border border-[#4A5F8B]">
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                            <button
                                                onClick={() => openCopyrightModal(post.id)}
                                                className="px-3 py-2 text-center bg-gradient-to-r from-[#4A5F8B] to-[#2D3748] text-[#F5F7FA] rounded-lg font-medium hover:from-[#6B7C93] hover:to-[#4A5F8B] transition-colors text-sm border border-[#4A5F8B]">
                                                <i className="fa-solid fa-copyright"></i>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>)}
                            </div>
                            {filteredPosts.length === 0 && <div
                                className="p-8 bg-[#1E2532] rounded-xl border border-[#4A5F8B] text-center mt-8">
                                <div
                                    className="w-16 h-16 bg-[#2D3748] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
                                    <i className="fa-solid fa-image text-2xl"></i>
                                </div>
                                <h3 className="text-lg font-medium text-[#F5F7FA] mb-2">暂无作品</h3>
                                <p className="text-[#B8C6D8] mb-6">点击"添加新作品"开始上传和分享您的摄影作品
                                                    </p>
                                <button
                                    onClick={handleUpload}
                                    className="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors">
                                    <i className="fa-solid fa-plus mr-2"></i>添加新作品
                                                    </button>
                            </div>}
                            {}
                            {filteredPosts.length > 0 && <div className="flex justify-center mt-10">
                                <nav
                                    className="flex items-center space-x-1 bg-[#1E2532] p-2 rounded-lg border border-[#4A5F8B]">
                                    <button
                                        className="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                                        <i className="fa-solid fa-chevron-left text-xs"></i>
                                    </button>
                                    <button
                                        className="px-3 py-2 rounded border border-[#4A5F8B] bg-[#4A5F8B] text-[#F5F7FA]">1
                                                          </button>
                                    <button
                                        className="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                                        <i className="fa-solid fa-chevron-right text-xs"></i>
                                    </button>
                                </nav>
                            </div>}
                        </div>
                    </div>
                    {}
                    <div
                        className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B] mb-8">
                        <h2 className="text-lg font-bold text-[#F5F7FA] mb-6">个人中心</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {}
                            <div className="bg-[#1E2532] rounded-lg p-5 border border-[#4A5F8B]">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-base font-medium text-[#F5F7FA] flex items-center">
                                        <i className="fa-solid fa-video text-[#4A5F8B] mr-2"></i>我的器材库
                                                        </h3>
                                    <Link
                                        to="/profile-center/equipment"
                                        className="text-xs text-[#4A5F8B] hover:text-[#B8C6D8]">查看全部
                                                        </Link>
                                </div>
                                <p className="text-xs text-[#B8C6D8]/70 mb-4">最近浏览：索尼 A7R IV</p>
                                <div className="space-y-3 mb-4">
                                    {recentEquipment.map(
                                        equipment => <div key={equipment.id} className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div
                                                    className="w-8 h-8 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-3">
                                                    <i
                                                        className={`fa-solid ${equipment.type === "camera" ? "fa-camera" : equipment.type === "lens" ? "fa-camera-retro" : "fa-drone"}`}></i>
                                                </div>
                                                <span className="text-sm text-[#B8C6D8]">{equipment.name}</span>
                                            </div>
                                            <i className="fa-solid fa-chevron-right text-xs text-[#4A5F8B]"></i>
                                        </div>
                                    )}
                                </div>
                                <button
                                    className="w-full py-2 text-center bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors text-sm">
                                    <i className="fa-solid fa-plus mr-1"></i>添加器材
                                                  </button>
                            </div>
                            {}
                            <div className="bg-[#1E2532] rounded-lg p-5 border border-[#4A5F8B]">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-base font-medium text-[#F5F7FA] flex items-center">
                                        <i className="fa-solid fa-crown text-[#4A5F8B] mr-2"></i>会员中心
                                                        </h3>
                                    <Link
                                        to="/profile-center/membership"
                                        className="text-xs text-[#4A5F8B] hover:text-[#B8C6D8]">查看全部
                                                        </Link>
                                </div>
                                <p className="text-xs text-[#B8C6D8]/70 mb-4">您当前是 {mockUserData.memberStatus}</p>
                                <div className="bg-[#2D3748] p-3 rounded-lg mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-[#B8C6D8]">会员有效期</span>
                                        <span className="text-xs text-[#4A5F8B]">剩余 {mockUserData.memberDaysLeft}天</span>
                                    </div>
                                    <div className="w-full h-2 bg-[#1E2532] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#4A5F8B]"
                                            style={{
                                                width: `${mockUserData.memberDaysLeft / 365 * 100}%`
                                            }}></div>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        className="flex-1 py-2 text-center bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors text-sm">续费
                                                        </button>
                                    <button
                                        className="flex-1 py-2 text-center bg-gradient-to-r from-[#4A5F8B] to-[#6B7C93] text-[#F5F7FA] rounded-lg font-medium hover:from-[#6B7C93] hover:to-[#4A5F8B] transition-colors text-sm">升级
                                                        </button>
                                </div>
                            </div>
                            {}
                            <div className="bg-[#1E2532] rounded-lg p-5 border border-[#4A5F8B]">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-base font-medium text-[#F5F7FA] flex items-center">
                                        <i className="fa-solid fa-toolbox text-[#4A5F8B] mr-2"></i>快速工具
                                                        </h3>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <Link
                                        to="/profile-center/editor"
                                        className="flex flex-col items-center justify-center p-3 bg-[#2D3748] rounded-lg hover:bg-[#4A5F8B] transition-colors">
                                        <i className="fa-solid fa-palette text-xl text-[#B8C6D8] mb-2"></i>
                                        <span className="text-sm text-[#B8C6D8]">后期工具</span>
                                    </Link>
                                    <Link
                                        to="/profile-center/photo-locations"
                                        className="flex flex-col items-center justify-center p-3 bg-[#2D3748] rounded-lg hover:bg-[#4A5F8B] transition-colors">
                                        <i className="fa-solid fa-map-marker-alt text-xl text-[#B8C6D8] mb-2"></i>
                                        <span className="text-sm text-[#B8C6D8]">拍摄地点</span>
                                    </Link>
                                    <Link
                                        to="/profile-center/events"
                                        className="flex flex-col items-center justify-center p-3 bg-[#2D3748] rounded-lg hover:bg-[#4A5F8B] transition-colors">
                                        <i className="fa-solid fa-flag text-xl text-[#B8C6D8] mb-2"></i>
                                        <span className="text-sm text-[#B8C6D8]">摄影活动</span>
                                    </Link>
                                    <Link
                                        to="/profile-center/notifications"
                                        className="flex flex-col items-center justify-center p-3 bg-[#2D3748] rounded-lg hover:bg-[#4A5F8B] transition-colors">
                                        <i className="fa-solid fa-bell text-xl text-[#B8C6D8] mb-2"></i>
                                        <span className="text-sm text-[#B8C6D8]">我的通知</span>
                                    </Link>
                                </div>
                                <button
                                    className="w-full py-2 text-center bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors text-sm">
                                    <i className="fa-solid fa-cog mr-1"></i>更多设置
                                                  </button>
                            </div>
                        </div>
                    </div>
                    {}
                    <div
                        className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B] mb-8">
                        <h2 className="text-lg font-bold text-[#F5F7FA] mb-6">功能导航</h2>
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {sidebarItems.map(item => (
                  <Link
                    key={item.id}
                    to={item.id === "个人作品" ? "/profile-center" : 
                         item.id === "拍摄地点" ? "/profile-center/photo-locations" : 
                         item.id === "器材库" ? "/profile-center/equipment" : 
                         item.id === "素材库" ? "/profile-center/materials" : 
                         item.id === "我的活动" ? "/profile-center/events" : 
                         item.id === "我的赛事" ? "/profile-center/contests" : 
                         item.id === "后期工具" ? "/profile-center/editor" : 
                         item.id === "会员中心" ? "/profile-center/membership" : 
                         item.id === "我的订单" ? "/profile-center/orders" : 
                         item.id === "我的通知" ? "/profile-center/notifications" : 
                         item.id === "设置" ? "/profile-center/settings" : 
                         "/profile-center"}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-colors ${
                      item.id === "个人作品" 
                        ? "bg-[#4A5F8B] text-[#F5F7FA] border-[#4A5F8B]" 
                        : "bg-[#1E2532] text-[#B8C6D8] border-[#4A5F8B] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                        item.id === "个人作品" 
                          ? "bg-white/20 text-white" 
                          : "bg-[#4A5F8B]/20 text-[#4A5F8B]"
                      }`}
                    >
                      <i className={`fa-solid ${item.icon}`}></i>
                    </div>
                    <span className={`text-xs ${
                      item.id === "个人作品" ? "text-white" : "text-[#B8C6D8]"
                    }`}>{item.text}</span>
                  </Link>
                ))}
             </div>
                    </div>
                </div>
            </motion.div>
            {}
            {showUploadModal && <div
                className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                <motion.div
                    initial={{
                        opacity: 0,
                        y: 20
                    }}
                    animate={{
                        opacity: 1,
                        y: 0
                    }}
                    className="bg-[#2D3748] rounded-xl border border-[#4A5F8B] w-full max-w-2xl">
                    <div className="p-6 border-b border-[#4A5F8B]">
                        <h2 className="text-xl font-bold text-[#F5F7FA]">上传新作品</h2>
                    </div>
                    <div className="p-6">
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-[#B8C6D8] mb-2">选择图片</label>
                            <div
                                className="flex flex-col items-center justify-center border-2 border-dashed border-[#4A5F8B] rounded-lg p-6 cursor-pointer hover:bg-[#1E2532] transition-colors">
                                {selectedFile ? <div className="w-full max-w-md">
                                    <img
                                        src={URL.createObjectURL(selectedFile)}
                                        alt="预览"
                                        className="w-full h-auto rounded-lg object-cover" />
                                    <p className="text-sm text-[#B8C6D8] mt-2 text-center">
                                        {selectedFile.name}({(selectedFile.size / 1024).toFixed(2)}KB)
                                                              </p>
                                </div> : <>
                                    <i className="fa-solid fa-cloud-arrow-up text-4xl text-[#4A5F8B] mb-3"></i>
                                    <p className="text-[#B8C6D8] mb-2">点击或拖拽文件到此处上传</p>
                                    <p className="text-xs text-[#6B7C93]">支持 JPG、RAW、PNG、TIFF 格式，最大 20MB</p>
                                </>}
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#B8C6D8] mb-1">作品标题 *</label>
                                <input
                                    type="text"
                                    value={newPostTitle}
                                    onChange={e => setNewPostTitle(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                                    placeholder="输入作品标题" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#B8C6D8] mb-1">作品描述</label>
                                <textarea
                                    value={newPostDescription}
                                    onChange={e => setNewPostDescription(e.target.value)}
                                    className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all resize-none h-32"
                                    placeholder="描述作品的创作理念、拍摄过程或技术细节" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#B8C6D8] mb-1">标签</label>
                                    <input
                                        type="text"
                                        value={newPostTags}
                                        onChange={e => setNewPostTags(e.target.value)}
                                        className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                                        placeholder="多个标签用逗号分隔" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#B8C6D8] mb-1">可见性</label>
                                    <select
                                        value={newPostVisibility}
                                        onChange={e => setNewPostVisibility(e.target.value)}
                                        className="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
                                        <option value="公开">公开</option>
                                        <option value="仅好友可见">仅好友可见</option>
                                        <option value="私密">私密</option>
                                    </select>
                                </div>
                            </div>
                            {uploading && <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm text-[#B8C6D8]">上传进度</span>
                                    <span className="text-sm text-[#4A5F8B]">{uploadProgress}%</span>
                                </div>
                                <div className="w-full h-2 bg-[#1E2532] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#4A5F8B]"
                                        style={{
                                            width: `${uploadProgress}%`
                                        }}></div>
                                </div>
                            </div>}
                        </div>
                    </div>
                    <div className="p-6 border-t border-[#4A5F8B] flex justify-end space-x-4">
                        <button
                            onClick={handleCancelUpload}
                            disabled={uploading}
                            className={`px-6 py-2 bg-[#1E2532] border border-[#4A5F8B] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#2D3748] transition-colors ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}>取消
                                          </button>
                        <button
                            onClick={handleSubmitUpload}
                            disabled={uploading || !selectedFile || !newPostTitle.trim()}
                            className={`px-6 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors ${uploading || !selectedFile || !newPostTitle.trim() ? "opacity-50 cursor-not-allowed" : ""}`}>
                            {uploading ? <>
                                <i className="fa-solid fa-spinner fa-spin mr-2"></i>上传中...
                                                  </> : "上传作品"}
                        </button>
                    </div>
                </motion.div>
            </div>}
        </div>
    );
};

export default ProfileCenter;