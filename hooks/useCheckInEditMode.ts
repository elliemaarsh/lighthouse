import { useLocalSearchParams } from 'expo-router';

export function useCheckInEditMode(): boolean {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  return mode === 'edit';
}
