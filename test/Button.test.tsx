// test/Button/Button.test.tsx

import { render, screen, fireEvent } from "@testing-library/react";
import Button, { ButtonProps } from "@components/Button/Button";

describe("Button Component", () => {
    const defaultProps: ButtonProps = {
        label: "Test Button",
        onClick: jest.fn(),
    };

    test("renders with default props", () => {
        render(<Button {...defaultProps} />);
        const buttonElement = screen.getByRole("button", { name: /test button/i });
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement).toHaveClass("btn-primary", "btn-medium");
        expect(buttonElement).not.toBeDisabled();
    });

    test("renders with different variants and sizes", () => {
        const { rerender } = render(<Button {...defaultProps} variant="secondary" size="large" />);
        let buttonElement = screen.getByRole("button", { name: /test button/i });
        expect(buttonElement).toHaveClass("btn-secondary", "btn-large");

        rerender(<Button {...defaultProps} variant="danger" size="small" />);
        buttonElement = screen.getByRole("button", { name: /test button/i });
        expect(buttonElement).toHaveClass("btn-danger", "btn-small");
    });

    test("handles click events", () => {
        render(<Button {...defaultProps} />);
        const buttonElement = screen.getByRole("button", { name: /test button/i });
        fireEvent.click(buttonElement);
        expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
    });

    test("is disabled when disabled prop is true", () => {
        render(<Button {...defaultProps} disabled />);
        const buttonElement = screen.getByRole("button", { name: /test button/i });
        expect(buttonElement).toBeDisabled();
    });
});
