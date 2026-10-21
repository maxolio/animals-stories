import { spawnSync } from 'child_process';
import { existsSync, rmSync, readdirSync } from 'fs';
import { resolve, join } from 'path';

console.log('🔄 [1/3] Синхронизация файлов проекта в папку www via robocopy...');

const robocopyArgs = [
  '.', 'www',
  '/MIR',
  '/XD', 'node_modules', 'android', '.git', '.gemini', 'www', 'scripts', 'prompts', 'dist_cloud', 'dist_store',
  '/XF', '*.md', '*.log', '*.zip', '*.keystore', 'capacitor.config.json', 'package*.json'
];

const robo = spawnSync('robocopy', robocopyArgs, { stdio: 'inherit', shell: true });

// В robocopy коды выхода 0-7 означают успешное копирование или отсутствие изменений
if (robo.status !== null && robo.status > 7) {
  console.error(`❌ Ошибка robocopy (код выхода ${robo.status})`);
  process.exit(robo.status);
}
console.log('✅ Файлы успешно скопированы в www');

console.log('🧹 [2/3] Очистка платных ассетов из www/ (оставляем только Чинка и обложку Лобо)...');

// 1. Удаляем все слайды Лобо (page-*.webp), оставляя cover.webp для витрины каталога
const loboImagesDir = resolve('www/assets/images/stories/seton-lobo');
if (existsSync(loboImagesDir)) {
  const files = readdirSync(loboImagesDir);
  for (const file of files) {
    if (file !== 'cover.webp') {
      rmSync(join(loboImagesDir, file), { force: true });
    }
  }
}

// 2. Удаляем все аудиофайлы Лобо (они докачиваются через DLC)
const loboAudioDir = resolve('www/assets/audio/stories/seton-lobo');
if (existsSync(loboAudioDir)) {
  rmSync(loboAudioDir, { recursive: true, force: true });
}

console.log('📱 [3/3] Синхронизация с Android проектом Capacitor...');
const capSync = spawnSync('npx', ['cap', 'sync', 'android'], { stdio: 'inherit', shell: true });
if (capSync.status !== 0) {
  console.warn('⚠️ npx cap sync android завершился с кодом', capSync.status);
} else {
  console.log('✅ Capacitor синхронизирован успешно!');
}
