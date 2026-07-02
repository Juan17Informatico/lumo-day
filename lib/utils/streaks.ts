export function calculateStreaks(dates: string[]): {
  currentStreak: number;
  maxStreak: number;
} {
  if (dates.length === 0) {
    return { currentStreak: 0, maxStreak: 0 };
  }

  const unique = [...new Set(dates)].sort();
  let maxStreak = 1;
  let run = 1;

  for (let i = 1; i < unique.length; i++) {
    const prev = parseDateString(unique[i - 1]);
    const curr = parseDateString(unique[i]);
    const diffDays = Math.round(
      (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 1) {
      run += 1;
      maxStreak = Math.max(maxStreak, run);
    } else {
      run = 1;
    }
  }

  const today = toTodayString();
  const yesterday = toYesterdayString();
  const dateSet = new Set(unique);

  let currentStreak = 0;
  if (dateSet.has(today)) {
    currentStreak = 1;
    let cursor = parseDateString(today);
    while (true) {
      cursor.setDate(cursor.getDate() - 1);
      const key = formatDate(cursor);
      if (dateSet.has(key)) {
        currentStreak += 1;
      } else {
        break;
      }
    }
  } else if (dateSet.has(yesterday)) {
    currentStreak = 1;
    let cursor = parseDateString(yesterday);
    while (true) {
      cursor.setDate(cursor.getDate() - 1);
      const key = formatDate(cursor);
      if (dateSet.has(key)) {
        currentStreak += 1;
      } else {
        break;
      }
    }
  }

  return { currentStreak, maxStreak };
}

function parseDateString(date: string): Date {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function toTodayString(): string {
  return formatDate(new Date());
}

function toYesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return formatDate(d);
}
