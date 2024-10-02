import { useState, useEffect, useRef } from "react";
import { Meta, StoryFn } from "@storybook/react";
import { Cell } from "@components";
import { CellProps } from "@types";

export default {
    title: "Components/Cell",
    component: Cell,
} as Meta<typeof Cell>;

const Template: StoryFn<CellProps> = (args) => {
    const [selectedCells, setSelectedCells] = useState<boolean[][]>([[false]]);
    const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
    const [cellData, setCellData] = useState<string>(args.cellData || "");
    const cellRef = useRef<HTMLDivElement>(null);

    const handleCellSelection = (rowIndex: number, colIndex: number) => {
        setSelectedCell({ row: rowIndex, col: colIndex });
        const newSelectedCells = [[false]];
        newSelectedCells[rowIndex][colIndex] = true;
        setSelectedCells(newSelectedCells);
    };

    const handleCellChange = (_rowIndex: number, _colIndex: number, value: string) => {
        setCellData(value);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (cellRef.current && !cellRef.current.contains(event.target as Node)) {
                setSelectedCell(null);
                setSelectedCells([[false]]);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div ref={cellRef}>
            <Cell
                {...args}
                selectedCells={selectedCells}
                selectedCell={selectedCell}
                handleCellSelection={handleCellSelection}
                handleCellChange={handleCellChange}
                cellData={cellData}
            />
        </div>
    );
};

export const Default = Template.bind({});
Default.args = {
    rowIndex: 0,
    colIndex: 0,
    align: "left",
    style: {},
    cellData: "Click to edit",
};
