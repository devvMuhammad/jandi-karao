import { useState, useEffect, type RefObject } from "react";
import { useTerminalDimensions } from "@opentui/react";
import type { BoxRenderable } from "@opentui/core";

export function useInputBoxTopPosition(inputBoxRef: RefObject<BoxRenderable | null>) {
  const [inputBoxTop, setInputBoxTop] = useState<number | null>(null);
  const { height: terminalHeight } = useTerminalDimensions();

  // Track input box position for command menu positioning
  useEffect(() => {
    const updatePosition = () => {
      if (inputBoxRef.current) {
        setInputBoxTop(inputBoxRef.current.y);
      }
    };
    updatePosition();
    // Update on terminal resize
    const interval = setInterval(updatePosition, 100);
    return () => clearInterval(interval);
  }, [terminalHeight, inputBoxRef]);

  return inputBoxTop;
}
