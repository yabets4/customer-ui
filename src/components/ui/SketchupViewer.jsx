import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { useLoader } from '@react-three/fiber'
import { useEffect } from 'react'
import * as THREE from 'three'

export default function ObjViewer({ objUrl }) {
  const obj = useLoader(OBJLoader, objUrl)

  // Apply material to each mesh
  useEffect(() => {
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: '#ff7f50',     // Coral color
          roughness: 0.5,
          metalness: 0.2,
        })
      }
    })
  }, [obj])

  return (
    <div className="w-[90vw] sm:w-[60vw] md:w-[500px] h-[400px] sm:h-[500px] md:h-[600px] border-8 border-amber-600"
>
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 10]} />
        <primitive object={obj} />
        <OrbitControls />
      </Canvas>
    </div>
  )
}
