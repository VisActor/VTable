const AUDIO_EXTENSIONS = new Set(['mp3', 'wav', 'ogg', 'oga', 'm4a', 'aac', 'flac', 'opus']);

export function isAudioUrl(value: unknown): boolean {
  if (typeof value !== 'string') {
    return false;
  }

  const trimmedValue = value.trim();
  const queryIndex = trimmedValue.indexOf('?');
  const hashIndex = trimmedValue.indexOf('#');
  let endIndex = trimmedValue.length;
  if (queryIndex >= 0) {
    endIndex = queryIndex;
  }
  if (hashIndex >= 0 && hashIndex < endIndex) {
    endIndex = hashIndex;
  }

  const path = trimmedValue.slice(0, endIndex);
  const dotIndex = path.lastIndexOf('.');
  if (dotIndex < 0 || dotIndex === path.length - 1) {
    return false;
  }

  return AUDIO_EXTENSIONS.has(path.slice(dotIndex + 1).toLowerCase());
}
