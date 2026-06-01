#!/usr/bin/env python3
"""
品牌图片生成器
使用Pillow创建专业品牌视觉资源
"""
import os
from PIL import Image, ImageDraw, ImageFont
import colorsys

# 输出目录
OUTPUT_DIR = "/workspace/public/branded"

# 4:3 比例 (landscape_4_3)
WIDTH = 1280
HEIGHT = 960

# 暗色主题配色
COLORS = {
    'dark': (26, 26, 26),  # 深炭灰
    'charcoal': (33, 33, 33),
    'gold': (212, 175, 55),  # 金色
    'white': (255, 255, 255),
    'gray': (128, 128, 128),
    'light_gray': (200, 200, 200),
    'accent_blue': (70, 130, 180),
    'warm_white': (245, 245, 240),
}

def create_gradient_background(width, height, color1, color2, vertical=True):
    """创建渐变背景"""
    image = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(image)

    for i in range(height if vertical else width):
        ratio = i / (height - 1 if vertical else width - 1)
        r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
        g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
        b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
        if vertical:
            draw.line([(0, i), (width, i)], fill=(r, g, b))
        else:
            draw.line([(i, 0), (i, height)], fill=(r, g, b))

    return image

def add_subtle_noise(image, intensity=5):
    """添加微妙噪点"""
    from PIL import ImageFilter
    import random

    # 创建噪点层
    noise = Image.new('RGB', image.size)
    pixels = noise.load()
    img_pixels = image.load()

    for y in range(image.height):
        for x in range(image.width):
            noise_val = random.randint(-intensity, intensity)
            r = max(0, min(255, img_pixels[x, y][0] + noise_val))
            g = max(0, min(255, img_pixels[x, y][1] + noise_val))
            b = max(0, min(255, img_pixels[x, y][2] + noise_val))
            pixels[x, y] = (r, g, b)

    return noise

def draw_centered_text(draw, text, y_position, font_size, color, max_width=None):
    """绘制居中文字"""
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except:
        font = ImageFont.load_default()

    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]

    if max_width and text_width > max_width:
        # 缩小字体以适应
        scale = max_width / text_width
        font_size = int(font_size * scale)
        try:
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
        except:
            font = ImageFont.load_default()
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]

    x = (WIDTH - text_width) // 2
    draw.text((x, y_position), text, font=font, fill=color)
    return x, y_position, text_width, bbox[3] - bbox[1]

