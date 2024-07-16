import './CopyLink.css';

interface CopyLinkProps {
  link: string;
}

const CopyLink: React.FC<CopyLinkProps> = ({ link }) => {
  const rootUrl = window.location.protocol + "//" 
  + window.location.hostname 
  + (window.location.port ? ":" + window.location.port : "");
  const fullUrl = rootUrl + link;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullUrl).then(() => {
      alert('Link copied to clipboard!');
    }, () => {
      alert('Failed to copy link');
    });
  };

  return (
    <div className='copy-link-container'>
      <input
        type='text'
        value={fullUrl}
        readOnly
        className='copy-link-input'
      />
      <button
        onClick={copyToClipboard}
        className='copy-link-button'
      >
        COPY MEETING URL
      </button>
    </div>
  );
}

export default CopyLink;
