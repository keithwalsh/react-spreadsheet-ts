export const markSelectedCells = (data: any[][], startRow: number, startCol: number, endRow: number, endCol: number): boolean[][] => {
    const selected = data.map((row, i) =>
        row.map(
            (_, j) => i >= Math.min(startRow, endRow) && i <= Math.max(startRow, endRow) && j >= Math.min(startCol, endCol) && j <= Math.max(startCol, endCol)
        )
    );
    return selected;
};
