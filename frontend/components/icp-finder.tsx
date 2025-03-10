"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  useIcpFinderStore,
  IcpProfile,
  icpProfileSchema,
} from "@/store/icp-finder-store";
import { useTabStore } from "@/store/tab-store";
import { useHistoryStore } from "@/store/history";
import { useNetworkFinderStore } from "@/store/network-finder-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { mockIcpProfiles } from "@/client/mock-icp-profiles";
import { ZodError } from "zod";

export default function IcpFinder() {
  const {
    step,
    results,
    icpCriteria,
    setStep,
    setResults,
    setSelectedProfile,
    setIcpCriteria,
    updateTargetingCriteria,
  } = useIcpFinderStore();

  const { setSelectedTab } = useTabStore();
  const { setUrl } = useNetworkFinderStore();

  // Add searchingStep state
  const [searchingStep, setSearchingStep] = useState(0);

  // Add validation errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // History store
  const { addSearch } = useHistoryStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate the ICP criteria
      icpProfileSchema.parse(icpCriteria);
      setErrors({});

      // Move to searching step and reset searching step
      setStep("searching");
      setSearchingStep(0);

      // Simulate API call with mock data
      setSearchingStep(1); // Fetching profiles
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSearchingStep(2); // Profiles found
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSearchingStep(3); // Analyzing matches
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSearchingStep(4); // Preparing results
      setResults(mockIcpProfiles);
      setStep("results");

      // Add to history
      addSearch({
        type: "icp",
        query: icpCriteria.name,
        result: mockIcpProfiles,
      });
    } catch (error: unknown) {
      // Handle Zod validation errors
      if (error instanceof ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join(".");
          formattedErrors[path] = err.message;
        });
        setErrors(formattedErrors);
      }
      console.error("Error:", error);
    }
  };

  const handleProfileClick = (profile: IcpProfile) => {
    setSelectedProfile(profile);

    // Navigate to the Person tab with this profile info
    setSelectedTab("person");

    // Set the search query in the network finder
    setUrl(profile.name);
  };

  return (
    <div className="relative space-y-6">
      {/* Subtle background effects */}
      <div
        className="absolute -inset-40 bg-blue-50 rounded-full blur-3xl opacity-30 animate-pulse -z-10"
        style={{
          top: "30%",
          left: "20%",
          animationDuration: "15s",
        }}
      />
      <div
        className="absolute -inset-40 bg-indigo-50 rounded-full blur-3xl opacity-30 animate-pulse -z-10"
        style={{
          top: "60%",
          right: "10%",
          animationDuration: "18s",
          animationDelay: "2s",
        }}
      />

      <AnimatePresence mode="wait">
        {step === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className="max-w-4xl mx-auto p-8 rounded-2xl shadow-sm"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <h2 className="text-2xl font-semibold text-gray-900">
                  Define Your Ideal Customer Profile
                </h2>
                <p className="text-gray-500 text-sm">
                  Specify the criteria for your ideal customer profile to
                  discover matching profiles
                </p>
              </motion.div>

              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">
                      ICP Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={icpCriteria.name}
                      onChange={(e) => setIcpCriteria({ name: e.target.value })}
                      placeholder="e.g., Tech Decision Makers"
                      className="mt-1 py-2 rounded-lg"
                    />
                    {errors["name"] && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors["name"]}
                      </p>
                    )}
                  </div>

                  <Accordion
                    type="single"
                    defaultValue="targeting-criteria"
                    className="w-full border rounded-lg"
                  >
                    <AccordionItem value="targeting-criteria">
                      <AccordionTrigger className="px-4">
                        Targeting Criteria
                      </AccordionTrigger>
                      <AccordionContent className="p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="description">Description</Label>
                            <Input
                              id="description"
                              value={
                                icpCriteria.targeting_criteria.description || ""
                              }
                              onChange={(e) =>
                                updateTargetingCriteria({
                                  description: e.target.value,
                                })
                              }
                              placeholder="General profile description"
                              className="mt-1 py-2 rounded-lg"
                            />
                          </div>

                          <div>
                            <Label htmlFor="location">Location</Label>
                            <Input
                              id="location"
                              value={
                                icpCriteria.targeting_criteria.location || ""
                              }
                              onChange={(e) =>
                                updateTargetingCriteria({
                                  location: e.target.value,
                                })
                              }
                              placeholder="e.g., San Francisco, CA"
                              className="mt-1 py-2 rounded-lg"
                            />
                          </div>

                          <div>
                            <Label htmlFor="currentRole">Current Role</Label>
                            <Input
                              id="currentRole"
                              value={
                                icpCriteria.targeting_criteria.currentRole || ""
                              }
                              onChange={(e) =>
                                updateTargetingCriteria({
                                  currentRole: e.target.value,
                                })
                              }
                              placeholder="e.g., Product Manager"
                              className="mt-1 py-2 rounded-lg"
                            />
                          </div>

                          <div>
                            <Label htmlFor="education">Education</Label>
                            <Input
                              id="education"
                              value={
                                icpCriteria.targeting_criteria.education || ""
                              }
                              onChange={(e) =>
                                updateTargetingCriteria({
                                  education: e.target.value,
                                })
                              }
                              placeholder="e.g., MBA, Computer Science"
                              className="mt-1 py-2 rounded-lg"
                            />
                          </div>

                          <div>
                            <Label htmlFor="languages">Languages</Label>
                            <Input
                              id="languages"
                              value={
                                icpCriteria.targeting_criteria.languages || ""
                              }
                              onChange={(e) =>
                                updateTargetingCriteria({
                                  languages: e.target.value,
                                })
                              }
                              placeholder="e.g., English, Spanish"
                              className="mt-1 py-2 rounded-lg"
                            />
                          </div>

                          <div>
                            <Label htmlFor="skills">Skills</Label>
                            <Input
                              id="skills"
                              value={
                                icpCriteria.targeting_criteria.skills || ""
                              }
                              onChange={(e) =>
                                updateTargetingCriteria({
                                  skills: e.target.value,
                                })
                              }
                              placeholder="e.g., JavaScript, Marketing, Analytics"
                              className="mt-1 py-2 rounded-lg"
                            />
                          </div>

                          <div>
                            <Label htmlFor="postsTopics">Post Topics</Label>
                            <Input
                              id="postsTopics"
                              value={
                                icpCriteria.targeting_criteria.postsTopics || ""
                              }
                              onChange={(e) =>
                                updateTargetingCriteria({
                                  postsTopics: e.target.value,
                                })
                              }
                              placeholder="e.g., AI, SaaS, Leadership"
                              className="mt-1 py-2 rounded-lg"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <Label htmlFor="minFollowerCount">
                              Min Follower Count
                            </Label>
                            <Input
                              id="minFollowerCount"
                              type="text"
                              inputMode="numeric"
                              value={
                                icpCriteria.targeting_criteria
                                  .minFollowerCount || ""
                              }
                              onChange={(e) =>
                                updateTargetingCriteria({
                                  minFollowerCount: e.target.value,
                                })
                              }
                              placeholder="e.g., 1000"
                              className="mt-1 py-2 rounded-lg"
                            />
                          </div>

                          <div>
                            <Label htmlFor="maxFollowerCount">
                              Max Follower Count
                            </Label>
                            <Input
                              id="maxFollowerCount"
                              type="text"
                              inputMode="numeric"
                              value={
                                icpCriteria.targeting_criteria
                                  .maxFollowerCount || ""
                              }
                              onChange={(e) =>
                                updateTargetingCriteria({
                                  maxFollowerCount: e.target.value,
                                })
                              }
                              placeholder="e.g., 10000"
                              className="mt-1 py-2 rounded-lg"
                            />
                          </div>

                          <div>
                            <Label htmlFor="minAverageInteractionPerPostCount">
                              Min Avg Interaction Per Post
                            </Label>
                            <Input
                              id="minAverageInteractionPerPostCount"
                              type="text"
                              inputMode="numeric"
                              value={
                                icpCriteria.targeting_criteria
                                  .minAverageInteractionPerPostCount || ""
                              }
                              onChange={(e) =>
                                updateTargetingCriteria({
                                  minAverageInteractionPerPostCount:
                                    e.target.value,
                                })
                              }
                              placeholder="e.g., 50"
                              className="mt-1 py-2 rounded-lg"
                            />
                          </div>

                          <div>
                            <Label htmlFor="maxAverageInteractionPerPostCount">
                              Max Avg Interaction Per Post
                            </Label>
                            <Input
                              id="maxAverageInteractionPerPostCount"
                              type="text"
                              inputMode="numeric"
                              value={
                                icpCriteria.targeting_criteria
                                  .maxAverageInteractionPerPostCount || ""
                              }
                              onChange={(e) =>
                                updateTargetingCriteria({
                                  maxAverageInteractionPerPostCount:
                                    e.target.value,
                                })
                              }
                              placeholder="e.g., 500"
                              className="mt-1 py-2 rounded-lg"
                            />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6"
                  >
                    Find Matching Profiles
                  </Button>
                </div>
              </motion.div>
            </form>
          </motion.div>
        )}

        {step === "searching" && (
          <motion.div
            key="searching"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className="max-w-2xl mx-auto p-6 rounded-xl"
          >
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Analyzing profiles
                </h2>
                <AnimatePresence mode="wait">
                  {[
                    "Initializing analysis...",
                    "Fetching profiles...",
                    "Profiles found, analyzing...",
                    "Matching criteria...",
                    "Preparing results...",
                  ].map((text, i) => (
                    <motion.p
                      key={text}
                      className="text-gray-600 text-sm"
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

              <div className="flex items-center justify-center py-16">
                <motion.div className="relative">
                  <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="h-12 w-12 text-gray-400" />
                  </div>

                  {/* Animated rings */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full"
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
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className="max-w-4xl mx-auto"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Matching Profiles
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                We found {results.length} profiles matching your ICP criteria.
                Click on any profile to start a search.
              </p>
            </div>

            <div className="space-y-4">
              {results.map((profile, index) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.15 }}
                >
                  <Card
                    className={cn(
                      "hover:shadow-md transition-all overflow-hidden cursor-pointer",
                      index === 0
                        ? "border-blue-200 bg-gradient-to-r from-blue-50 to-white"
                        : ""
                    )}
                    onClick={() => handleProfileClick(profile)}
                  >
                    <CardContent className="p-0">
                      <div className="flex items-start p-4">
                        <Avatar className="h-12 w-12 mr-4 flex-shrink-0">
                          <AvatarImage
                            src={profile.avatar}
                            alt={profile.name}
                          />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {profile.name.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <h3 className="font-medium text-lg text-black">
                                {profile.name}
                              </h3>
                              <p className="text-gray-600 text-sm mt-1">
                                {profile.role} • {profile.location}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "px-3 py-1 rounded-full text-sm font-medium",
                                  profile.matchScore >= 90
                                    ? "bg-green-100 text-green-800"
                                    : profile.matchScore >= 75
                                    ? "bg-blue-100 text-blue-800"
                                    : profile.matchScore >= 60
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                                )}
                              >
                                {profile.matchScore}% match
                              </div>
                              <ChevronRight className="text-gray-400" />
                            </div>
                          </div>

                          <div className="mt-3">
                            <p className="text-gray-700 text-sm">
                              {profile.description}
                            </p>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {profile.skills?.split(", ").map((skill, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>

                          <div className="mt-4 text-sm text-gray-500 border-t pt-3">
                            <p>{profile.matchReason}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
