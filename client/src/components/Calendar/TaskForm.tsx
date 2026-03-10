import { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #4a90e2;
  border-radius: 4px;
  padding: 4px 6px;
  font-size: 12px;
  outline: none;
  margin-top: 4px;

  &:focus {
    border-color: #1565c0;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

interface TaskFormProps {
  onSubmit: (title: string) => void;
  onCancel: () => void;
}

const TaskForm = ({ onSubmit, onCancel }: TaskFormProps) => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const trimmed = value.trim();
      if (trimmed) {
        onSubmit(trimmed);
        setValue('');
      }
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  const handleBlur = () => {
    onCancel();
  };

  return (
    <Input
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      placeholder="Add task..."
    />
  );
};

export default TaskForm;
