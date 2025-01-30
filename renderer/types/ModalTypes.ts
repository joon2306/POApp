import React, { ReactNode } from "react"

export type ModalButton = {
    label: string,
    onClick: () => void,
    className: string,
    closeModal: boolean
}

export type ModalType = {
    title: string,
    content: ReactNode,
    buttons: ModalButton[],
    closeOnBackdrop: boolean
}