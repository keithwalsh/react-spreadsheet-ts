import { HeaderCellStylesParams } from '../types';
import { ThemeColors } from '../types/enums';
export declare function useHeaderCellStyles({ isSelected, isHighlighted, isHovered }: HeaderCellStylesParams): {
    color: ThemeColors;
    backgroundColor: ThemeColors;
    borderRight: string;
    borderBottom: string;
    "&:hover": {
        backgroundColor: ThemeColors;
    };
    cursor: string;
    userSelect: string;
    textAlign: string;
    padding: string;
    height: string;
    lineHeight: string;
    fontSize: string;
} | {
    color: ThemeColors;
    backgroundColor: ThemeColors;
    borderRight: string;
    "&:hover": {
        backgroundColor: ThemeColors;
    };
    cursor: string;
    userSelect: string;
    textAlign: string;
    padding: string;
    height: string;
    lineHeight: string;
    fontSize: string;
};
//# sourceMappingURL=useHeaderCellStyles.d.ts.map