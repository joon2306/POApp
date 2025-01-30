import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import { ModalType } from "../types/ModalTypes";

const GlobalUIContext = createContext(null);

export const GlobalUiProvider = ({ children }: { children: ReactNode }) => {

    const [modal, setModal] = useState<ModalType | null>(null);

    const showModal = useCallback((config: ModalType) => {
        console.log("modal is being shown");
        setModal({
            title: config.title,
            content: config.content,
            buttons: config.buttons || [],
            closeOnBackdrop: config.closeOnBackdrop ?? true
        });
    }, []);

    const hideModal = useCallback(() => setModal(null), []);

    return (
        <GlobalUIContext.Provider value={{ showModal, hideModal }}>
            {children}

            {modal && (
                <div 
                    style={{
                        position: "fixed",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 50
                    }}
                >
                    {/* Modal container */}
                    <div 
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            backgroundColor: "white",
                            borderRadius: "0.5rem",
                            width: "100%",
                            maxWidth: "28rem",
                            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                            padding: "1.5rem"
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div style={{ paddingBottom: "1rem", borderBottom: "1px solid #e5e7eb" }}>
                            <h2 style={{ fontSize: "1.25rem", fontWeight: "600" }}>{modal.title}</h2>
                        </div>
                        
                        {/* Modal Content */}
                        <div style={{ padding: "1rem 0" }}>
                            {modal.content}
                        </div>

                        {/* Buttons */}
                        {modal.buttons && modal.buttons.length > 0 && (
                            <div style={{ paddingTop: "1rem", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                                {modal.buttons.map((button, index) => (
                                    <button 
                                        key={index} 
                                        style={{
                                            padding: "0.5rem 1rem",
                                            backgroundColor: "#3b82f6",
                                            color: "white",
                                            borderRadius: "0.375rem",
                                            cursor: "pointer",
                                            transition: "background-color 0.2s"
                                        }}
                                        onClick={button.onClick}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#3b82f6"}
                                    >
                                        {button.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </GlobalUIContext.Provider>
    );
};

export const useGlobalUI = () => {
    const context = useContext(GlobalUIContext);
    if (!context) throw new Error('useGlobalUI must be used within GlobalUIProvider');
    return context;
};
