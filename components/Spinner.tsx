
import React from 'react';

interface SpinnerProps {
    text: string;
}

const Spinner: React.FC<SpinnerProps> = ({ text }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
      <p className="text-lg text-gray-300">{text}</p>
    </div>
  );
};

export default Spinner;
