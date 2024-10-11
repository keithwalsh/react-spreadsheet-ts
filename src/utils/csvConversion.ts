// src/utils/csvConversion.ts

export const convertToCSV = (data: string[][]): string => {
    return data
        .map((row) =>
            row
                .map((cell) => {
                    // Escape quotes and wrap in quotes if cell contains comma or newline
                    if (cell.includes('"') || cell.includes(",") || cell.includes("\n")) {
                        return `"${cell.replace(/"/g, '""')}"`;
                    }
                    return cell;
                })
                .join(",")
        )
        .join("\n");
};

export const downloadCSV = (data: string[][], filename: string = "Table.csv"): void => {
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
