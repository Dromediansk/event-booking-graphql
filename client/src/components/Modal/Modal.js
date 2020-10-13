import React from "react";
import Backdrop from "../Backdrop/Backdrop";

const Modal = ({
  title,
  onCancel,
  onConfirm,
  canCancel,
  canConfirm,
  children,
  confirmText,
}) => {
  return (
    <>
      <Backdrop onCancel={onCancel} />
      <div className="modal">
        <header className="modal__header">
          <h1>{title}</h1>
        </header>
        <section className="modal__content">{children}</section>
        <section className="modal__actions">
          {canCancel && (
            <button className="btn" onClick={onCancel}>
              Cancel
            </button>
          )}
          {canConfirm && (
            <button className="btn" onClick={onConfirm}>
              {confirmText}
            </button>
          )}
        </section>
      </div>
    </>
  );
};

export default Modal;
