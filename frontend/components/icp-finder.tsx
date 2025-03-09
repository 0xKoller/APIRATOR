"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useIcpFinderStore, IcpProfile } from "@/store/icp-finder-store";
import { useHistoryStore } from "@/store/history";

// Mock data for ICP profiles
const mockProfiles: IcpProfile[] = [
  {
    id: "1",
    name: "TechCorp Solutions",
    industry: "Software & Technology",
    size: "50-200 employees",
    revenue: "$10M-$50M",
    location: "San Francisco, CA",
    description: "B2B SaaS company focused on AI-powered analytics solutions",
    matchScore: 92,
    reason:
      "High match based on industry focus, company size, and revenue range. Similar target market and product offering.",
  },
  {
    id: "2",
    name: "DataFlow Analytics",
    industry: "Data Analytics",
    size: "20-50 employees",
    revenue: "$5M-$10M",
    location: "Boston, MA",
    description: "Data analytics platform for enterprise customers",
    matchScore: 85,
    reason:
      "Strong alignment in target market and technology stack. Growing company with similar expansion plans.",
  },
  {
    id: "3",
    name: "CloudScale Systems",
    industry: "Cloud Infrastructure",
    size: "100-500 employees",
    revenue: "$50M-$100M",
    location: "Austin, TX",
    description: "Cloud infrastructure and DevOps solutions provider",
    matchScore: 78,
    reason:
      "Complementary technology stack and enterprise focus. Slightly larger in size but similar growth trajectory.",
  },
];

