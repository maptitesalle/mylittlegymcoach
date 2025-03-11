
import React from 'react';

export const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M18 5h3c.6 0 1 .4 1 1v12c0 .6-.4 1-1 1h-3" />
      <path d="M6 5H3c-.6 0-1 .4-1 1v12c0 .6.4 1 1 1h3" />
      <path d="M7 5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z" />
      <path d="M9 9h6" />
      <path d="M9 13h6" />
    </svg>
  );
};
