import { useSyncExternalStore } from 'react';
import { readStoredValue, writeStoredValue } from './storage';

const STORAGE_KEY = 'learning_games_sound_enabled_v1';
const CHANGE_EVENT = 'learning-games:sound-change';

function readPreference(): boolean {
  const shared = readStoredValue<unknown>(STORAGE_KEY, null);
  if (typeof shared === 'boolean') return shared;
  const names = readStoredValue<{ soundEnabled?: boolean } | null>('asma_allah_kids_game_v1', null);
  if (typeof names?.soundEnabled === 'boolean') return names.soundEnabled;
  const memory = readStoredValue<unknown>('juz_amma_sound_enabled', null);
  return typeof memory === 'boolean' ? memory : true;
}

let enabled = readPreference();
export function getSoundEnabled(): boolean { return enabled; }

export function setSoundEnabled(next: boolean): void {
  enabled = next;
  writeStoredValue(STORAGE_KEY, next);
  if (!next && 'speechSynthesis' in window) window.speechSynthesis.cancel();
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(listener: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      enabled = readPreference();
      if (!enabled && 'speechSynthesis' in window) window.speechSynthesis.cancel();
      listener();
    }
  };
  window.addEventListener(CHANGE_EVENT, listener);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, listener);
    window.removeEventListener('storage', onStorage);
  };
}

export function useSoundEnabled(): boolean {
  return useSyncExternalStore(subscribe, getSoundEnabled, () => true);
}
