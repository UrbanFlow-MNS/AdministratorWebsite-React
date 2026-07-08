import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './router';
import { AuthGate } from './components/auth/AuthGate';

const App = () => (
  <BrowserRouter>
    <AuthGate>
      <AppRouter />
    </AuthGate>
  </BrowserRouter>
);

export default App;
