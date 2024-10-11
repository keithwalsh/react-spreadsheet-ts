import { IconBaseProps } from "react-icons";

export type ButtonHandlerKey =
    | "onClickUndo"
    | "onClickRedo"
    | "onClickAlignLeft"
    | "onClickAlignCenter"
    | "onClickAlignRight"
    | "onClickAddRow"
    | "onClickRemoveRow"
    | "onClickAddColumn"
    | "onClickRemoveColumn"
    | "onClickSetBold"
    | "onClickSetItalic"
    | "onClickSetCode";

export interface ButtonDefinition {
    title: string;
    icon: React.ComponentType<IconBaseProps>;
    handlerKey: ButtonHandlerKey;
}
