# scripts/generate_screenshots.py
import subprocess
import time
import http.server
import threading
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
DIST_DIR = os.path.join(PROJECT_DIR, 'dist_store')
SHOTS_DIR = os.path.join(DIST_DIR, 'screenshots')
os.makedirs(SHOTS_DIR, exist_ok=True)

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PROJECT_DIR, **kwargs)
    def log_message(self, format, *args):
        pass

def generate_screenshots():
    # 1. Start local server
    port = 8092
    server = http.server.HTTPServer(('127.0.0.1', port), QuietHandler)
    server_thread = threading.Thread(target=server.serve_forever, daemon=True)
    server_thread.start()
    print(f"Local server started on port {port}")

    # 2. Prepare runner HTML
    runner_path = os.path.join(PROJECT_DIR, 'temp_shot_runner.html')
    runner_html = """<!DOCTYPE html>
<html lang="ru" data-theme="forest">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <link rel="stylesheet" href="css/style.css">
  <style>
    html, body {
      margin: 0;
      padding: 0;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      background-color: var(--bg-primary, #FAF6EE);
    }
    #app-container {
      width: 100%;
      height: 100%;
    }
  </style>
</head>
<body>
  <div id="app-container"></div>
  <script type="module">
    import './js/app.js';
    const params = new URLSearchParams(window.location.search);
    const screen = params.get('screen') || 'COLLECTION';
    const story = params.get('story') || 'seton-chink';
    const theme = params.get('theme') || 'forest';
    const page = parseInt(params.get('page') || '1', 10);

    window.addEventListener('load', () => {
      setTimeout(() => {
        if (window.__app) {
          window.__app.applyTheme(theme);
          window.unlock();
          window.__app.navigate(screen, {
            selectedCollectionId: 'animals_collection_1',
            selectedStoryId: story,
            currentPage: page
          });
        }
      }, 500);
    });
  </script>
</body>
</html>
"""
    with open(runner_path, 'w', encoding='utf-8') as f:
        f.write(runner_html)

    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    
    shots_config = [
        {
            "name": "screenshot_1_collection.png",
            "url": f"http://127.0.0.1:{port}/temp_shot_runner.html?screen=COLLECTION&theme=forest",
            "caption": "Сборник рассказов «Зов дикой природы»"
        },
        {
            "name": "screenshot_2_chink.png",
            "url": f"http://127.0.0.1:{port}/temp_shot_runner.html?screen=READER&story=seton-chink&page=1&theme=forest",
            "caption": "«Чинк — щенок из Йеллоустоуна» • Бесплатно"
        },
        {
            "name": "screenshot_3_lobo.png",
            "url": f"http://127.0.0.1:{port}/temp_shot_runner.html?screen=READER&story=seton-lobo&page=1&theme=forest",
            "caption": "«Лобо — король Куррумпо» • Студийная озвучка"
        },
        {
            "name": "screenshot_4_dark_theme.png",
            "url": f"http://127.0.0.1:{port}/temp_shot_runner.html?screen=READER&story=seton-chink&page=2&theme=dark",
            "caption": "Уютная тёмная тема для чтения перед сном"
        }
    ]

    captured_files = []
    # Target phone screenshot: standard 1080 x 1920
    # In Chrome headless: viewport 412 x 732 with scale factor 2.625 -> ~1080 x 1920
    for cfg in shots_config:
        out_file = os.path.join(SHOTS_DIR, cfg["name"])
        cmd = [
            chrome_path,
            '--headless=new',
            '--disable-gpu',
            '--window-size=1080,1920',
            '--virtual-time-budget=2500',
            f'--screenshot={out_file}',
            cfg["url"]
        ]
        print(f"Capturing {cfg['name']}...")
        subprocess.run(cmd, capture_output=True, timeout=15)
        if os.path.exists(out_file):
            # Ensure exact 1080x1920 dimensions
            with Image.open(out_file) as im:
                if im.size != (1080, 1920):
                    resized = im.resize((1080, 1920), Image.Resampling.LANCZOS)
                    resized.save(out_file, quality=95)
            captured_files.append(out_file)
            print(f"  -> OK ({os.path.getsize(out_file)} bytes)")
        else:
            print(f"  -> FAILED to capture {cfg['name']}")

    # Clean up
    if os.path.exists(runner_path):
        os.remove(runner_path)
    server.shutdown()
    print("Screenshots generation complete!")
    return captured_files

if __name__ == '__main__':
    generate_screenshots()
