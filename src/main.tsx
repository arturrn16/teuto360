
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Force strict mode to help catch potential issues
createRoot(document.getElementById("root")!).render(
  <App />
);
