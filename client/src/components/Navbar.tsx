import { Link, useNavigate } from 'react-router-dom';
import { getToken, removeToken } from '../utils/auth';

function Navbar() {
  const navigate = useNavigate();
  const token = getToken();

  const handleLogout = () => {
    removeToken();
    navigate('/');
  };

  return (
    <nav>
      <Link to="/dashboard">Dashboad</Link> | 
      {token ? (
        <>
          <Link to="/spill">🫖Social</Link> |
          <Link to="/teatimer">⏲️Tea Timer</Link> |
          <Link to="/profile">Profile</Link> | 
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link> | 
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
