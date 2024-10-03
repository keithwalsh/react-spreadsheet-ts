// hooks/useOutsideClick.ts
import { useEffect } from "react";

const useOutsideClick = (refs: React.RefObject<HTMLElement>[], handler: (event: MouseEvent) => void) => {
    useEffect(() => {
        const listener = (event: MouseEvent) => {
            if (refs.some((ref) => ref.current && ref.current.contains(event.target as Node))) {
                return;
            }
            handler(event);
        };

        document.addEventListener("mousedown", listener);
        return () => {
            document.removeEventListener("mousedown", listener);
        };
    }, [refs, handler]);
};

export default useOutsideClick;
