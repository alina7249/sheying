// 菜单配置数据 - 供多个组件复用
export const profileMenuItems = [
  { id: 'center', icon: 'fa-user', text: '个人中心', link: '/profile-center' },
  { id: 'locations', icon: 'fa-map-marker-alt', text: '我的拍摄地点', link: '/profile-center/photo-locations' },
  { id: 'equipment', icon: 'fa-video', text: '我的器材库', link: '/profile-center/equipment' },
  { id: 'materials', icon: 'fa-microchip', text: '我的素材库', link: '/profile-center/materials' },
  { id: 'events', icon: 'fa-flag', text: '摄影活动', link: '/profile-center/events' },
  { id: 'contests', icon: 'fa-trophy', text: '我的赛事', link: '/profile-center/contests' },
  { id: 'tools', icon: 'fa-palette', text: '后期工具', link: '/profile-center/editor' },
  { id: 'membership', icon: 'fa-crown', text: '会员中心', link: '/profile-center/membership' },
  { id: 'orders', icon: 'fa-shopping-cart', text: '我的订单', link: '/profile-center/orders' },
  { id: 'notifications', icon: 'fa-bell', text: '我的消息', link: '/profile-center/notifications' },
  { id: 'settings', icon: 'fa-cog', text: '设置', link: '/profile-center/settings' },
];