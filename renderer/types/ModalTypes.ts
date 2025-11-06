import React, { ReactNode } from "react"
import { ButtonProps } from "./ButtonTypes"

interface ModalConfig {
    title: string,
    content: ReactNode,
    closeOnBackdrop?: boolean,
}
export interface ModalType extends ModalConfig {
    buttons: ButtonProps[]
}

