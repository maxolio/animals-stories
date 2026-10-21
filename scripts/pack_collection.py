#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
scripts/pack_collection.py
Скрипт сборки облачного ZIP-архива платного контента для приложения «Живые Истории».
Формирует dist_cloud/animals_collection_1.zip для раздачи с сервера (DLC).
"""

import os
import sys
import zipfile
import hashlib
import json
from pathlib import Path

# Поддержка UTF-8 вывода в консоль Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

ROOT_DIR = Path(__file__).resolve().parent.parent
DIST_DIR = ROOT_DIR / "dist_cloud"
PART_ID = "animals_collection_1"
ZIP_NAME = f"{PART_ID}.zip"

# Список историй, входящих в платный архив Сборника №1:
# Внимание: 'seton-chink' (бесплатная) НЕ включается в архив, она поставляется внутри APK!
PAID_STORIES = [
    "seton-lobo"
]

def calculate_hashes(file_path):
    md5 = hashlib.md5()
    sha256 = hashlib.sha256()
    with open(file_path, "rb") as f:
        while chunk := f.read(65536):
            md5.update(chunk)
            sha256.update(chunk)
    return md5.hexdigest(), sha256.hexdigest()

def pack_collection():
    DIST_DIR.mkdir(parents=True, exist_ok=True)
    zip_path = DIST_DIR / ZIP_NAME

    print(f"📦 [Pack] Сборка облачного архива {ZIP_NAME} ...")
    print(f"📁 Корень проекта: {ROOT_DIR}")

    files_to_pack = []

    for story_id in PAID_STORIES:
        # Картинки истории
        img_dir = ROOT_DIR / "assets" / "images" / "stories" / story_id
        if img_dir.exists():
            for p in sorted(img_dir.rglob("*")):
                if p.is_file():
                    rel = p.relative_to(ROOT_DIR).as_posix()
                    files_to_pack.append((p, rel))

        # Аудио истории
        audio_dir = ROOT_DIR / "assets" / "audio" / "stories" / story_id
        if audio_dir.exists():
            for p in sorted(audio_dir.rglob("*")):
                if p.is_file() and p.suffix.lower() in [".mp3", ".wav", ".ogg"]:
                    # В релизный архив берем только обработанные mp3
                    if p.suffix.lower() == ".mp3":
                        rel = p.relative_to(ROOT_DIR).as_posix()
                        files_to_pack.append((p, rel))

    if not files_to_pack:
        print("❌ Ошибка: не найдено файлов для упаковки!")
        sys.exit(1)

    print(f"🔍 Найдено файлов для включения в архив: {len(files_to_pack)}")

    total_uncompressed = 0

    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
        for full_path, arc_name in files_to_pack:
            file_size = full_path.stat().st_size
            total_uncompressed += file_size
            zf.write(full_path, arcname=arc_name)
            print(f"  + {arc_name} ({file_size // 1024} КБ)")

    archive_size = zip_path.stat().st_size
    md5_hash, sha256_hash = calculate_hashes(zip_path)

    # Верификация
    with zipfile.ZipFile(zip_path, "r") as zf:
        test_result = zf.testzip()
        if test_result is not None:
            print(f"❌ Ошибка в архиве: повреждён файл {test_result}")
            sys.exit(1)
        namelist = zf.namelist()

    manifest = {
        "partId": PART_ID,
        "archiveName": ZIP_NAME,
        "version": "1.0.0",
        "fileCount": len(namelist),
        "uncompressedBytes": total_uncompressed,
        "archiveBytes": archive_size,
        "archiveMb": round(archive_size / (1024 * 1024), 2),
        "md5": md5_hash,
        "sha256": sha256_hash,
        "stories": PAID_STORIES,
        "files": namelist
    }

    manifest_path = DIST_DIR / f"{PART_ID}_manifest.json"
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)

    print("\n" + "=" * 60)
    print(f"✅ Архив успешно создан: {zip_path}")
    print(f"📊 Размер архива: {manifest['archiveMb']} МБ ({archive_size:,} байт)")
    print(f"📄 Файлов внутри: {len(namelist)}")
    print(f"🔑 SHA-256: {sha256_hash}")
    print(f"🔑 MD5:    {md5_hash}")
    print(f"📋 Манифест: {manifest_path}")
    print("=" * 60)

if __name__ == "__main__":
    pack_collection()