export default function IcpFinder() {
  const {
    step,
    searchQuery,
    results,
    setStep,
    setSearchQuery,
    setCsvFile,
    setResults,
  } = useIcpFinderStore();

  // Add searchingStep state
  const [searchingStep, setSearchingStep] = useState(0);

  // History store
  const { addSearch } = useHistoryStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;

    // Move to searching step and reset searching step
    setStep("searching");
    setSearchingStep(0);

    try {
      // Simulate API call with mock data
      setSearchingStep(1); // Fetching profiles
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSearchingStep(2); // Profiles found
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSearchingStep(3); // Analyzing matches
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSearchingStep(4); // Preparing results
      setResults(mockProfiles);
      setStep("results");

      // Add to history
      addSearch({
        type: "icp",
        query: searchQuery,
        result: mockProfiles,
      });
    } catch (error) {
      console.error("Error:", error);
      // Handle error state
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      setStep("input");
    }
  };

  return (
    <div className='relative space-y-6'>
      {/* Subtle background effects */}
      <div
        className='absolute -inset-40 bg-blue-50 rounded-full blur-3xl opacity-30 animate-pulse -z-10'
        style={{
          top: "30%",
          left: "20%",
          animationDuration: "15s",
        }}
      />
      <div
        className='absolute -inset-40 bg-indigo-50 rounded-full blur-3xl opacity-30 animate-pulse -z-10'
        style={{
          top: "60%",
          right: "10%",
          animationDuration: "18s",
          animationDelay: "2s",
        }}
      />

      <AnimatePresence mode='wait'>
        {step === "upload" && (
          <motion.div
            key='upload'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className='max-w-2xl mx-auto p-8 rounded-2xl shadow-sm'
          >
            <div className='mb-12'>
              <h1 className='text-2xl font-bold text-indigo-600'>ICP Finder</h1>
            </div>

            <div className='space-y-8 text-center'>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className='space-y-2'
              >
                <h2 className='text-2xl font-semibold text-gray-900'>
                  Import your customer data
                </h2>
                <p className='text-gray-500 text-sm'>
                  Upload a CSV file with your customer data or use our example
                  data
                </p>
              </motion.div>

              <div className='space-y-4'>
                <input
                  type='file'
                  accept='.csv'
                  onChange={handleFileUpload}
                  className='hidden'
                  id='csv-upload'
                />
                <div className='grid gap-4'>
                  <Button
                    variant='outline'
                    onClick={() =>
                      document.getElementById("csv-upload")?.click()
                    }
                    className='h-24 rounded-xl border-dashed'
                  >
                    <div className='flex flex-col items-center justify-center'>
                      <Building2 className='h-8 w-8 mb-2 text-gray-400' />
                      <span className='text-sm text-gray-600'>Upload CSV</span>
                    </div>
                  </Button>
                  <Button
                    variant='ghost'
                    onClick={() => setStep("input")}
                    className='text-sm text-gray-500'
                  >
                    Use example data
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === "input" && (
          <motion.div
            key='input'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className='max-w-2xl mx-auto p-8 rounded-2xl shadow-sm'
          >
            <div className='mb-12'>
              <h1 className='text-2xl font-bold text-indigo-600'>ICP Finder</h1>
            </div>

            <form onSubmit={handleSubmit} className='space-y-8 text-center'>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className='space-y-2'
              >
                <h2 className='text-2xl font-semibold text-gray-900'>
                  Find your Ideal Customer Profile
                </h2>
                <p className='text-gray-500 text-sm'>
                  Enter your target market characteristics to discover matching
                  profiles
                </p>
              </motion.div>

              <motion.div
                className='space-y-4'
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className='relative'>
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder='e.g., B2B SaaS companies in California with 50-200 employees'
                    className='py-6 pr-14 rounded-xl text-gray-900 placeholder:text-gray-500 focus-visible:ring-indigo-500 shadow-sm'
                  />
                  <Button
                    type='submit'
                    disabled={!searchQuery}
                    className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white h-10 w-10 rounded-full p-0 flex items-center justify-center shadow-sm transition-all'
                  >
                    <ArrowUp className='h-5 w-5' />
                  </Button>
                </div>
              </motion.div>
            </form>
          </motion.div>
        )}

        {step === "searching" && (
          <motion.div
            key='searching'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className='max-w-2xl mx-auto p-6 rounded-xl'
          >
            <div className='space-y-6'>
              <div className='space-y-2 text-center'>
                <h2 className='text-xl font-semibold text-gray-900'>
                  Analyzing customer profiles
                </h2>
                <AnimatePresence mode='wait'>
                  {[
                    "Initializing analysis...",
                    "Fetching company profiles...",
                    "Profiles found, analyzing...",
                    "Matching criteria...",
                    "Preparing results...",
                  ].map((text, i) => (
                    <motion.p
                      key={text}
                      className='text-gray-600 text-sm'
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5 }}
                      style={{
                        display: searchingStep === i ? "block" : "none",
                      }}
                    >
                      {text}
                    </motion.p>
                  ))}
                </AnimatePresence>
              </div>

              <div className='flex items-center justify-center py-16'>
                <motion.div className='relative'>
                  <div className='h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center'>
                    <Building2 className='h-12 w-12 text-gray-400' />
                  </div>

                  {/* Animated rings */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className='absolute rounded-full'
                      style={{ inset: `-${(i + 1) * 20}px` }}
                      initial={{ opacity: 0.3, scale: 0.8 }}
                      animate={{
                        opacity: [0.3, 0.1, 0.3],
                        scale: [0.8, 1.2, 0.8],
                      }}
                      transition={{
                        duration: 3 + i,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                        delay: i * 0.4,
                      }}
                    />
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {step === "results" && (
          <motion.div
            key='results'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className='max-w-2xl mx-auto'
          >
            <div className='space-y-4'>
              {results.map((profile, index) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.15 }}
                >
                  <div
                    className={cn(
                      "p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all",
                      index === 0
                        ? "bg-gradient-to-r from-blue-50 to-white border-l-4 border-blue-500"
                        : ""
                    )}
                  >
                    <div className='flex items-start gap-4'>
                      <div className='h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0'>
                        <Building2 className='h-6 w-6 text-blue-600' />
                      </div>

                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center justify-between gap-2'>
                          <div>
                            <h3 className='font-medium text-lg text-black'>
                              {profile.name}
                            </h3>
                            <p className='text-gray-600 text-sm mt-1'>
                              {profile.industry} • {profile.size} •{" "}
                              {profile.location}
                            </p>
                          </div>
                          <div
                            className={cn(
                              "px-3 py-1 rounded-full text-sm font-medium",
                              index === 0
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            )}
                          >
                            {profile.matchScore}% match
                          </div>
                        </div>

                        <div className='mt-3'>
                          <p className='text-gray-700 text-sm'>
                            {profile.description}
                          </p>
                          <p className='text-gray-500 text-sm mt-2'>
                            {profile.reason}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
