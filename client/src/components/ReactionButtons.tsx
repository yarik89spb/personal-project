import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

interface ReactionButtonsProps {
  handleEmojiClick: (emoji: string, isPositive: boolean) => void;
  selectedEmoji: string;
}

const ReactionButtons: React.FC<ReactionButtonsProps> = ({ handleEmojiClick, selectedEmoji }) => {
  return (
    <div className='reaction-buttons'>
      <button className={`reaction-button ${selectedEmoji=== 'heart' ? 'selected' : 'deselected'}`} onClick={() => handleEmojiClick('heart', true)}>
        <FontAwesomeIcon icon={faHeart} />
      </button>
      <button className={`reaction-button ${selectedEmoji === 'like' ? 'selected' : 'deselected'}`} onClick={() => handleEmojiClick('like', true)}>
        <FontAwesomeIcon icon={faThumbsUp} />
      </button>
      <button className={`reaction-button ${selectedEmoji === 'dislike' ? 'selected' : 'deselected'}`} onClick={() => handleEmojiClick('dislike', false)}>
        <FontAwesomeIcon icon={faThumbsDown} />
      </button>
      {/* Add more reaction buttons as needed */}
    </div>
  )
}

export default ReactionButtons;
