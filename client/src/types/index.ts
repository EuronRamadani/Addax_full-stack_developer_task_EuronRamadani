export interface Task {
  _id: string;
  title: string;
  date: string; // ISO date string "YYYY-MM-DD"
  order: number;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Holiday {
  date: string; // "YYYY-MM-DD"
  localName: string;
  name: string;
  countryCode: string;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  dateString: string; // "YYYY-MM-DD"
  tasks: Task[];
  holidays: Holiday[];
}

export type DragItem = {
  taskId: string;
  fromDate: string;
  fromIndex: number;
};
