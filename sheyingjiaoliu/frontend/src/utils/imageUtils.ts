export const imageService = {
  getImageUrl: (seed: number, width: number = 800, height: number = 600): string => {
    return `https://picsum.photos/seed/${seed}/${width}/${height}`;
  },
  
  getAvatarUrl: (seed: number): string => {
    return `https://picsum.photos/seed/${seed}/400/400`;
  },
  
  getHeroUrl: (seed: number): string => {
    return `https://picsum.photos/seed/${seed}/1280/720`;
  },
  
  getGrayscaleUrl: (seed: number, width: number = 800, height: number = 600): string => {
    return `https://picsum.photos/seed/${seed}/${width}/${height}?grayscale`;
  },
  
  getBlurUrl: (seed: number, width: number = 10, height: number = 10): string => {
    return `https://picsum.photos/seed/${seed}/${width}/${height}?blur=10`;
  },
};

export const imagePresets = {
  hero: {
    width: 1280,
    height: 720,
  },
  card: {
    width: 800,
    height: 600,
  },
  portrait: {
    width: 600,
    height: 800,
  },
  thumbnail: {
    width: 400,
    height: 400,
  },
  avatar: {
    width: 400,
    height: 400,
  },
};

export const bannerImages = [
  { seed: 324, title: '极简黑白建筑摄影展' },
  { seed: 326, title: '胶片摄影的永恒魅力' },
  { seed: 328, title: '暗调摄影的情绪表达' },
];

export const photographerAvatars = [
  { seed: 209, name: '极简摄影师林风' },
  { seed: 211, name: '胶片摄影师安娜' },
  { seed: 213, name: '情绪摄影师李明' },
  { seed: 215, name: '静物摄影师王静' },
  { seed: 217, name: '手机摄影师张强' },
  { seed: 219, name: '纪实摄影师陈默' },
];

export const equipmentImages = {
  cameras: [
    { seed: 101, name: '索尼 A7M4' },
    { seed: 102, name: '佳能 EOS R5' },
    { seed: 103, name: '尼康 Z8' },
    { seed: 104, name: '富士 X-T5' },
    { seed: 105, name: '徕卡 M11' },
  ],
  lenses: [
    { seed: 111, name: '索尼 24-70mm' },
    { seed: 112, name: '佳能 70-200mm' },
    { seed: 113, name: '尼康 35mm' },
    { seed: 114, name: '索尼 85mm' },
  ],
  accessories: [
    { seed: 117, name: '捷信碳纤维三脚架' },
  ],
};

export const inspirationImages = [
  { seed: 223, title: '黑白摄影的光影艺术' },
  { seed: 224, title: '胶片摄影的复兴与现代应用' },
  { seed: 225, title: '极简主义摄影的构图法则' },
  { seed: 226, title: '暗房技术与现代数字暗房' },
];

export const artworkImages = [
  { seed: 208, title: '黑白光影', style: '极简主义' },
  { seed: 210, title: '胶片质感人像', style: '胶片' },
  { seed: 212, title: '暗调氛围', style: '暗调' },
  { seed: 214, title: '极简静物', style: '极简' },
  { seed: 216, title: '城市几何', style: '城市' },
  { seed: 218, title: '黑白纪实', style: '黑白' },
];

export const getRandomImage = (category: 'artwork' | 'equipment' | 'avatar'): string => {
  const seed = Math.floor(Math.random() * 300) + 100;
  
  switch (category) {
    case 'artwork':
      return imageService.getImageUrl(seed, 800, 600);
    case 'equipment':
      return imageService.getImageUrl(seed, 800, 600);
    case 'avatar':
      return imageService.getAvatarUrl(seed);
    default:
      return imageService.getImageUrl(seed);
  }
};

export const preloadImages = (urls: string[]): Promise<void[]> => {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = reject;
          img.src = url;
        })
    )
  );
};

export const getImageWithFallback = (
  primaryUrl: string,
  fallbackUrl: string
): string => {
  return primaryUrl;
};

export const imageOptimization = {
  getSrcSet: (baseUrl: string, sizes: number[] = [400, 800, 1200]) => {
    return sizes
      .map((size) => {
        const url = new URL(baseUrl);
        return `${url.origin}${url.pathname.replace(/\/\d+\/\d+/, `/400/${size}`)} ${size}w`;
      })
      .join(', ');
  },
  
  getResponsiveUrl: (baseUrl: string, viewportWidth: number): string => {
    const url = new URL(baseUrl);
    const height = Math.round((viewportWidth * 9) / 16);
    return `${url.origin}${url.pathname.replace(/\/\d+\/\d+/, `/${viewportWidth}/${height}`)}`;
  },
};
