const AUDIO_EXT_REG = /\.(mp3|wav|ogg|oga|m4a|aac|flac|opus)(?:[?#].*)?$/i;

export function isAudioUrl(value: unknown): boolean {
  return typeof value === 'string' && AUDIO_EXT_REG.test(value);
}
