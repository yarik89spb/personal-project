import React, { useRef, useLayoutEffect } from 'react';

interface AlwaysScrollToBottomProps {
  children?: React.ReactNode;
}

const AlwaysScrollToBottom: React.FC<AlwaysScrollToBottomProps> = ({ children }) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (elementRef.current) {
      elementRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [children]);

  return <div ref={elementRef}>{children}</div>;
};

export default AlwaysScrollToBottom;
