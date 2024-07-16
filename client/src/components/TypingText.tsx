import { useEffect, useState } from 'react';
import './TypingText.css';

interface TypingTextProps {
  text: string;
}

const TypingText = ({ text } : TypingTextProps) => {
  const [displayText, setDisplayText] = useState(text);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setDisplayText('');
    setKey(prevKey => prevKey + 1); // Change key to re-trigger animation

    const timeoutId = setTimeout(() => {
      setDisplayText(text);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [text]);

  return (
    <div className="typing-container">
      <span key={key} className="typing-text">{displayText}</span>
    </div>
  );
};

export default TypingText;
