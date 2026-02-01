export const theme = {
  // Backgrounds
  bg: "#1a1b26", // Main dark background
  bgHighlight: "#24283b", // Highlighted/hover background
  bgSelected: "#7aa2f7", // Selected item background

  // Text
  text: "#a9b1d6", // Primary text
  textDim: "#565f89", // Dimmed/secondary text
  textInverse: "#1a1b26", // Text on selected background

  // Accents
  accent: "#7aa2f7", // Primary accent (blue)
  accentSecondary: "#bb9af7", // Secondary accent (purple)
  accentTertiary: "#9ece6a", // Tertiary accent (green)
  accentDim: "#3b4261", // Muted accent for borders

  // Borders
  border: "#3b4261", // Default border color
  borderFocused: "#7aa2f7", // Focused element border
} as const;

export type Theme = typeof theme;
