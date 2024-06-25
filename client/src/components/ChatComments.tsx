import React from 'react';
import { Comment } from '../utils/interfaces';
import './ChatComments.css';

interface ChatCommentsProps {
  comments: Comment[];
}

const ChatComments: React.FC<ChatCommentsProps> = ({ comments }) => {
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
        </li>
      ))}
    </ul>
  );
};

export default ChatComments;
