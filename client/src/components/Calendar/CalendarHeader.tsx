import styled from '@emotion/styled';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
`;

const NavGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const NavButton = styled.button`
  background: none;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;
  color: #555;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;

  &:hover {
    background: #f0f4ff;
    border-color: #4a90e2;
    color: #4a90e2;
  }
`;

const MonthTitle = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #222;
  min-width: 200px;
  text-align: center;
`;

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 10px;
  color: #aaa;
  font-size: 14px;
  pointer-events: none;
`;

const SearchInput = styled.input`
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  padding: 7px 14px 7px 32px;
  font-size: 13px;
  outline: none;
  width: 220px;
  background: #fafafa;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:focus {
    border-color: #4a90e2;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.15);
    background: #fff;
  }

  &::placeholder {
    color: #bbb;
  }
`;

interface CalendarHeaderProps {
  currentDate: Date;
  onPrev: () => void;
  onNext: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const CalendarHeader = ({
  currentDate,
  onPrev,
  onNext,
  searchQuery,
  onSearchChange,
}: CalendarHeaderProps) => {
  const month = MONTH_NAMES[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  return (
    <Header>
      <NavGroup>
        <NavButton onClick={onPrev} title="Previous month">
          ←
        </NavButton>
        <MonthTitle>
          {month} {year}
        </MonthTitle>
        <NavButton onClick={onNext} title="Next month">
          →
        </NavButton>
      </NavGroup>

      <SearchWrapper>
        <SearchIcon>🔍</SearchIcon>
        <SearchInput
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
        />
      </SearchWrapper>
    </Header>
  );
};

export default CalendarHeader;
