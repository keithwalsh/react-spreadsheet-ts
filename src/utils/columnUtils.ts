/**
 * @file src/utils/columnUtils.ts
 * @fileoverview Provides utility functions for handling spreadsheet columns, including label generation.
 */

export function getColumnLabel(index: number): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let label = '';
  let i = index;
  do {
    label = letters[i % 26] + label;
    i = Math.floor(i / 26) - 1;
  } while (i >= 0);
  return label;
} 