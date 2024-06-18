import React from 'react';
import { Comment } from '../utils/interfaces';
import './ChatComments.css'

interface ChatCommentsProps {
  comments: Comment[];
}

const ChatComments: React.FC<ChatCommentsProps> = ({ comments }) => {
  return (
    <ul className='list-group list-group'>
      {comments.map((comment, index) => (
        <li key={index} className='list-group-item d-flex justify-content-between align-items-start comment-line'>
          <div className="text-wrap user-name" style={{width: '20rem'}}>
            {comment.userName}
          </div>
          <div className="text-wrap user-comment" style={{width: '70rem'}}>
            {comment.text}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ChatComments;