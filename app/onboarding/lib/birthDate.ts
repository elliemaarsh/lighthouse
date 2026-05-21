/** Returns age in full years, or null if invalid / future */
export function ageFromBirthDate(isoDate: string): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const born = new Date(year, month - 1, day);
  if (
    born.getFullYear() !== year ||
    born.getMonth() !== month - 1 ||
    born.getDate() !== day
  ) {
    return null;
  }

  const today = new Date();
  if (born > today) return null;

  let age = today.getFullYear() - year;
  const monthDiff = today.getMonth() - born.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < born.getDate())) {
    age -= 1;
  }

  return age >= 0 && age < 120 ? age : null;
}

export function parseBirthDateParts(
  month: string,
  day: string,
  year: string,
): string | null {
  const m = month.trim();
  const d = day.trim();
  const y = year.trim();
  if (!m || !d || y.length !== 4) return null;

  const monthNum = Number(m);
  const dayNum = Number(d);
  const yearNum = Number(y);
  if (!Number.isInteger(monthNum) || !Number.isInteger(dayNum) || !Number.isInteger(yearNum)) {
    return null;
  }

  const iso = `${yearNum.toString().padStart(4, '0')}-${monthNum.toString().padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;
  return ageFromBirthDate(iso) != null ? iso : null;
}

export function formatDisplayDate(iso: string | null): {
  month: string;
  day: string;
  year: string;
} {
  if (!iso) return { month: '', day: '', year: '' };
  const [y, m, d] = iso.split('-');
  return { month: m ?? '', day: d ?? '', year: y ?? '' };
}
