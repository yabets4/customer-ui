import { useState } from 'react'
import ARCanvas from '../components/ui/ARCanvas'

export default function Home() {
  const [startAR, setStartAR] = useState(false)

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Three.js + WebXR AR Viewer</h1>
      <button
        onClick={() => setStartAR(true)}
        className="px-6 py-3 bg-green-600 text-white rounded shadow"
      >
        Launch AR Mode
      </button>

      {startAR && <ARCanvas modelPath="/models/Mickey-Mouse.glb" />}
    </div>
  )
}