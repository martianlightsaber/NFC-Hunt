import './App.css'
//import WelcomeScreen from './components/WelcomeScreen'
import OpeningStoryScreen from './components/OpeningStoryScreen'
import { Route, Routes } from 'react-router-dom'
import { missions } from './data/missions'
import NfcTokenActivation from './components/NfcTokenActivation'
import MissionRoute from './components/MissionRoute'
import GhostWelcomeScreen from './components/GhostWelcomeScreen'
import GhostOpeningStory from './components/GhostOpeningStory'
import GhostMissionRoute from './components/GhostMissionRoute'

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<GhostWelcomeScreen />}
        //element={
        //  <SceneLayout backgroundImage="/images/foggyforest.jpg">
        //    <DialoguePlayer key="opening" dialogue={openingStory} />
        //  </SceneLayout>
        //}
      />

      <Route
        path="/opening"
          element={<GhostOpeningStory />}
      />

      {Object.entries(missions).map(([missionId, mission]) => (
        <Route
          key={missionId}
          path={`/${missionId}`}
          element={
            <GhostMissionRoute
              missionId={missionId}
              mission={mission}
            />
          }
        />
      ))}

      <Route
        path="/booth/:token"
        element={<NfcTokenActivation routeKind="booth" />}
      />

      <Route
        path="/collect/:token"
        element={<NfcTokenActivation routeKind="collect" />}
      />

      <Route
        path="/bootstrap/:token"
        element={<NfcTokenActivation routeKind="bootstrap" />}
      />
    </Routes>
  )
}

export default App