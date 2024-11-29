"use client"

import React, { useRef, Suspense, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, useGLTF, Environment, Loader } from '@react-three/drei'
import * as THREE from 'three'

interface ModelProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
}

const Model: React.FC<ModelProps> = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) => {
  const { scene } = useGLTF('/3DModels/morning_town.glb')
  const modelRef = useRef<THREE.Group>(null)

  useEffect(() => {
    // Restaurar colores sin hacerlos demasiado oscuros
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const material = child.material as THREE.MeshStandardMaterial
        // Usamos colores más equilibrados
        material.color.setHex(0x888888)  // Color más neutral y menos saturado
        material.emissive.set("#222222")  // Emisión tenue
        material.emissiveIntensity = 0.1  // Emisión muy sutil
        material.needsUpdate = true
      }
    })
  }, [scene]) // Solo se ejecuta una vez después de cargar el modelo

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.001 // Rotación más lenta
    }
  })

  return (
    <group
      position={position}
      rotation={rotation}
      scale={[scale, scale, scale]}
      ref={modelRef}
    >
      <primitive object={scene} />
    </group>
  )
}

interface ThreeDModelProps {
  width?: string
  height?: string
  className?: string
  modelProps?: ModelProps
}

const ThreeDModel: React.FC<ThreeDModelProps> = ({ 
  width = '100%', 
  height = '100%', 
  className = '', 
  modelProps = {} 
}) => {
  return (
    <div style={{ width, height }} className={className}>
      <Canvas style={{ background: 'transparent' }}>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 10, 35]} />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            rotateSpeed={0.5}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
          />
          
          <ambientLight intensity={0.4} color="#ffffff" />  {/* Luz ambiental moderada */}
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={0.7}  // Luz direccional más suave
            color="#ffffff" 
            castShadow
            shadow-mapSize-width={2048} 
            shadow-mapSize-height={2048}
            shadow-bias={-0.0001}
          />
          <spotLight 
            position={[0, 15, 10]} 
            intensity={0.4}  // Menos intensidad de luz para suavizar sombras
            angle={0.6} 
            penumbra={0.5} 
            color="#ffffff" 
            castShadow
            shadow-mapSize-width={2048} 
            shadow-mapSize-height={2048}
            shadow-bias={-0.0001}
          />

          <Model {...modelProps} />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
      <Loader />
    </div>
  )
}

export default ThreeDModel
