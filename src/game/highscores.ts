const STORAGE_KEY = "colorbloxx-highscores";
const MAX_ENTRIES = 10;

export interface HighScore {
  initials: string;
  score: number;
  date: string;
}

export function getHighScores(): HighScore[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HighScore[];
    return parsed
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_ENTRIES);
  } catch {
    return [];
  }
}

export function saveHighScore(initials: string, score: number): number {
  const scores = getHighScores();
  const entry: HighScore = {
    initials,
    score,
    date: new Date().toISOString().slice(0, 10),
  };
  scores.push(entry);
  scores.sort((a, b) => b.score - a.score);
  const trimmed = scores.slice(0, MAX_ENTRIES);
  const rank = trimmed.findIndex(
    (s) => s === entry || (s.initials === initials && s.score === score && s.date === entry.date),
  );
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // localStorage full or unavailable
  }
  return rank;
}
