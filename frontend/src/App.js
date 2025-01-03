import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import MapViewer from './pages/MapViewer';
import MapEditor from './pages/MapEditor';
import AddTopic from './pages/AddTopic';
import TopicDetails from './pages/TopicDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import BubbleMap from './components/BubbleMap';
import NotFound from './pages/NotFound'; // Create this component for 404 handling

function ProtectedRoutes() {
  return (
    <ProtectedRoute>
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/map/:mapId" element={<MapViewer />} />
        <Route path="/map-editor/:mapId?" element={<MapEditor />} />
        <Route path="/bubble-map" element={<BubbleMap />} />
        <Route path="/add-topic/:mapId/:bubbleId" element={<AddTopic />} />
        <Route path="/topic-details/:mapId/:bubbleId" element={<TopicDetails />} />
        {/* Protected 404 route for unmatched paths */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route path="/*" element={<ProtectedRoutes />} />

        {/* Global 404 route for unmatched public paths */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
