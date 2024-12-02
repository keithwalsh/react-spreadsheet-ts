/**
 * @fileoverview Provides styles for header cells based on theme mode.
 */

import { useTheme } from "@mui/material";

interface HeaderCellStylesParams {
  isSelected: boolean;
  isHovered: boolean;
}

export function useHeaderCellStyles({ isSelected, isHovered }: HeaderCellStylesParams) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const baseStyles = {
    cursor: "pointer",
    userSelect: "none",
    textAlign: "center",
    padding: "2px 2px",
    height: "1px",
    lineHeight: "1",
    fontSize: "0.8rem",
  };

  if (isDarkMode) {
    return {
      ...baseStyles,
      color: "#BEBFC0",
      backgroundColor: isSelected ? "#686868" : isHovered ? "#515151" : "#414547",
      borderRight: "1px solid #686868",
      borderBottom: "1px solid #686868",
      "&:hover": { backgroundColor: "#686868" },
    };
  }

  return {
    ...baseStyles,
    color: "rgba(0, 0, 0, 0.54)",
    backgroundColor: isSelected ? "#e0e0e0" : isHovered ? "#f5f5f5" : "#f0f0f0",
    borderRight: "1px solid #e0e0e0",
    "&:hover": { backgroundColor: "#e0e0e0" },
  };
} 