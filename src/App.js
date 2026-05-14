import logo from './logo.svg';
import './App.css';
import Home from './component/Home';
import Login from './component/Login';
import Register from './component/Register';
import Listings from './component/Listings';
import PropertyDetails from './component/PropertyDetails';
import Compare from './component/Compare';
import UserDashboard from './component/UserDashboard';
import OwnerDashboard from './component/Ownerdashboard';
import Booking from "./component/Booking";
import Chat from './component/Chat';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/"              element={<Home />}           />
          <Route path="/login"         element={<Login />}          />
          <Route path="/register"      element={<Register />}       />
          <Route path="/listings"      element={<Listings />}       />
          <Route path="/property/:id"  element={<PropertyDetails />}/>
          <Route path="/compare"       element={<Compare />}        />
          <Route path="/userdashboard" element={<UserDashboard />}  />
          <Route path="/ownerdashboard"element={<OwnerDashboard />} />
          <Route path="/booking/:id" element={<Booking />} />
          <Route path="/chat"          element={<Chat/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
