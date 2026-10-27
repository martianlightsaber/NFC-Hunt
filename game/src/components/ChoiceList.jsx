import './ChoiceList.css'

function ChoiceList({ choices, onSelect }) {
  return (
    <div className="choice-list" aria-label="Choose a request">
      {choices.map((choice) => (
        <button
          key={choice.id}
          type="button"
          onClick={() => onSelect(choice)}
        >
          {choice.label}
        </button>
      ))}
    </div>
  )
}

export default ChoiceList