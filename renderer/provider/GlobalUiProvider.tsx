import { createContext, ReactNode, useCallback, useContext, useState, useRef } from "react";
import { ModalType } from "../types/ModalTypes";
import Modal from "../components/Modal";

const GlobalUIContext = createContext(null);

export const GlobalUiProvider = ({ children }: { children: ReactNode }) => {
    const [modal, setModal] = useState<ModalType | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const showModal = useCallback((config: ModalType) => {
        // Clear any pending hide operations
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        setModal({
            title: config.title,
            content: config.content,
            buttons: config.buttons || [],
            closeOnBackdrop: config.closeOnBackdrop ?? true
        });
        setIsMounted(true);
    }, []);

    const hideModal = useCallback(() => {
        setIsMounted(false);
        // Wait for animation to complete before removing modal
        timeoutRef.current = setTimeout(() => {
            setModal(null);
        }, 300);
    }, []);

    return (
        <GlobalUIContext.Provider value={{ showModal, hideModal }}>
            {children}

            {modal && (
                <Modal modal={modal} hideModal={hideModal} isMounted={isMounted} />
            )}
        </GlobalUIContext.Provider>
    );
};

export const useGlobalUI = () => {
    const context = useContext(GlobalUIContext);
    if (!context) throw new Error('useGlobalUI must be used within GlobalUIProvider');
    return context;
};
