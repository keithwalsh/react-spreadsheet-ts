// src/utils/csvConversion.ts

import { CellData } from "../types";

export const convertToCSV = (data: CellData[][]): string => {
    return data
        .map((row) =>
            row
                .map((cell) => {
                    const content = cell.content;
                    // Escape quotes and wrap in quotes if cell contains comma or newline
                    if (content.includes('"') || content.includes(",") || content.includes("\n")) {
                        return `"${content.replace(/"/g, '""')}"`;
                    }
                    return content;
                })
                .join(",")
        )
        .join("\n");
};

export const downloadCSV = (data: CellData[][], filename: string = "Table.csv"): void => {
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    if (link.download !== undefined) {
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
