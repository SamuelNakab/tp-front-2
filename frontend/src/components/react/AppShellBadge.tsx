import { useAppShell } from "../../hooks/useAppShell";

export default function AppShellBadge() {
  const { appName } = useAppShell();

  return <small>React island ready for: {appName}</small>;
}
