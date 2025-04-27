import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>🏠 Home Page</h1>
      <p>Welcome to the home page!</p>
      <Link to="/dashboard">Go to Dashboard</Link>
    </div>
  );
}

export default Home;
