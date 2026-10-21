#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generate_icons.py
Генератор полного комплекта иконок и Splash-заставок для Android (Capacitor)
и магазинов приложений (Google Play, RuStore) из эталонного арта.
"""

import os
import shutil
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SOURCE_PATH = r"C:/Users/900/.gemini/antigravity/brain/8fc01549-f1c9-45dd-aabb-11ef65d21d9e/.user_uploaded/media_1792596518863_1deaf289.jpg"
WORKSPACE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RES_DIR = os.path.join(WORKSPACE_DIR, "android", "app", "src", "main", "res")
DIST_STORE = os.path.join(WORKSPACE_DIR, "dist_store")
ASSETS_IMG = os.path.join(WORKSPACE_DIR, "assets", "images")

# Базовый цвет фона пергамента
BG_COLOR = (250, 246, 238)  # #FAF6EE
BG_HEX = "#FAF6EE"

def extract_circular_badge(img):
    """
    Вырезает круглый медальон с субпиксельным анти-алиасингом альфа-канала.
    Центр круга (511, 511), внешний радиус зелёной каймы: ~456 px.
    """
    img = img.convert("RGBA")
    w, h = img.size
    cx, cy = 511.0, 511.0
    r_outer = 456.0

    # Создаём сетку координат
    y, x = np.ogrid[:h, :w]
    dist = np.sqrt((x - cx) ** 2 + (y - cy) ** 2)

    # Анти-алиасинг на границе r_outer
    # dist <= r_outer - 1.0 -> 1.0
    # dist >= r_outer + 1.0 -> 0.0
    # переход 2 пикселя
    alpha = np.clip((r_outer + 1.0 - dist) / 2.0, 0.0, 1.0) * 255.0
    alpha = alpha.astype(np.uint8)

    arr = np.array(img)
    arr[:, :, 3] = alpha

    # Обрезаем до точного квадрата по радиусу r_outer
    crop_box = (
        int(cx - r_outer - 2),
        int(cy - r_outer - 2),
        int(cx + r_outer + 3),
        int(cy + r_outer + 3)
    )
    badge = Image.fromarray(arr).crop(crop_box)
    return badge

def create_store_icon_512(badge):
    """
    Создаёт иконку 512x512 для Google Play и RuStore.
    Медальон масштабируется до 472x472 (занимает ~92% холста),
    фон заполняется тёплым пергаментом #FAF6EE.
    При наложении системной скругленной маски магазина углы мягко срежутся,
    а сам круглый медальон останется 100% нетронутым.
    """
    canvas = Image.new("RGBA", (512, 512), BG_COLOR + (255,))
    badge_scaled = badge.resize((472, 472), Image.Resampling.LANCZOS)
    offset = ((512 - 472) // 2, (512 - 472) // 2)
    canvas.paste(badge_scaled, offset, badge_scaled)
    return canvas.convert("RGB")

def create_adaptive_foreground(badge, canvas_size):
    """
    Создаёт ic_launcher_foreground.png для адаптивных иконок Android.
    Стандарт Android:
    canvas_size = 108dp (108, 162, 216, 324, 432 px).
    Маска лаунчера = 72dp (~66.6% от холста).
    Безопасная зона = 66dp (~61% от холста).
    Масштабируем круглый медальон до ~66% от размера холста,
    чтобы в любом лаунчере (круг, squircle, капля) он был идеально виден.
    """
    canvas = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    target_badge_size = int(round(canvas_size * 0.68))
    badge_scaled = badge.resize((target_badge_size, target_badge_size), Image.Resampling.LANCZOS)
    offset = ((canvas_size - target_badge_size) // 2, (canvas_size - target_badge_size) // 2)
    canvas.paste(badge_scaled, offset, badge_scaled)
    return canvas

def create_legacy_icon(badge, size, is_round=False):
    """
    Создаёт обычные иконки для старых версий Android (ic_launcher, ic_launcher_round).
    """
    if is_round:
        canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        target_size = int(round(size * 0.94))
        badge_scaled = badge.resize((target_size, target_size), Image.Resampling.LANCZOS)
        offset = ((size - target_size) // 2, (size - target_size) // 2)
        canvas.paste(badge_scaled, offset, badge_scaled)
        return canvas
    else:
        # Скругленный квадрат (squircle) с фоном пергамента
        canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        mask = Image.new("L", (size, size), 0)
        draw = ImageDraw.Draw(mask)
        corner_r = int(round(size * 0.22))
        draw.rounded_rectangle([(0, 0), (size - 1, size - 1)], radius=corner_r, fill=255)
        
        bg = Image.new("RGBA", (size, size), BG_COLOR + (255,))
        target_size = int(round(size * 0.88))
        badge_scaled = badge.resize((target_size, target_size), Image.Resampling.LANCZOS)
        offset = ((size - target_size) // 2, (size - target_size) // 2)
        bg.paste(badge_scaled, offset, badge_scaled)
        
        canvas.paste(bg, (0, 0), mask)
        return canvas

def create_splash(badge, w, h):
    """
    Создаёт экран заставки Splash Screen на пергаментном фоне с аккуратным
    центрированным медальоном по центру.
    """
    canvas = Image.new("RGBA", (w, h), BG_COLOR + (255,))
    min_dim = min(w, h)
    badge_size = int(round(min_dim * 0.48))  # 48% от меньшей стороны
    badge_size = max(badge_size, 160)
    badge_scaled = badge.resize((badge_size, badge_size), Image.Resampling.LANCZOS)
    offset = ((w - badge_size) // 2, (h - badge_size) // 2)
    canvas.paste(badge_scaled, offset, badge_scaled)
    return canvas.convert("RGB")

def main():
    print("=== Генерация иконок и Splash-заставок для 'Истории природы' ===")
    
    if not os.path.exists(SOURCE_PATH):
        raise FileNotFoundError(f"Исходный файл не найден: {SOURCE_PATH}")
    
    os.makedirs(DIST_STORE, exist_ok=True)
    os.makedirs(ASSETS_IMG, exist_ok=True)
    
    # Копируем эталонный исходник в проект
    shutil.copyfile(SOURCE_PATH, os.path.join(ASSETS_IMG, "app_icon_source.jpg"))
    print("[1/5] Исходник сохранён в assets/images/app_icon_source.jpg")
    
    src_img = Image.open(SOURCE_PATH)
    badge = extract_circular_badge(src_img)
    badge.save(os.path.join(DIST_STORE, "icon_badge_transparent.png"))
    print(f"[2/5] Медальон успешно вырезан с анти-алиасингом: {badge.size}")
    
    # 1. Store Icons (512x512)
    store_icon = create_store_icon_512(badge)
    store_icon.save(os.path.join(DIST_STORE, "store_icon_512.png"), format="PNG")
    store_icon.save(os.path.join(ASSETS_IMG, "icon-512.png"), format="PNG")
    
    # Web icons & favicon
    icon_192 = store_icon.resize((192, 192), Image.Resampling.LANCZOS)
    icon_192.save(os.path.join(ASSETS_IMG, "icon-192.png"), format="PNG")
    
    favicon = store_icon.resize((64, 64), Image.Resampling.LANCZOS)
    favicon.save(os.path.join(ASSETS_IMG, "favicon.png"), format="PNG")
    print("[3/5] Иконки для магазинов и веб-версии созданы (512px, 192px, 64px)")
    
    # 2. Android Mipmap Adaptive Icons
    mipmap_configs = [
        ("mipmap-mdpi", 108, 48),
        ("mipmap-hdpi", 162, 72),
        ("mipmap-xhdpi", 216, 96),
        ("mipmap-xxhdpi", 324, 144),
        ("mipmap-xxxhdpi", 432, 192),
    ]
    
    for folder, fg_size, legacy_size in mipmap_configs:
        folder_path = os.path.join(RES_DIR, folder)
        os.makedirs(folder_path, exist_ok=True)
        
        # Adaptive foreground
        fg = create_adaptive_foreground(badge, fg_size)
        fg.save(os.path.join(folder_path, "ic_launcher_foreground.png"), format="PNG")
        
        # Legacy square / squircle
        legacy = create_legacy_icon(badge, legacy_size, is_round=False)
        legacy.save(os.path.join(folder_path, "ic_launcher.png"), format="PNG")
        
        # Legacy round
        legacy_round = create_legacy_icon(badge, legacy_size, is_round=True)
        legacy_round.save(os.path.join(folder_path, "ic_launcher_round.png"), format="PNG")
        
    print("[4/5] Адаптивные и legacy иконки сгенерированы во все mipmap-папки Android")
    
    # Обновляем цвет фона адаптивной иконки
    bg_xml_path = os.path.join(RES_DIR, "values", "ic_launcher_background.xml")
    with open(bg_xml_path, "w", encoding="utf-8") as f:
        f.write(f'<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">{BG_HEX}</color>\n</resources>\n')
    print(f"      Обновлён {bg_xml_path} -> {BG_HEX}")
    
    # 3. Splash Screens
    splash_configs = [
        ("drawable", 480, 320),
        ("drawable-land-mdpi", 480, 320),
        ("drawable-land-hdpi", 800, 480),
        ("drawable-land-xhdpi", 1280, 720),
        ("drawable-land-xxhdpi", 1600, 960),
        ("drawable-land-xxxhdpi", 1920, 1280),
        ("drawable-port-mdpi", 320, 480),
        ("drawable-port-hdpi", 480, 800),
        ("drawable-port-xhdpi", 720, 1280),
        ("drawable-port-xxhdpi", 960, 1600),
        ("drawable-port-xxxhdpi", 1280, 1920),
    ]
    
    for folder, w, h in splash_configs:
        folder_path = os.path.join(RES_DIR, folder)
        os.makedirs(folder_path, exist_ok=True)
        splash = create_splash(badge, w, h)
        splash.save(os.path.join(folder_path, "splash.png"), format="PNG")
        
    print("[5/5] Splash-заставки созданы для всех ориентаций и разрешений Android")
    print("\n Все иконки успешно подготовлены и встроены в проект!")

if __name__ == "__main__":
    main()
