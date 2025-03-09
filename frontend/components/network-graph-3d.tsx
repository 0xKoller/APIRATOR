"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Html } from "@react-three/drei"
import { motion } from "framer-motion-3d"

interface NetworkGraph3DProps {
  targetPerson: {
    name: string
    company: string
    avatar: string
  }
  contacts: Array<{
    id: number
    name: string
    connectionStrength: number
    avatar: string
    mutualConnections: number
  }>
  recommended: Array<{
    id: number
    name: string
    connectionStrength: number
    avatar: string
    connectVia: string
  }>
}

export default function NetworkGraph3D({ targetPerson, contacts, recommended }: NetworkGraph3DProps) {
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 15], fov: 50 }}>
      <color attach="background" args={["#f9fafb"]} />
      <ambientLight intensity={0.4} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <Suspense fallback={null}>
        <NetworkScene targetPerson={targetPerson} contacts={contacts} recommended={recommended} />
      </Suspense>
      <OrbitControls
        makeDefault
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={30}
      />
    </Canvas>
  )
}

function NetworkScene({ targetPerson, contacts, recommended }: NetworkGraph3DProps) {
  // Calculate positions in a 3D space
  const radius = 5

  return (
    <group>
      {/* Target person (center) */}
      <Node
        position={[0, 0, 0]}
        color="#4f46e5"
        size={1}
        name={targetPerson.name}
        avatar={targetPerson.avatar}
        isTarget={true}
      />

      {/* Primary contacts */}
      {contacts.map((contact, i) => {
        const angle = (i / contacts.length) * Math.PI * 2
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const y = (Math.random() - 0.5) * 3

        return (
          <group key={contact.id}>
            {/* Connection line */}
            <Line start={[0, 0, 0]} end={[x, y, z]} color="#4f46e5" opacity={contact.connectionStrength / 100} />

            {/* Contact node */}
            <Node
              position={[x, y, z]}
              color="#0ea5e9"
              size={0.7}
              name={contact.name}
              avatar={contact.avatar}
              strength={contact.connectionStrength}
              delay={i * 0.1}
            />
          </group>
        )
      })}

      {/* Ambient particles */}
      {[...Array(20)].map((_, i) => {
        const theta = Math.random() * Math.PI * 2
        const phi = Math.random() * Math.PI
        const r = 10 + Math.random() * 10

        const x = r * Math.sin(phi) * Math.cos(theta)
        const y = r * Math.sin(phi) * Math.sin(theta)
        const z = r * Math.cos(phi)

        return (
          <Particle
            key={i}
            position={[x, y, z]}
            color={Math.random() > 0.5 ? "#4f46e5" : "#0ea5e9"}
            size={Math.random() * 0.1 + 0.05}
            delay={Math.random() * 2}
          />
        )
      })}
    </group>
  )
}

function Node({ position, color, size, name, avatar, strength, isTarget = false, delay = 0 }) {
  return (
    <motion.group position={position} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay }}>
      <mesh>
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>

      <Html position={[0, size * 1.5, 0]} center style={{ width: isTarget ? "120px" : "100px" }}>
        <div className="text-center">
          <div
            className={`${isTarget ? "w-10 h-10" : "w-8 h-8"} rounded-full mx-auto overflow-hidden border ${isTarget ? "border-indigo-400 bg-indigo-50" : "border-sky-400 bg-sky-50"}`}
          >
            <img src={avatar || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
          </div>
          <div className={`mt-1 text-gray-900 ${isTarget ? "text-sm font-medium" : "text-xs"}`}>{name}</div>
          {strength && <div className="text-sky-600 text-xs">{strength}%</div>}
        </div>
      </Html>
    </motion.group>
  )
}

function Line({ start, end, color, opacity = 1 }) {
  return (
    <motion.line initial={{ visible: false }} animate={{ visible: true }}>
      <lineBasicMaterial attach="material" color={color} opacity={opacity} transparent />
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attachObject={["attributes", "position"]}
          count={2}
          array={new Float32Array([...start, ...end])}
          itemSize={3}
        />
      </bufferGeometry>
    </motion.line>
  )
}

function Particle({ position, color, size, delay = 0 }) {
  return (
    <motion.mesh position={position} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay }}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshBasicMaterial color={color} opacity={0.5} transparent />
    </motion.mesh>
  )
}

