import { useState, useEffect } from "react";
import { theme } from "@/lib/theme";

const SPINNER = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const SPARKLES = ["✦", "✧", "⋆", "✧"];

export function ThinkingIndicator() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const spinner = SPINNER[tick % SPINNER.length];
  const dotCount = (Math.floor(tick / 5) % 3) + 1;
  const dots = "·".repeat(dotCount) + " ".repeat(3 - dotCount);

  const sparkleL = SPARKLES[Math.floor(tick / 3) % SPARKLES.length];
  const sparkleR = SPARKLES[Math.floor((tick + 2) / 3) % SPARKLES.length];

  // gentle color pulse between blue ↔ purple
  const phase = Math.floor(tick / 12) % 2;
  const primary = phase === 0 ? theme.accent : theme.accentSecondary;
  const secondary = phase === 0 ? theme.accentSecondary : theme.accent;

  return (
    <box paddingLeft={1} marginTop={1} flexDirection="row">
      <text fg={primary}>{spinner} Thinking</text>
    </box>
  );
}
