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
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Viewing a Map: /map/:mapId must include a valid mapId to fetch */}
        <Route
          path="/map/:mapId"
          element={
            <ProtectedRoute>
              <MapViewer />
            </ProtectedRoute>
          }
        />

        {/* Editing or creating a map: /map-editor/:mapId? mapId is optional */}
        <Route
          path="/map-editor/:mapId?"
          element={
            <ProtectedRoute>
              <MapEditor />
            </ProtectedRoute>
          }
        />
  
          {/* BubbleMap route */} 
        <Route
          path="/bubble-map"
          element={
            <ProtectedRoute>
              <BubbleMap />
            </ProtectedRoute>
          }
        />
      {/* AddTopic route */}
        <Route
          path="/add-topic/:mapId/:bubbleId"
          element={<ProtectedRoute><AddTopic/></ProtectedRoute>}
        />
      {/* TopicDetails route */}
        <Route
          path="/topic-details/:mapId/:bubbleId"
          element={<ProtectedRoute><TopicDetails/></ProtectedRoute>}
        />
      </Routes>
    </>
  );
}

export default App;
