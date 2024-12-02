/**
 * @fileoverview Provides styles for header cells based on theme mode.
 */

import { useTheme } from "@mui/material"

const COLORS = {
  dark: { text: "#BEBFC0", border: "#686868", bgSelected: "#686868", bgHover: "#515151", bgDefault: "#414547" },
  light: { text: "rgba(0, 0, 0, 0.54)", border: "#e0e0e0", bgSelected: "#e0e0e0", bgHover: "#f5f5f5", bgDefault: "#f0f0f0" }
} as const

export function useHeaderCellStyles({ isSelected, isHovered }: { isSelected: boolean, isHovered: boolean }) {
  const { palette } = useTheme()
  const colors = palette.mode === 'dark' ? COLORS.dark : COLORS.light

  return {
    cursor: "pointer",
    userSelect: "none",
    textAlign: "center",
    padding: "2px 2px",
    height: "1px",
    lineHeight: "1",
    fontSize: "0.8rem",
    color: colors.text,
    borderRight: `1px solid ${colors.border}`,
    ...(palette.mode === 'dark' && { borderBottom: `1px solid ${colors.border}` }),
    backgroundColor: isSelected ? colors.bgSelected : isHovered ? colors.bgHover : colors.bgDefault,
    "&:hover": { backgroundColor: colors.bgSelected }
  }
} 