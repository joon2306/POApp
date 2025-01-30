import { useGlobalUI } from "../../provider/GlobalUiProvider";
import { ModalType } from "../../types/ModalTypes";

let modalServiceInstance: ReturnType<typeof createModalService> | null = null;

const createModalService = () => {
    const { showModal, hideModal } = useGlobalUI();

    return {
        openModal: (arg: ModalType) => showModal(arg),
        closeModal: () => hideModal(),
    };
};

export const getModalService = () => {
    if (!modalServiceInstance) {
        modalServiceInstance = createModalService();
    }
    return modalServiceInstance;
};

type ModalService = {
    openModal: (arg: ModalType) => void,
    closeModal: () => void,
}

export default ModalService;
