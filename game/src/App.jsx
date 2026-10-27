import './App.css'
import CategoryBootstrap from './components/CategoryBootstrap'
import WelcomeScreen from './components/WelcomeScreen'
import { Route, Routes } from 'react-router-dom'
import DialoguePlayer from './components/DialoguePlayer'
import SceneLayout from './components/SceneLayout'
import { missions } from './data/missions'
import { openingStory } from './data/openingStory'


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
        element={
          <SceneLayout backgroundImage="/images/foggyforest.jpg">
            <DialoguePlayer key="opening" dialogue={openingStory} />
          </SceneLayout>
        }
      />

      <Route
        path="/mission-1"
        element={
          <SceneLayout backgroundImage="/images/moonlitgarden.jpg">
            <DialoguePlayer key="mission-1" dialogue={missions['mission-1'].dialogue} />
          </SceneLayout>
        }
      />
    </Routes>
  )
}

export default App