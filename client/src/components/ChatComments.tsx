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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  
  return (
    <ul className='comment-list'>
      {comments.map((comment, index) => (
        <li key={index} className='comment-container'>
          <div className="comment-header">
            <span className="user-name">{comment.userName}</span>
          </div>
          <div className="comment-content">
            <p>{comment.text}</p>
          </div>
          <div ref={messagesEndRef} />
        </li>
      ))}
    </ul>
  );
};

export default ChatComments;
