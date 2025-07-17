import { useEffect, useRef, useState } from 'react'

export default function ARModelViewer({
  src = '/models/sample.glb',
  iosSrc, // e.g. /models/sample.usdz
  poster = '/images/poster.png',
  alt = '3D model',
  ar = true,
  autoRotate = true,
  cameraControls = true,
  shadowIntensity = 1,
  style = { width: '100%', height: '600px' }
}) {
  const viewerRef = useRef()
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return

    const handleLoad = () => {
      setIsLoading(false)
      setHasError(false)
    }

    const handleError = () => {
      setIsLoading(false)
      setHasError(true)
    }

    viewer.addEventListener('load', handleLoad)
    viewer.addEventListener('error', handleError)

    return () => {
      viewer.removeEventListener('load', handleLoad)
      viewer.removeEventListener('error', handleError)
    }
  }, [])

  return (
    <div className="relative w-full" style={style}>
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
          <p className="text-gray-600">Loading 3D Model...</p>
        </div>
      )}

      {hasError ? (
        <div className="flex items-center justify-center w-full h-full bg-red-50 text-red-700 rounded-md p-4">
          ⚠️ Failed to load 3D model.
        </div>
      ) : (
        <model-viewer
          ref={viewerRef}
          src={src}
          ios-src={iosSrc}
          ar={ar}
          ar-modes="webxr scene-viewer quick-look"
          auto-rotate={autoRotate}
          camera-controls={cameraControls}
          shadow-intensity={shadowIntensity}
          alt={alt}
          poster={poster}
          style={{ width: '100%', height: '100%' }}
        />
      )}
    </div>
  )
}
