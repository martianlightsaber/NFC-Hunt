import './DialogueBox.css'
import { Fragment } from 'react'

function assetUrl(path) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`
}

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
              <img src={assetUrl(portrait)} alt={`${speaker || 'Character'} portrait`} />
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
        <p className="dialogue-text">
          {typeof text === 'string'
            ? text
            : text.map((part, index) => {
                let content = part.text

                if (part.italic) content = <em>{content}</em>
                if (part.bold) content = <strong>{content}</strong>

                return <Fragment key={index}>{content}</Fragment>
              })}
        </p>
      </div>
    </section>
  )
}

export default DialogueBox