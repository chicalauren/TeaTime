import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AddTeaForm from "./pages/AddTeaForm";
import TeaList from "./pages/TeaList";
import TeaDetail from "./pages/TeaDetail";
import EditTeaForm from "./pages/EditTeaForm";
import SpillTheTea from "./pages/SpillTheTea";
import TeaTimer from "./pages/TeaTimer";
import Favorites from "./pages/Favorites";
import UserProfile from "./pages/UserProfile.tsx";
import Friends from "./pages/Friends";

const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Navbar />
        <main style={{ paddingTop: "64px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route
              path="/add-tea"
              element={
                <ProtectedRoute>
                  <AddTeaForm />
                </ProtectedRoute>
              }
            />
            <Route path="/teas/:id" element={<TeaDetail />} />
            <Route path="/teas" element={<TeaList />} />
            <Route path="/teas/:id" element={<TeaDetail />} />
            <Route path="/edit-tea/:id" element={<EditTeaForm />} />
            <Route path="/spill" element={<SpillTheTea />} />
            <Route path="/teatimer" element={<TeaTimer />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
            <Route path="/user/:username" element={<UserProfile />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </Router>
    </ApolloProvider>
  );
}

export default App;