def create_brand_kit_cover():
    """品牌封面.jpg"""
    # 渐变背景
    img = create_gradient_background(WIDTH, HEIGHT, COLORS['dark'], COLORS['charcoal'])

    # 添加微妙纹理
    noise = add_subtle_noise(img, intensity=3)

    draw = ImageDraw.Draw(img)

    # 顶部装饰线
    draw.rectangle([0, 0, WIDTH, 3], fill=COLORS['gold'])

    # 中心区域 - 品牌标志占位
    center_x, center_y = WIDTH // 2, HEIGHT // 2

    # 大型圆环装饰
    draw.ellipse([center_x - 200, center_y - 200, center_x + 200, center_y + 200],
                 outline=COLORS['gold'], width=3)
    draw.ellipse([center_x - 180, center_y - 180, center_x + 180, center_y + 180],
                 outline=COLORS['gold'], width=1)

    # 中心图标占位
    draw.rectangle([center_x - 60, center_y - 60, center_x + 60, center_y + 60],
                   fill=COLORS['gold'], outline=COLORS['warm_white'], width=2)

    # 品牌名称
    draw_centered_text(draw, "PHOTO PLATFORM", HEIGHT // 2 - 280, 48, COLORS['white'])
    draw_centered_text(draw, "品牌形象", HEIGHT // 2 + 280, 24, COLORS['light_gray'])

    # 底部信息
    draw_centered_text(draw, "BRAND GUIDELINES 2026", HEIGHT - 60, 18, COLORS['gray'])

    # 保存
    output_path = os.path.join(OUTPUT_DIR, "品牌封面.jpg")
    img.save(output_path, 'JPEG', quality=95)
    print(f"✓ {output_path}")

def create_lightroom_preset():
    """Lightroom预设.jpg"""
    img = create_gradient_background(WIDTH, HEIGHT, COLORS['dark'], COLORS['charcoal'])
    draw = ImageDraw.Draw(img)

    # 顶部金色装饰
    draw.rectangle([0, 0, WIDTH, 3], fill=COLORS['gold'])

    # 标题
    draw_centered_text(draw, "LIGHTROOM 预设", 80, 42, COLORS['white'])
    draw_centered_text(draw, "PROFESSIONAL COLOR GRADING", 130, 16, COLORS['gray'])

    # 预设网格 - 2x3布局
    grid_margin = 120
    grid_width = WIDTH - 2 * grid_margin
    grid_height = HEIGHT - 280
    cell_width = grid_width // 3
    cell_height = grid_height // 2

    presets = [
        ("暗调人像", "DRAMATIC"),
        ("胶片质感", "FILM"),
        ("极致黑白", "B&W"),
        ("暖色夕阳", "WARM"),
        ("冷调城市", "COOL"),
        ("自然风光", "NATURE"),
    ]

    for i, (name, subtitle) in enumerate(presets):
        row = i // 3
        col = i % 3
        x = grid_margin + col * cell_width + 20
        y = 180 + row * cell_height + 20
        w = cell_width - 40
        h = cell_height - 40

        # 预设卡片背景
        card_color = COLORS['charcoal']
        draw.rounded_rectangle([x, y, x + w, y + h], radius=10,
                               fill=card_color, outline=COLORS['gold'], width=1)

        # 预设名称
        draw_centered_text(draw, name, y + h // 2 - 20, 20, COLORS['white'])
        draw_centered_text(draw, subtitle, y + h // 2 + 10, 14, COLORS['gold'])

    # 底部说明
    draw_centered_text(draw, "点击预览 · 一键应用 · 高质量输出", HEIGHT - 80, 16, COLORS['gray'])

    output_path = os.path.join(OUTPUT_DIR, "Lightroom预设.jpg")
    img.save(output_path, 'JPEG', quality=95)
    print(f"✓ {output_path}")

def create_membership_privilege():
    """会员特权.jpg"""
    img = create_gradient_background(WIDTH, HEIGHT, COLORS['dark'], (20, 20, 20))
    draw = ImageDraw.Draw(img)

    # 金色装饰边框
    draw.rectangle([0, 0, WIDTH, 3], fill=COLORS['gold'])
    draw.rectangle([0, HEIGHT - 3, WIDTH, HEIGHT], fill=COLORS['gold'])

    # 中心VIP卡
    card_width, card_height = 500, 300
    card_x = (WIDTH - card_width) // 2
    card_y = (HEIGHT - card_height) // 2

    # 卡片背景渐变效果
    for i in range(card_height):
        ratio = i / card_height
        r = int(40 * (1 - ratio) + 25 * ratio)
        g = int(40 * (1 - ratio) + 25 * ratio)
        b = int(50 * (1 - ratio) + 40 * ratio)
        draw.line([(card_x, card_y + i), (card_x + card_width, card_y + i)], fill=(r, g, b))

    # 卡片边框
    draw.rectangle([card_x, card_y, card_x + card_width, card_y + card_height],
                   outline=COLORS['gold'], width=3)

    # VIP标志
    vip_x = card_x + 50
    vip_y = card_y + 50
    draw.ellipse([vip_x, vip_y, vip_x + 80, vip_y + 80],
                 fill=COLORS['gold'], outline=COLORS['warm_white'], width=2)
    draw_centered_text(draw, "VIP", vip_y + 25, 24, COLORS['dark'])

    # 卡片文字
    draw.text((card_x + 150, card_y + 50), "PREMIUM MEMBER", font=None, fill=COLORS['white'])
    draw_centered_text(draw, "专属摄影资源库", card_y + 100, 28, COLORS['gold'])
    draw_centered_text(draw, "优先参与线下活动", card_y + 160, 18, COLORS['light_gray'])

    # 标题
    draw_centered_text(draw, "会员特权", 80, 48, COLORS['white'])
    draw_centered_text(draw, "EXCLUSIVE BENEFITS", 130, 18, COLORS['gold'])

    # 底部特权列表
    privileges = ["专属预设", "无限云存储", "专家课程", "活动优先"]
    priv_width = WIDTH // 5
    for i, priv in enumerate(privileges):
        x = (i + 0.5) * priv_width
        y = HEIGHT - 100
        # 小圆点
        draw.ellipse([x - 5, y, x + 5, y + 10], fill=COLORS['gold'])
        draw_centered_text(draw, priv, y + 20, 16, COLORS['light_gray'])

    output_path = os.path.join(OUTPUT_DIR, "会员特权.jpg")
    img.save(output_path, 'JPEG', quality=95)
    print(f"✓ {output_path}")

def create_photography_contest():
    """摄影大赛.jpg"""
    img = create_gradient_background(WIDTH, HEIGHT, COLORS['dark'], (15, 15, 15))
    draw = ImageDraw.Draw(img)

    # 顶部金色装饰
    draw.rectangle([0, 0, WIDTH, 4], fill=COLORS['gold'])

    # 标题
    draw_centered_text(draw, "摄影大赛", 60, 52, COLORS['white'])
    draw_centered_text(draw, "PHOTOGRAPHY COMPETITION 2026", 120, 20, COLORS['gold'])

    # 中心奖杯/奖牌区域
    center_x = WIDTH // 2
    start_y = 180

    # 冠军位置
    draw.ellipse([center_x - 80, start_y, center_x + 80, start_y + 160],
                 fill=COLORS['gold'], outline=COLORS['warm_white'], width=3)
    draw_centered_text(draw, "1", start_y + 50, 48, COLORS['dark'])
    draw_centered_text(draw, "冠军", start_y + 130, 20, COLORS['white'])

    # 亚军位置
    left_x = center_x - 250
    draw.ellipse([left_x - 60, start_y + 40, left_x + 60, start_y + 200],
                 fill=COLORS['silver'] if False else (192, 192, 192),
                 outline=COLORS['gray'], width=2)
    draw_centered_text(draw, "2", start_y + 90, 36, COLORS['dark'])
    draw_centered_text(draw, "亚军", start_y + 170, 16, COLORS['light_gray'])

    # 季军位置
    right_x = center_x + 250
    draw.ellipse([right_x - 60, start_y + 40, right_x + 60, start_y + 200],
                 fill=(205, 127, 50), outline=COLORS['gray'], width=2)
    draw_centered_text(draw, "3", start_y + 90, 36, COLORS['dark'])
    draw_centered_text(draw, "季军", start_y + 170, 16, COLORS['light_gray'])

    # 大赛信息区域
    info_y = 450
    draw.rectangle([100, info_y, WIDTH - 100, info_y + 200],
                   fill=(40, 40, 40), outline=COLORS['gold'], width=1)

    draw_centered_text(draw, "主题：光影故事", info_y + 40, 24, COLORS['white'])
    draw_centered_text(draw, "投稿时间：2026.03.01 - 2026.05.31", info_y + 100, 18, COLORS['gray'])
    draw_centered_text(draw, "奖金池：¥100,000", info_y + 150, 28, COLORS['gold'])

    # 底部CTA
    draw_centered_text(draw, "立即投稿 · WINNING PRIZE", HEIGHT - 60, 20, COLORS['white'])

    output_path = os.path.join(OUTPUT_DIR, "摄影大赛.jpg")
    img.save(output_path, 'JPEG', quality=95)
    print(f"✓ {output_path}")

def create_offline_event():
    """线下活动.jpg"""
    img = create_gradient_background(WIDTH, HEIGHT, (30, 35, 40), COLORS['dark'])
    draw = ImageDraw.Draw(img)

    # 顶部装饰
    draw.rectangle([0, 0, WIDTH, 3], fill=COLORS['gold'])

    # 标题
    draw_centered_text(draw, "线下活动", 60, 48, COLORS['white'])
    draw_centered_text(draw, "OFFLINE EVENTS & WORKSHOPS", 115, 18, COLORS['gray'])

    # 活动卡片区域
    card_width = 350
    card_height = 400
    margin = 60
    gap = 40

    events = [
        ("外拍实战", "城市风光探索", "03.15", "北京"),
        ("人像工作坊", "棚拍与布光技巧", "03.22", "上海"),
        ("风光讲座", "后期调色思路", "04.05", "线上"),
    ]

    start_x = (WIDTH - (3 * card_width + 2 * gap)) // 2
    y = 160

    for i, (title, desc, date, location) in enumerate(events):
        x = start_x + i * (card_width + gap)

        # 卡片背景
        draw.rounded_rectangle([x, y, x + card_width, y + card_height],
                              radius=8, fill=(45, 45, 45), outline=COLORS['gold'], width=1)

        # 卡片顶部装饰
        draw.rectangle([x, y, x + card_width, y + 80], fill=(50, 50, 50))
        draw.rounded_rectangle([x, y, x + card_width, y + 80], radius=8,
                              fill=(50, 50, 50))

        # 活动类型标签
        label_width = 120
        draw.rounded_rectangle([x + card_width - label_width - 20, y + 20,
                               x + card_width - 20, y + 60], radius=4,
                              fill=COLORS['gold'])
        draw_centered_text(draw, "WORKSHOP", y + 28, 14, COLORS['dark'])

        # 活动信息
        draw_centered_text(draw, title, y + 120, 28, COLORS['white'])
        draw_centered_text(draw, desc, y + 170, 16, COLORS['gray'])
        draw_centered_text(draw, date, y + 280, 32, COLORS['gold'])
        draw_centered_text(draw, location, y + 330, 16, COLORS['light_gray'])

    # 底部信息
    draw_centered_text(draw, "摄影师的线下聚会 · 面对面交流 · 实操练习",
                      HEIGHT - 60, 16, COLORS['gray'])

    output_path = os.path.join(OUTPUT_DIR, "线下活动.jpg")
    img.save(output_path, 'JPEG', quality=95)
    print(f"✓ {output_path}")

def create_community_group():
    """群组社区.jpg"""
    img = create_gradient_background(WIDTH, HEIGHT, COLORS['dark'], COLORS['charcoal'])
    draw = ImageDraw.Draw(img)

    # 顶部金色装饰
    draw.rectangle([0, 0, WIDTH, 3], fill=COLORS['gold'])

    # 标题
    draw_centered_text(draw, "群组社区", 60, 48, COLORS['white'])
    draw_centered_text(draw, "CREATIVE COMMUNITY", 115, 18, COLORS['gray'])

    # 用户头像网格
    grid_margin = 120
    grid_width = WIDTH - 2 * grid_margin
    avatar_size = 100
    gap = 30

    # 计算网格布局
    avatars_per_row = (grid_width + gap) // (avatar_size + gap)
    start_x = (WIDTH - avatars_per_row * avatar_size - (avatars_per_row - 1) * gap) // 2

    # 生成模拟用户头像
    users = [
        ("极简风", "Minimalist"),
        ("胶片控", "Film Lover"),
        ("人像师", "Portrait"),
        ("风光党", "Landscape"),
        ("街拍客", "Street"),
        ("静物家", "Still Life"),
        ("黑白迷", "B&W Art"),
        ("后期师", "Editor"),
    ]

    row = 0
    col = 0
    for username, subtitle in users:
        x = start_x + col * (avatar_size + gap)
        y = 180 + row * (avatar_size + gap + 30)

        # 头像圆形背景
        draw.ellipse([x, y, x + avatar_size, y + avatar_size],
                    fill=(60, 60, 60), outline=COLORS['gold'], width=1)

        # 模拟头像内容（用渐变圆代替）
        inner_x = x + 20
        inner_y = y + 20
        inner_size = avatar_size - 40
        hue = (row * 4 + col) / 8  # 不同的色调
        color = colorsys.hsv_to_rgb(hue, 0.3, 0.4)
        color_rgb = tuple(int(c * 255) for c in color)
        draw.ellipse([inner_x, inner_y, inner_x + inner_size, inner_y + inner_size],
                    fill=color_rgb)

        # 用户名
        draw_centered_text(draw, username, y + avatar_size + 10, 14, COLORS['white'])
        draw_centered_text(draw, subtitle, y + avatar_size + 30, 10, COLORS['gray'])

        col += 1
        if col >= avatars_per_row:
            col = 0
            row += 1

    # 底部社区统计
    stats_y = HEIGHT - 100
    draw_centered_text(draw, "12,580 摄影师 · 856 作品分享 · 234 在线讨论",
                      stats_y, 18, COLORS['gold'])

    # 底部标语
    draw_centered_text(draw, "JOIN THE CREATIVE ECOSYSTEM", HEIGHT - 50, 16, COLORS['gray'])

    output_path = os.path.join(OUTPUT_DIR, "群组社区.jpg")
    img.save(output_path, 'JPEG', quality=95)
    print(f"✓ {output_path}")

def main():
    """主函数"""
    print("开始生成品牌图片...")
    print(f"输出目录: {OUTPUT_DIR}\n")

    create_brand_kit_cover()
    create_lightroom_preset()
    create_membership_privilege()
    create_photography_contest()
    create_offline_event()
    create_community_group()

    print("\n所有品牌图片生成完成！")

if __name__ == "__main__":
    main()
