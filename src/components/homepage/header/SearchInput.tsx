
import React from 'react';
import { X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onClear: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  placeholder,
  onChange,
  onKeyPress,
  onClear,
  inputRef,
  className = ""
}) => {
  return (
    <div className={`flex-1 relative ${className}`}>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        className="w-full px-4 py-3 text-sm focus:outline-none pr-8"
        autoComplete="off"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Clear Search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
