import { Global, css } from '@emotion/react';
import Calendar from './components/Calendar/Calendar';

const globalStyles = css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html,
  body,
  #root {
    height: 100%;
    width: 100%;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background: #f0f0f0;
    color: #222;
  }
`;

const App = () => {
  return (
    <>
      <Global styles={globalStyles} />
      <Calendar />
    </>
  );
};

export default App;
