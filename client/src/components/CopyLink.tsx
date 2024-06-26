import './CopyLink.css';

interface CopyLinkProps {
  link: string;
}

const CopyLink: React.FC<CopyLinkProps> = ({ link }) => {

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link).then(() => {
      alert('Link copied to clipboard!');
    }, () => {
      alert('Failed to copy link');
    });
  };

  return (
    <div className='copy-link-container'>
      <input
        type='text'
        value={link}
        readOnly
        className='copy-link-input'
      />
      <button
        onClick={copyToClipboard}
        className='copy-link-button'
      >
        Copy
      </button>
    </div>
  );
}

export default CopyLink;
