import styled from '@emotion/styled';
import { Holiday } from '../../types';

const Badge = styled.div`
  background-color: #2e7d32;
  color: #fff;
  font-size: 11px;
  border-radius: 3px;
  padding: 2px 6px;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: default;
  user-select: none;
`;

interface HolidayBadgeProps {
  holiday: Holiday;
}

const HolidayBadge = ({ holiday }: HolidayBadgeProps) => {
  return <Badge title={holiday.name}>{holiday.localName}</Badge>;
};

export default HolidayBadge;
