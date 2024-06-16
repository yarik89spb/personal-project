import React from 'react';
import { Comment } from '../utils/interfaces';

interface ChatCommentsProps {
  comments: Comment[];
}

const ChatComments: React.FC<ChatCommentsProps> = ({ comments }) => {
  return (
    <ul className='list-group list-group'>
      {comments.map((comment, index) => (
        <li key={index} className='list-group-item d-flex justify-content-between align-items-start'>
          <div className="text-wrap" style={{width: '30rem'}}>
            {comment.userName}
          </div>
          <div className="text-wrap" style={{width: '30rem'}}>
            {comment.text}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ChatComments;