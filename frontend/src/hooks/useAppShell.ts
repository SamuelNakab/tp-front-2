import { useMemo } from "react";

export type AppShellState = {
  appName: string;
};

export function useAppShell(): AppShellState {
  return useMemo(
    () => ({
      appName: "Web App Starter",
    }),
    []
  );
}
