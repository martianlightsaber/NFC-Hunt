import './DialogueBox.css'

function DialogueBox({ text, speaker, portrait }) {
  const hasSpeaker = Boolean(speaker || portrait)

  return (
    <section
      className={`textbox-container${hasSpeaker ? ' has-portrait' : ''}`}
      aria-label={speaker ? `${speaker} speaking` : 'Narration'}
    >
      {hasSpeaker && (
        <div className="speaker-group">
          {portrait && (
            <div className="character-portrait">
              <img src={portrait} alt={`${speaker || 'Character'} portrait`} />
            </div>
          )}

          {speaker && (
            <div className="nameplate">
              <span>{speaker}</span>
            </div>
          )}
        </div>
      )}

      <div className="textbox-inner">
        <p className="dialogue-text">{text}</p>
      </div>
    </section>
  )
}

export default DialogueBox