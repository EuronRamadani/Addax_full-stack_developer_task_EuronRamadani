import { useState, useMemo } from 'react';
import styled from '@emotion/styled';
import { useCalendar } from '../../hooks/useCalendar';
import { useHolidays } from '../../hooks/useHolidays';
import { useTasks } from '../../hooks/useTasks';
import { Task } from '../../types';
import CalendarHeader from './CalendarHeader';
import CalendarCell from './CalendarCell';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f0f0f0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const WeekdayRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #fff;
  border-bottom: 2px solid #e0e0e0;
`;

const WeekdayCell = styled.div`
  text-align: center;
  padding: 8px 0;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #888;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(6, 1fr);
  flex: 1;
  gap: 1px;
  background: #d8d8d8;
  overflow: hidden;
`;

const toMonthString = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
};

const Calendar = () => {
  const { currentDate, weeks, goToPrevMonth, goToNextMonth } = useCalendar();
  const [searchQuery, setSearchQuery] = useState('');

  const month = toMonthString(currentDate);
  const { tasksMap, createTask, updateTask, deleteTask, reorderTasks } = useTasks(month);
  const { holidaysMap } = useHolidays(currentDate.getFullYear());

  const enrichedWeeks = useMemo(
    () =>
      weeks.map((week) =>
        week.map((day) => ({
          ...day,
          tasks: (tasksMap[day.dateString] ?? []).sort((a, b) => a.order - b.order),
          holidays: holidaysMap[day.dateString] ?? [],
        }))
      ),
    [weeks, tasksMap, holidaysMap]
  );

  const handleCreateTask = async (date: string, title: string) => {
    await createTask({ title, date, order: 0, color: '#4A90E2' });
  };

  const handleUpdateTask = async (id: string, data: Partial<Task>) => {
    await updateTask(id, data);
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
  };

  const handleReorder = async (tasks: { _id: string; order: number; date: string }[]) => {
    await reorderTasks(tasks);
  };

  return (
    <Wrapper>
      <CalendarHeader
        currentDate={currentDate}
        onPrev={goToPrevMonth}
        onNext={goToNextMonth}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <WeekdayRow>
        {WEEKDAYS.map((day) => (
          <WeekdayCell key={day}>{day}</WeekdayCell>
        ))}
      </WeekdayRow>
      <Grid>
        {enrichedWeeks.flat().map((day) => (
          <CalendarCell
            key={day.dateString}
            day={day}
            onCreateTask={handleCreateTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onReorder={handleReorder}
            searchQuery={searchQuery}
          />
        ))}
      </Grid>
    </Wrapper>
  );
};

export default Calendar;
