import { useState, useEffect, type RefObject } from "react";
import { useTerminalDimensions } from "@opentui/react";
import type { BoxRenderable } from "@opentui/core";

export interface InputBoxLayout {
  top: number | null;
  left: number | null;
  width: number | null;
}

export function useInputBoxLayout(inputBoxRef: RefObject<BoxRenderable | null>): InputBoxLayout {
  const [layout, setLayout] = useState<InputBoxLayout>({ top: null, left: null, width: null });
  const { height: terminalHeight } = useTerminalDimensions();

  // Track input box position and size for command menu positioning
  useEffect(() => {
    const updatePosition = () => {
      if (inputBoxRef.current) {
        setLayout({
          top: inputBoxRef.current.y,
          left: inputBoxRef.current.x,
          width: inputBoxRef.current.width,
        });
      }
    };
    updatePosition();
    // Update on terminal resize
    const interval = setInterval(updatePosition, 100);
    return () => clearInterval(interval);
  }, [terminalHeight, inputBoxRef]);

  return layout;
}
