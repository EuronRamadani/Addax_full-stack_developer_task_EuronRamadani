import { useState } from 'react';
import styled from '@emotion/styled';
import { CalendarDay, Task, DragItem } from '../../types';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import HolidayBadge from '../UI/HolidayBadge';

const isToday = (date: Date): boolean => {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
};

const Cell = styled.div<{ isCurrentMonth: boolean; isDragOver: boolean }>`
  background: ${({ isCurrentMonth }) => (isCurrentMonth ? '#ffffff' : '#f8f8f8')};
  border: 1px solid #e0e0e0;
  ${({ isDragOver }) => isDragOver && 'border: 2px dashed #4a90e2;'}
  min-height: 120px;
  padding: 8px;
  box-sizing: border-box;
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const DayNumber = styled.div<{ isToday: boolean; isCurrentMonth: boolean }>`
  font-size: 13px;
  font-weight: ${({ isToday }) => (isToday ? '700' : '400')};
  color: ${({ isCurrentMonth, isToday }) =>
    isToday ? '#fff' : isCurrentMonth ? '#333' : '#aaa'};
  background: ${({ isToday }) => (isToday ? '#4a90e2' : 'transparent')};
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: flex-end;
  margin-bottom: 4px;
  flex-shrink: 0;
`;

const HolidayArea = styled.div`
  display: flex;
  flex-direction: column;
`;

const TaskList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const AddButton = styled.button`
  background: none;
  border: none;
  color: #bbb;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  padding: 0;
  align-self: flex-start;
  margin-top: 2px;

  &:hover {
    color: #4a90e2;
  }
`;

interface CalendarCellProps {
  day: CalendarDay;
  onCreateTask: (date: string, title: string) => void;
  onUpdateTask: (id: string, data: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onReorder: (tasks: { _id: string; order: number; date: string }[]) => void;
  searchQuery: string;
}

const CalendarCell = ({
  day,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onReorder,
  searchQuery,
}: CalendarCellProps) => {
  const [showForm, setShowForm] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const filteredTasks = searchQuery.trim()
    ? day.tasks.filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : day.tasks;

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    let item: DragItem;
    try {
      item = JSON.parse(e.dataTransfer.getData('application/json')) as DragItem;
    } catch {
      return;
    }

    const { taskId, fromDate } = item;

    if (fromDate === day.dateString) {
      const sorted = [...day.tasks].sort((a, b) => a.order - b.order);
      const draggedIdx = sorted.findIndex((t) => t._id === taskId);
      if (draggedIdx === -1) return;

      const reordered = [...sorted];
      const [moved] = reordered.splice(draggedIdx, 1);
      reordered.push(moved);

      const updates = reordered.map((t, i) => ({ _id: t._id, order: i, date: t.date }));
      onReorder(updates);
    } else {
      const targetTasks = [...day.tasks].sort((a, b) => a.order - b.order);
      const newOrder = targetTasks.length > 0 ? targetTasks[targetTasks.length - 1].order + 1 : 0;
      onUpdateTask(taskId, { date: day.dateString, order: newOrder });
    }
  };

  const handleAddClick = () => setShowForm(true);
  const handleFormSubmit = (title: string) => {
    onCreateTask(day.dateString, title);
    setShowForm(false);
  };
  const handleFormCancel = () => setShowForm(false);

  return (
    <Cell
      isCurrentMonth={day.isCurrentMonth}
      isDragOver={isDragOver}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <DayNumber isToday={isToday(day.date)} isCurrentMonth={day.isCurrentMonth}>
        {day.date.getDate()}
      </DayNumber>

      <HolidayArea>
        {day.holidays.map((h, i) => (
          <HolidayBadge key={`${h.date}-${h.name}-${i}`} holiday={h} />
        ))}
      </HolidayArea>

      <TaskList>
        {filteredTasks.map((task, idx) => (
          <TaskCard
            key={task._id}
            task={task}
            index={idx}
            onUpdate={onUpdateTask}
            onDelete={onDeleteTask}
            searchQuery={searchQuery}
          />
        ))}
      </TaskList>

      {showForm ? (
        <TaskForm onSubmit={handleFormSubmit} onCancel={handleFormCancel} />
      ) : (
        <AddButton onClick={handleAddClick} title="Add task">
          +
        </AddButton>
      )}
    </Cell>
  );
};

export default CalendarCell;
