import './styles/index.css';
import { NoticeProvider } from './context/NoticeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import Home from './pages/Home.jsx';

export default function App() {
  return (
    <NoticeProvider>
      <AuthProvider>
        <CartProvider>
          <Home />
        </CartProvider>
      </AuthProvider>
    </NoticeProvider>
  );
}
