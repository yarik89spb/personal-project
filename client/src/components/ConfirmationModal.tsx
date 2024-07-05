import './ConfirmationModal.css';

interface ConfirmationModalProps{
  show: Boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}


const ConfirmationModal = ({ show, onConfirm, onCancel, message } : ConfirmationModalProps) => {
  if (!show) return null;

  return (
    <div className='modal-overlay'>
      <div className='card modal-content'>
        <p className='card-header modal-alert-message'>{message}</p>
        <div className='card-body buttons'>
          <button className='btn btn-primary modal-yes' onClick={onConfirm}>Yes</button>
          <button className='btn btn-secondary modal-no' onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;