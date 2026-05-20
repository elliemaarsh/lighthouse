import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  initialCheckInData,
  type CheckInData,
} from '@/types/checkIn';

type CheckInContextValue = {
  data: CheckInData;
  update: (partial: Partial<CheckInData>) => void;
  reset: () => void;
};

const CheckInContext = createContext<CheckInContextValue | null>(null);

export function CheckInProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CheckInData>(initialCheckInData);

  const update = useCallback((partial: Partial<CheckInData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  }, []);

  const reset = useCallback(() => {
    setData(initialCheckInData);
  }, []);

  const value = useMemo(
    () => ({ data, update, reset }),
    [data, update, reset],
  );

  return (
    <CheckInContext.Provider value={value}>{children}</CheckInContext.Provider>
  );
}

export function useCheckIn() {
  const context = useContext(CheckInContext);
  if (!context) {
    throw new Error('useCheckIn must be used within CheckInProvider');
  }
  return context;
}
