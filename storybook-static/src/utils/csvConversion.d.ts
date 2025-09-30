import { CellData } from '../types';
/** Converts a 2D array of CellData into a CSV formatted string. */
export declare const convertToCSV: (data: CellData[][]) => string;
/** Downloads the provided spreadsheet data as a CSV file. */
export declare const downloadCSV: (data: CellData[][], filename?: string) => void;
//# sourceMappingURL=csvConversion.d.ts.map