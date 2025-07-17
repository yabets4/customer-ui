// src/components/ARCanvas.jsx
import { useEffect } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { ARButton } from 'three/examples/jsm/webxr/ARButton'

export default function ARCanvas({ modelPath = '/models/chair.glb' }) {
  useEffect(() => {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera()

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.xr.enabled = true
    document.body.appendChild(renderer.domElement)

    document.body.appendChild(ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] }))

    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1)
    light.position.set(0.5, 1, 0.25)
    scene.add(light)

    const loader = new GLTFLoader()
    loader.load(modelPath, (gltf) => {
      const model = gltf.scene
      model.scale.set(0.5, 0.5, 0.5)
      scene.add(model)
    })

    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera)
    })

    return () => {
      document.body.removeChild(renderer.domElement)
      const button = document.querySelector('button.webxr-button')
      if (button) button.remove()
    }
  }, [modelPath])

  return null // No DOM output, we append directly to <body>
}
