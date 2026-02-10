import { SyntaxStyle, RGBA } from "@opentui/core";
import { theme } from "@/lib/theme";

/**
 * Shared syntax style for Markdown and Code components.
 * Includes both markup (markdown) and code token styles.
 * Markdown uses markup.* for headings, lists, etc.; Code uses keyword, string, etc.
 */
export const sharedSyntaxStyle = SyntaxStyle.fromStyles({

  // Markdown markup styles
  "markup.heading": { fg: RGBA.fromHex(theme.accent), bold: true },
  "markup.heading.1": { fg: RGBA.fromHex(theme.accent), bold: true },
  "markup.heading.2": { fg: RGBA.fromHex(theme.accentSecondary), bold: true },
  "markup.heading.3": { fg: RGBA.fromHex(theme.accentTertiary), bold: true },
  "markup.bold": { fg: RGBA.fromHex(theme.text), bold: true },
  "markup.strong": { fg: RGBA.fromHex(theme.text), bold: true },
  "markup.italic": { fg: RGBA.fromHex(theme.text), bold: false },
  "markup.list": { fg: RGBA.fromHex(theme.accentSecondary) },
  "markup.quote": { fg: RGBA.fromHex(theme.textDim), bold: false },
  "markup.raw": { fg: RGBA.fromHex(theme.accentTertiary) },
  "markup.raw.block": { fg: RGBA.fromHex(theme.accentTertiary) },
  "markup.link": { fg: RGBA.fromHex(theme.accent), bold: false },
  "markup.link.url": { fg: RGBA.fromHex(theme.accent), bold: false },

  // Code token styles (used in markdown code blocks and standalone Code)
  keyword: { fg: RGBA.fromHex(theme.accent), bold: true },
  "keyword.import": { fg: RGBA.fromHex(theme.accent), bold: true },
  "keyword.operator": { fg: RGBA.fromHex(theme.accentSecondary) },
  string: { fg: RGBA.fromHex(theme.accentTertiary) },
  comment: { fg: RGBA.fromHex(theme.textDim), bold: false },
  number: { fg: RGBA.fromHex(theme.accentSecondary) },
  boolean: { fg: RGBA.fromHex(theme.accentSecondary) },
  constant: { fg: RGBA.fromHex(theme.accentSecondary) },
  function: { fg: RGBA.fromHex(theme.accentSecondary) },
  "function.call": { fg: RGBA.fromHex(theme.accentSecondary) },
  "function.method.call": { fg: RGBA.fromHex(theme.accentSecondary) },
  type: { fg: RGBA.fromHex(theme.accent), bold: true },
  constructor: { fg: RGBA.fromHex(theme.accent), bold: true },
  variable: { fg: RGBA.fromHex(theme.text) },
  "variable.member": { fg: RGBA.fromHex(theme.accentSecondary) },
  property: { fg: RGBA.fromHex(theme.accentSecondary) },
  operator: { fg: RGBA.fromHex(theme.accentSecondary) },
  punctuation: { fg: RGBA.fromHex(theme.text) },
  "punctuation.bracket": { fg: RGBA.fromHex(theme.text) },
  "punctuation.delimiter": { fg: RGBA.fromHex(theme.textDim) },
  default: { fg: RGBA.fromHex(theme.text) },
});
