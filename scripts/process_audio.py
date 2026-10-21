"""
Студийная обработка и нормализация озвучки (EBU R128 + очистка шума):
1. Фильтрация суб-низкого гула: highpass=f=70
2. Удаление микро-щелчков TTS: adeclick
3. Мягкое спектральное шумоподавление: afftdn=nr=10:nf=-28:tn=1
4. Двухпроходная линейная нормализация громкости EBU R128:
   - Target Integrated Loudness: -16.0 LUFS
   - Max True Peak: -1.5 dBTP
   - LRA: 11 LU (linear=true — без компрессии и искажений тембра)
5. Ресемплинг высокой точности (libsoxr -> 44.1 kHz, Stereo, MP3 CBR 128 kbps)
"""

import os
import sys
import json
import subprocess

FFMPEG = r'C:\Frontend\kids-story-quest_1\node_modules\@ffmpeg-installer\win32-x64\ffmpeg.exe'

SRC_DIR = sys.argv[1] if len(sys.argv) > 1 else r'C:\Users\900\Music\Сконвертировано MediaHuman'
DST_DIR = sys.argv[2] if len(sys.argv) > 2 else r'c:\Frontend\animals\assets\audio\stories\seton-lobo'

os.makedirs(DST_DIR, exist_ok=True)

audio_files = sorted([
    f for f in os.listdir(SRC_DIR)
    if f.lower().endswith(('.mp3', '.wav', '.m4a', '.flac', '.ogg'))
])

print(f"Найдено исходных аудиофайлов: {len(audio_files)}")
print(f"Источник: {SRC_DIR}")
print(f"Назначение: {DST_DIR}\n")

PRE_CLEAN_CHAIN = "highpass=f=70,adeclick,afftdn=nr=10:nf=-28:tn=1"

ok_count = 0
err_count = 0

for idx, fname in enumerate(audio_files):
    src_path = os.path.join(SRC_DIR, fname)
    base_name = os.path.splitext(fname)[0] + '.mp3'
    dst_path = os.path.join(DST_DIR, base_name)

    print(f"[{idx+1:02d}/{len(audio_files):02d}] Обработка {fname} -> {base_name}")

    # PASS 1: Замер громкости ПОСЛЕ очистки шума и фильтрации
    pass1_af = f"{PRE_CLEAN_CHAIN},loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json"
    pass1_cmd = [
        FFMPEG, '-hide_banner', '-y', '-i', src_path,
        '-af', pass1_af,
        '-f', 'null', '-'
    ]
    res1 = subprocess.run(pass1_cmd, capture_output=True, text=True, encoding='utf-8', errors='replace')
    stderr_text = res1.stderr

    try:
        json_start = stderr_text.rfind('{')
        json_end = stderr_text.rfind('}') + 1
        d = json.loads(stderr_text[json_start:json_end])
        input_i = d['input_i']
        input_tp = d['input_tp']
        input_lra = d['input_lra']
        input_thresh = d['input_thresh']
        target_offset = d['target_offset']
        print(f"   Замер (Pass 1): LUFS={input_i} dB | TruePeak={input_tp} dBTP | LRA={input_lra}")
    except Exception as e:
        print(f"   ОШИБКА Pass 1: {e}")
        err_count += 1
        continue

    # PASS 2: Чистая двухпроходная нормализация + ресемплинг soxr + кодирование MP3
    pass2_af = (
        f"{PRE_CLEAN_CHAIN},"
        f"loudnorm=I=-16:TP=-1.5:LRA=11:linear=true:"
        f"measured_I={input_i}:measured_TP={input_tp}:"
        f"measured_LRA={input_lra}:measured_thresh={input_thresh}:"
        f"offset={target_offset}:print_format=summary,"
        f"aresample=resampler=soxr:osr=44100"
    )
    pass2_cmd = [
        FFMPEG, '-hide_banner', '-y', '-i', src_path,
        '-af', pass2_af,
        '-ar', '44100', '-ac', '2', '-c:a', 'libmp3lame', '-b:a', '128k',
        dst_path
    ]
    res2 = subprocess.run(pass2_cmd, capture_output=True, text=True, encoding='utf-8', errors='replace')

    if res2.returncode == 0 and os.path.exists(dst_path):
        # Проверим итоговый LUFS после нормализации
        verify_cmd = [
            FFMPEG, '-hide_banner', '-y', '-i', dst_path,
            '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json',
            '-f', 'null', '-'
        ]
        res_v = subprocess.run(verify_cmd, capture_output=True, text=True, encoding='utf-8', errors='replace')
        v_text = res_v.stderr
        v_d = json.loads(v_text[v_text.rfind('{'):v_text.rfind('}')+1])
        out_kb = os.path.getsize(dst_path) // 1024
        print(f"   Итог  (Pass 2): LUFS={v_d['input_i']} dB | TruePeak={v_d['input_tp']} dBTP | Размер={out_kb} KB [OK]")
        ok_count += 1
    else:
        print(f"   ОШИБКА Pass 2: {res2.stderr[-300:]}")
        err_count += 1

print(f"\n{'='*60}")
print(f"ГОТОВО: Успешно обработано {ok_count} из {len(audio_files)} файлов (ошибок: {err_count})")
print(f"Папка рассказа: {DST_DIR}")
print(f"{'='*60}")
