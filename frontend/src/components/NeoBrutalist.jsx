import React from 'react';

export const NeoButton = ({ children, className = '', ...props }) => {
    return (
        <button
            className={`
        border-2 border-black bg-[#d4561c] text-white font-bold uppercase tracking-wider
        px-6 py-3 shadow-[4px_4px_0_#000]
        hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000]
        active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
        transition-all cursor-pointer
        ${className}
      `}
            {...props}
        >
            {children}
        </button>
    );
};

export const NeoSecondaryButton = ({ children, className = '', ...props }) => {
    return (
        <button
            className={`
          border-2 border-black bg-white text-black font-bold uppercase tracking-wider
          px-6 py-3 shadow-[4px_4px_0_#000]
          hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000]
          active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
          transition-all cursor-pointer
          ${className}
        `}
            {...props}
        >
            {children}
        </button>
    );
};

export const NeoInput = ({ className = '', ...props }) => {
    return (
        <input
            className={`
        w-full h-[50px] rounded-none border-2 border-black bg-white px-4 text-black
        shadow-[4px_4px_0_#000]
        placeholder:text-gray-500
        focus:border-[#d4561c] focus:outline-none 
        focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none
        transition-all
        ${className}
      `}
            {...props}
        />
    );
};

export const NeoCard = ({ children, className = '', ...props }) => {
    return (
        <div
            className={`
        border-2 border-black bg-white p-6 md:p-8 
        shadow-[6px_6px_0_#000]
        ${className}
      `}
            {...props}
        >
            {children}
        </div>
    );
};

export const NeoBadge = ({ children, className = '', rotate = '-rotate-1', ...props }) => {
    return (
        <div
            className={`
        inline-flex items-center justify-center
        bg-yellow-400 border-2 border-black px-4 py-1 
        text-sm font-black text-black uppercase tracking-wider
        shadow-[3px_3px_0_#000]
        ${rotate}
        ${className}
      `}
            {...props}
        >
            {children}
        </div>
    );
};
