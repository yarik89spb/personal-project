import React, { useEffect, useRef} from 'react';
import { Comment } from '../utils/interfaces';
import './ChatComments.css';

interface ChatCommentsProps {
  comments: Comment[];
}

const ChatComments: React.FC<ChatCommentsProps> = ({ comments }) => {
  useEffect(() => {
    scrollToBottom()
  }, [comments])

  const messagesEndRef = useRef<null | HTMLDivElement>(null)
  const listRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    listRef.current?.scrollTo(0, listRef.current?.scrollHeight)
  }

  return (
    <div className='col-8' id='comments-container' ref={listRef} style={{ height: '400px', maxHeight: '400px', overflowY: 'auto' }}>
      <ul className='comment-list'>
        {comments.map((comment, index) => (
          <li key={index} className='comment-container'>
            <div className="comment-header">
              <span className="user-name">{comment.userName}</span>
            </div>
            <div className="comment-content">
              <p>{comment.text}</p>
            </div>
          </li>
        ))}
        <div ref={messagesEndRef} />
      </ul>
    </div>
  );
};

export default ChatComments;
