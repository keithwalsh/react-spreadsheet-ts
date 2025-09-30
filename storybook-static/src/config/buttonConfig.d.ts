import { ButtonDefinition } from '../types';
import { ThemeColors } from '../types/enums';
export declare const buttonConfig: (theme: string) => {
    borderColor: ThemeColors;
    svgStyle: {
        color?: undefined;
    } | {
        color: ThemeColors;
    };
    hoverStyle: {
        backgroundColor: string;
    } | {
        backgroundColor?: undefined;
    };
};
export declare const defaultVisibleButtons: (string | "divider")[];
export declare const buttonDefinitions: ButtonDefinition[];
//# sourceMappingURL=buttonConfig.d.ts.map