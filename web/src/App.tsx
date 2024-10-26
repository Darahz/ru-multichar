import { useState } from 'react';
import { isEnvBrowser } from './utils/misc';
import { useNuiEvent } from './hooks/useNuiEvent';
import Identity from './pages/Identity';
import DevDrawer from './utils/devdrawer';

function App() {
  const [visible, setVisible] = useState<boolean>(isEnvBrowser());
  const [page, setPage] = useState<string>('identity')

  useNuiEvent('setVisible', (data: { visible?: boolean }) => {
    setVisible(data.visible || false);
  });

  return (
    <>
      {visible && (
        <div className="boilerplate-wrapper">
          {page === 'identity' && <Identity />}
        </div>
      )}
      {isEnvBrowser() && <DevDrawer page={page} setPage={setPage} />}
    </>
  );
}

export default App;
