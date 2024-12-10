import React from 'react';
import { IconButton, Tooltip, Divider, Box, ButtonGroup as ButtonGroupMui } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { buttonDefinitions, buttonConfig, defaultVisibleButtons } from '../config';
import { ButtonGroupProps, ButtonId } from '../types';

const ButtonGroup: React.FC<ButtonGroupProps> = ({
    visibleButtons = defaultVisibleButtons,
    orientation = 'horizontal',
    iconSize = 24,
    iconMargin = 4,
    dividerMargin = 8,
    tooltipArrow = true,
    tooltipPlacement = 'bottom'
}) => {
    const theme = useTheme();

    const renderButtons = () => {
        const groups = Object.entries(buttonConfig).map(([groupName, groupButtons]) => {
            const filteredButtons = groupButtons.filter(buttonId => 
                visibleButtons.includes(buttonId)
            );

            if (filteredButtons.length === 0) return null;

            return (
                <React.Fragment key={groupName}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: orientation === 'horizontal' ? 'row' : 'column',
                            gap: `${iconMargin}px`
                        }}
                    >
                        {filteredButtons.map((buttonId: ButtonId) => {
                            const button = buttonDefinitions[buttonId];
                            const Icon = button.icon;
                            return (
                                <Tooltip
                                    key={buttonId}
                                    title={button.tooltip}
                                    arrow={tooltipArrow}
                                    placement={tooltipPlacement}
                                >
                                    <IconButton
                                        size="small"
                                        onClick={() => console.log(button.action)}
                                        sx={{
                                            padding: theme.spacing(1),
                                            '& svg': {
                                                width: iconSize,
                                                height: iconSize,
                                                transform: button.rotate ? `rotate(${button.rotate}deg)` : 'none'
                                            }
                                        }}
                                    >
                                        <Icon />
                                    </IconButton>
                                </Tooltip>
                            );
                        })}
                    </Box>
                    <Divider
                        orientation={orientation}
                        flexItem
                        sx={{
                            margin: orientation === 'horizontal'
                                ? `0 ${dividerMargin}px`
                                : `${dividerMargin}px 0`
                        }}
                    />
                </React.Fragment>
            );
        });

        // Remove the last divider
        return groups.filter(Boolean).slice(0, -1);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: orientation === 'horizontal' ? 'row' : 'column',
                alignItems: 'center',
                padding: theme.spacing(1),
                backgroundColor: theme.palette.background.paper,
                borderRadius: theme.shape.borderRadius,
                border: `1px solid ${theme.palette.divider}`
            }}
        >
            <ButtonGroupMui orientation={orientation}>
                {renderButtons()}
            </ButtonGroupMui>
        </Box>
    );
};

ButtonGroup.displayName = 'ButtonGroup';

export default ButtonGroup;
