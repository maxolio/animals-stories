// js/data/storiesRegistry.js
// Реестр всех доступных рассказов

import { LOBO_STORY } from './loboStory.js';
import { CHINK_STORY } from './chinkStory.js';
import { WOLF_CUB_STORY } from './wolfCubStory.js';

export const STORIES_REGISTRY = {
  'seton-lobo': LOBO_STORY,
  'seton-chink': CHINK_STORY,
  'white-fang-cub': WOLF_CUB_STORY
};

export function getStory(storyId) {
  return STORIES_REGISTRY[storyId] || null;
}
