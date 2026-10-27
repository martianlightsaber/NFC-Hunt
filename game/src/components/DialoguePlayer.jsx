import { useState } from 'react'
import ChoiceList from './ChoiceList'
import DialogueBox from './DialogueBox'
import { useNavigate } from 'react-router-dom'

function DialoguePlayer({ dialogue }) {
  const [lineIndex, setLineIndex] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState(null)
  const currentLine = dialogue[lineIndex]
  const isLastLine = lineIndex === dialogue.length - 1
  const navigate = useNavigate()

  function advanceDialogue() {
    setLineIndex((index) => Math.min(index + 1, dialogue.length - 1))
  }

  function handleChoiceSelect(choice) {
    if (choice.id === 'mission-1') {
      navigate('/mission-1')
    return
  }

  setSelectedChoice(choice)
  }

  return (
    <section>
      <DialogueBox key={lineIndex} {...currentLine} />

      {currentLine.choices ? (
        selectedChoice ? (
          <p>You selected: {selectedChoice.label}</p>
        ) : (
          <ChoiceList
            choices={currentLine.choices}
            onSelect={handleChoiceSelect}
          />
        )
      ) : (
        <button
          type="button"
          onClick={advanceDialogue}
          disabled={isLastLine}
        >
          Tap to continue
        </button>
      )}
    </section>
  )
}

export default DialoguePlayer