/** Supabase/PostgREST errors when community tables are not created yet */
export function isCommunitySchemaUnavailable(
  error: { message?: string } | null | undefined,
): boolean {
  const msg = error?.message ?? '';
  return (
    /could not find the table/i.test(msg) ||
    /schema cache/i.test(msg) ||
    /relation .* does not exist/i.test(msg) ||
    /community_profiles/i.test(msg)
  );
}
