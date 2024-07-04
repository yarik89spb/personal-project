interface ConfirmationModalProps{
  show: Boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}


const ConfirmationModal = ({ show, onConfirm, onCancel, message } : ConfirmationModalProps) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p className='alert'>{message}</p>
        <button className="btn btn-primary" onClick={onConfirm}>Yes</button>
        <button className="btn btn-secondary" onClick={onCancel}>No</button>
      </div>
    </div>
  );
};

export default ConfirmationModal;