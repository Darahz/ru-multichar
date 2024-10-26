import { useState } from 'react';
import { isEnvBrowser } from './utils/misc';
import { useNuiEvent } from './hooks/useNuiEvent';
import Identity from './pages/Identity';
import DevDrawer from './utils/DevDrawer';
import { Paper } from '@mantine/core';

function App() {
  const [visible, setVisible] = useState<boolean>(isEnvBrowser());
  const [page, setPage] = useState<string>('identity')

  useNuiEvent('setVisible', (data: { visible?: boolean, page?: string }) => {
    setVisible(data.visible || false);
    if (data.page) setPage(data.page);
  });

  return (
    <>
      {visible && (
        <div className="nui-wrapper">
          {page === 'identity' && <Identity />}
          {page === 'multichar' && <Paper style={{padding: 10}}>"MultiChar"</Paper>}
        </div>
      )}
      {isEnvBrowser() && <DevDrawer page={page} setPage={setPage} />}
    </>
  );
}

export default App;
