// ModalService.ts
import { useGlobalUI } from "../../provider/GlobalUiProvider";
import { ModalType } from "../../types/ModalTypes";

export type IModalService = {
    openModal: (arg: ModalType) => void;
    closeModal: () => void;
}

export const useModalService: () => IModalService = () => {
    const { showModal, hideModal } = useGlobalUI();
    return {
        openModal: (arg: ModalType) => showModal(arg),
        closeModal: () => hideModal(),
    };
};