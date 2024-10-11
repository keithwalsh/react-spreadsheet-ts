import React, { useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";
import NewTableModal from "../NewTableModal/NewTableModal";
import { FileMenuProps } from "./types";

const FileMenu: React.FC<FileMenuProps> = ({ onCreateNewTable }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNewTable = () => {
        handleClose();
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleCreateNewTable = (rows: number, columns: number) => {
        onCreateNewTable(rows, columns);
        setIsModalOpen(false);
    };

    return (
        <>
            <Button
                onClick={handleClick}
                size="large"
                endIcon={<KeyboardArrowDown sx={{ marginLeft: -0.8 }} />}
                sx={{
                    textTransform: "none",
                    py: 0.5,
                    color: "rgb(55, 65, 81)",
                    "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.04);",
                    },
                }}
            >
                File
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem dense onClick={handleNewTable}>
                    New table...
                </MenuItem>
            </Menu>
            <NewTableModal open={isModalOpen} onClose={handleModalClose} onCreateNewTable={handleCreateNewTable} />
        </>
    );
};

export default FileMenu;
