import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-[100]" aria-modal="true" role="dialog">
      <div className="bg-f1-light-dark rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col m-4">
        <div className="flex justify-between items-center p-4 border-b border-f1-gray">
          <h2 className="text-xl font-bold text-white uppercase">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
