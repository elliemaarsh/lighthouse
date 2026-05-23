const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;

export function isValidCommunityUsername(value: string): boolean {
  return USERNAME_RE.test(value.trim());
}

export function communityUsernameError(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.length < 3 || trimmed.length > 20) {
    return 'Must be 3–20 characters';
  }
  if (/\s/.test(trimmed)) return 'No spaces allowed';
  if (!USERNAME_RE.test(trimmed)) {
    return 'Letters, numbers, and underscores only';
  }
  return null;
}
