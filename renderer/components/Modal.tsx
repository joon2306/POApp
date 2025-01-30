import styles from "../styles/modal/style.module.css";
import { ModalType } from "../types/ModalTypes";
import Button from "./Button";


const Modal = ({ modal, hideModal, isMounted }: { modal: ModalType, hideModal: () => void, isMounted: boolean }) => {

    return (
        <>
            <div
                className={styles.modalContainer}
                style={{ opacity: isMounted ? 1 : 0 }}
                onClick={() => modal.closeOnBackdrop && hideModal()}
            >
                <div
                    style={{
                        transform: `translate(-50%, -50%) scale(${isMounted ? 1 : 0.95})`,
                        opacity: isMounted ? 1 : 0
                    }}
                    className={styles.modal}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={styles.modalTitle}>
                        <h2>{modal.title}</h2>
                    </div>

                    <div className={styles.modalContent}>
                        {modal.content}
                    </div>

                    {modal.buttons && modal.buttons.length > 0 && (
                        <div className={styles.modalButtonContainer}>
                            {modal.buttons.map((button, index) => (
                                <Button key={index} label={button.label} onClick={button.onClick} variant={button.variant}/>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )

}

export default Modal;
