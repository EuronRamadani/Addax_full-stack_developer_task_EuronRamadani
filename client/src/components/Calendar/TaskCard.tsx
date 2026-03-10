import { useState, useRef } from 'react';
import styled from '@emotion/styled';
import { Task, DragItem } from '../../types';

const Card = styled.div<{ borderColor: string; isDragging: boolean }>`
  background: #fff;
  border-left: 4px solid ${({ borderColor }) => borderColor};
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 5px 8px;
  font-size: 13px;
  margin-bottom: 4px;
  cursor: grab;
  position: relative;
  opacity: ${({ isDragging }) => (isDragging ? 0.4 : 1)};
  display: flex;
  align-items: center;
  gap: 4px;
  min-height: 28px;

  &:hover .delete-btn {
    opacity: 1;
  }

  &:active {
    cursor: grabbing;
  }
`;

const DragHandle = styled.span`
  color: #bbb;
  font-size: 11px;
  cursor: grab;
  flex-shrink: 0;
  line-height: 1;
`;

const TitleWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  mark {
    background: #fff176;
    color: inherit;
    padding: 0;
  }
`;

const EditInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 13px;
  background: transparent;
  min-width: 0;
`;

const DeleteBtn = styled.button`
  opacity: 0;
  transition: opacity 0.15s;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  font-size: 14px;
  padding: 0 2px;
  line-height: 1;
  flex-shrink: 0;

  &:hover {
    color: #e53935;
  }
`;

const highlightText = (text: string, query: string): React.ReactNode => {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark>{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
};

interface TaskCardProps {
  task: Task;
  index: number;
  onUpdate: (id: string, data: Partial<Task>) => void;
  onDelete: (id: string) => void;
  searchQuery: string;
}

const TaskCard = ({ task, index, onUpdate, onDelete, searchQuery }: TaskCardProps) => {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(task.title);
  const [isDragging, setIsDragging] = useState(false);
  const editRef = useRef<HTMLInputElement>(null);

  const handleDoubleClick = () => {
    setEditing(true);
    setEditValue(task.title);
    setTimeout(() => editRef.current?.focus(), 0);
  };

  const saveEdit = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== task.title) {
      onUpdate(task._id, { title: trimmed });
    }
    setEditing(false);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') saveEdit();
    else if (e.key === 'Escape') setEditing(false);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const item: DragItem = { taskId: task._id, fromDate: task.date, fromIndex: index };
    e.dataTransfer.setData('application/json', JSON.stringify(item));
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
  };

  const handleDragEnd = () => setIsDragging(false);

  return (
    <Card
      borderColor={task.color ?? '#4A90E2'}
      isDragging={isDragging}
      draggable={!editing}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDoubleClick={!editing ? handleDoubleClick : undefined}
    >
      <DragHandle>⠿</DragHandle>
      {editing ? (
        <EditInput
          ref={editRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleEditKeyDown}
          onBlur={saveEdit}
        />
      ) : (
        <TitleWrapper>{highlightText(task.title, searchQuery)}</TitleWrapper>
      )}
      <DeleteBtn
        className="delete-btn"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task._id);
        }}
        title="Delete task"
      >
        ×
      </DeleteBtn>
    </Card>
  );
};

export default TaskCard;
