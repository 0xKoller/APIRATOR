"use client";

import React from "react";

import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Network, AlertTriangle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Dynamically import Three.js components with no SSR to avoid hydration issues
const NetworkGraph3D = dynamic(() => import("./network-graph-3d"), {
  ssr: false,
  loading: () => <NetworkGraphLoading />,
});

interface NetworkGraphProps {
  targetPerson: {
    name: string;
    company: string;
    avatar: string;
  };
  contacts: Array<{
    id: number;
    name: string;
    connectionStrength: number;
    avatar: string;
    mutualConnections: number;
  }>;
  recommended: Array<{
    id: number;
    name: string;
    connectionStrength: number;
    avatar: string;
    connectVia: string;
  }>;
}

export default function NetworkGraph(props: NetworkGraphProps) {
  const [has3DError, setHas3DError] = useState(false);

  // If there's an error with 3D rendering, show the 2D fallback
  useEffect(() => {
    const handleError = () => {
      setHas3DError(true);
    };

    window.addEventListener("error", handleError);

    return () => {
      window.removeEventListener("error", handleError);
    };
  }, []);

  if (has3DError) {
    return <NetworkGraph2D {...props} />;
  }

  return (
    <div className="w-full h-full relative">
      <ErrorBoundary fallback={<NetworkGraph2D {...props} />}>
        <Suspense fallback={<NetworkGraphLoading />}>
          <NetworkGraph3D {...props} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

// Loading state while the 3D graph is being loaded
function NetworkGraphLoading() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white">
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: {
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          },
          scale: {
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          },
        }}
        className="w-16 h-16 mb-4 text-indigo-500"
      >
        <Network className="w-16 h-16" />
      </motion.div>
      <p className="text-gray-600">Loading network visualization...</p>
    </div>
  );
}

// 2D fallback visualization that doesn't use Three.js
function NetworkGraph2D({
  targetPerson,
  contacts,
  recommended,
}: NetworkGraphProps) {
  return (
    <div className="w-full h-full p-6 overflow-auto bg-white">
      <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <div className="flex items-center gap-4 mb-4">
          <AlertTriangle className="text-amber-500 w-5 h-5" />
          <p className="text-gray-700">
            3D visualization couldn't be loaded. Showing simplified network view
            instead.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center mb-8">
        <Avatar className="h-20 w-20 border-2 border-indigo-200 mb-2">
          <AvatarImage src={targetPerson.avatar} alt={targetPerson.name} />
          <AvatarFallback className="bg-gray-100 text-indigo-600">
            {targetPerson.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <h3 className="text-lg font-medium text-gray-900">
          {targetPerson.name}
        </h3>
        <p className="text-gray-600 text-sm">{targetPerson.company}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.map((contact, index) => (
          <motion.div
            key={contact.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="p-4 border border-gray-200 rounded-lg bg-gray-50"
          >
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-10 w-10 border border-gray-200">
                <AvatarImage src={contact.avatar} alt={contact.name} />
                <AvatarFallback className="bg-gray-100">
                  {contact.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium text-gray-900">{contact.name}</h4>
                <div className="text-xs text-sky-600">
                  {contact.connectionStrength}% match
                </div>
              </div>
            </div>

            <div className="h-1 w-full bg-gray-200 rounded-full mb-3">
              <motion.div
                className="h-full bg-indigo-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${contact.connectionStrength}%` }}
                transition={{ duration: 1 }}
              />
            </div>

            <div className="text-xs text-gray-600">
              {contact.mutualConnections} amount of interactions
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Simple error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
