import { useMemo } from "react";

export type AppShellState = {
  appName: string;
};

// React hooks are isolated under src/hooks for islands/components that need client interactivity.
export function useAppShell(): AppShellState {
  return useMemo(
    () => ({
      appName: "Web App Starter",
    }),
    []
  );
}
