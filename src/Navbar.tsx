import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{ display: 'flex', gap: '20px', padding: '15px', background: '#333', color: '#fff' }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>홈</Link>
      <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>로그인</Link>
      <Link to="/settings" style={{ color: 'white', textDecoration: 'none' }}>설정</Link>
    </nav>
  );
};

export default Navbar;