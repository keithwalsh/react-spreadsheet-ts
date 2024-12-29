/**
 * @file src/styles/linkModalStyles.ts
 * @fileoverview Provides styling for the LinkModal component, including dialog actions and button container.
 */

import { LinkModalStyles } from '../types';

/**
 * Styles for the LinkModal component.
 */
export const linkModalStyles: LinkModalStyles = {
  dialogActions: {
    justifyContent: 'space-between',
    px: 1,
  },
  buttonContainer: {
    display: 'flex',
    gap: 1,
  },
};