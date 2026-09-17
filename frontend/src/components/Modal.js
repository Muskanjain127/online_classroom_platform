import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ title, icon, onClose, children }) => {
    return (
        <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-5"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md bg-gradient-to-b from-panel2 to-panel border border-parchment/20 rounded-md p-8 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-serif text-xl flex items-center gap-2 text-parchment">
                        {icon}
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="text-mist hover:text-gold transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

export default Modal;
