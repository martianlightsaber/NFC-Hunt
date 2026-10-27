import './SceneLayout.css'

function SceneLayout({ backgroundImage, children }) {
  const style = backgroundImage
    ? { backgroundImage: `url("${backgroundImage}")` }
    : undefined

  return (
    <main className="scene-layout" style={style}>
      {children}
      <div className="orientation-warning" role="status">
        <p>Rotate your phone to portrait to continue.</p>
      </div>
    </main>
  )
}

export default SceneLayout