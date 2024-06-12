import React from 'react';

interface Comment {
  author: string;
  content: string;
}

interface ChatCommentsProps {
  comments: Comment[];
}

const ChatComments: React.FC<ChatCommentsProps> = ({ comments }) => {
  return (
    <ul className='list-group list-group-numbered'>
      {comments.map((comment, index) => (
        <li key={index} className='list-group-item d-flex justify-content-between align-items-start'>
          <div className="text-wrap" style={{width: '30rem'}}>
            {comment.author}
          </div>
          <div className="text-wrap" style={{width: '30rem'}}>
            {comment.content}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ChatComments;