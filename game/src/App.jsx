import './App.css'
import CategoryBootstrap from './components/CategoryBootstrap'
import WelcomeScreen from './components/WelcomeScreen'
import OpeningStoryScreen from './components/OpeningStoryScreen'
import CollectionActivation from './components/CollectionActivation'
import { Route, Routes } from 'react-router-dom'
import DialoguePlayer from './components/DialoguePlayer'
import SceneLayout from './components/SceneLayout'
import { missions } from './data/missions'

function App() {
  return (
    <Routes>
      <Route
        path="/bootstrap/:token"
        element={<CategoryBootstrap />}
      />
      <Route
        path="/"
        element={<WelcomeScreen />}
        //element={
        //  <SceneLayout backgroundImage="/images/foggyforest.jpg">
        //    <DialoguePlayer key="opening" dialogue={openingStory} />
        //  </SceneLayout>
        //}
      />

      <Route
        path="/opening"
          element={<OpeningStoryScreen />}
      />

      <Route
        path="/mission-1"
        element={
          <SceneLayout backgroundImage="/images/moonlitgarden.jpg">
            <DialoguePlayer
              key="mission-1"
              missionId="mission-1"
              dialogue={missions['mission-1'].dialogue}
              wrapUpDialogue={missions['mission-1'].wrapUpDialogue}
              collectible={missions['mission-1'].collectible}
            />
          </SceneLayout>
        }
      />

      <Route
        path="/collect/:token"
        element={<CollectionActivation />}
      />
    </Routes>
  )
}

export default App