import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { installMotionFailsafe } from './motion/core/failsafe';
import './index.css';

// Red de seguridad global: si el bucle de fotogramas no vive, las animaciones
// no pueden devolver a la vista lo que han escondido. Ver failsafe.ts.
installMotionFailsafe();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
