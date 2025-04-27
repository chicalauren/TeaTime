import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>🍵 Tea Time🍵 </h1>
      <p> Welcome to the Tea Time! </p>
      <Link to="/dashboard">Go to Dashboard</Link>
    </div>
  );
}

export default Home;
