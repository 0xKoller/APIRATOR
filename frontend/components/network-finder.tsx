"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { ArrowUp, Users, MessageCircle, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import axios from "axios";
import {
  useNetworkFinderStore,
  Contact,
  LinkedInInteraction,
} from "@/store/network-finder-store";
import { useHistoryStore } from "@/store/history";

// Mock data for contacts
const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Alex Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Product Manager at TechCorp",
    interactionCount: 27,
    lastInteraction: "2 days ago",
    connectionStrength: 92,
    reason:
      "Alex has exchanged 27 emails with Sam in the last month and they've attended 3 meetings together. They also share 5 mutual connections.",
    mutualConnections: 5,
    recentActivity: "Shared an article about AI in product management",
    recentInteractions: [],
  },
  {
    id: "2",
    name: "Jamie Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Engineering Lead at InnovateCo",
    interactionCount: 18,
    lastInteraction: "1 week ago",
    connectionStrength: 78,
    reason:
      "Jamie and Sam worked on a project together last year and have maintained regular contact. They've exchanged 18 messages and are both members of the same industry group.",
    mutualConnections: 3,
    recentActivity: "Commented on Sam's post about cloud architecture",
    recentInteractions: [],
  },
  {
    id: "3",
    name: "Taylor Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "VP of Marketing at GrowthInc",
    interactionCount: 12,
    lastInteraction: "3 weeks ago",
    connectionStrength: 65,
    reason:
      "Taylor and Sam have been connected for over 2 years. They've met at 3 industry conferences and have 7 mutual connections in common.",
    mutualConnections: 7,
    recentActivity: "Attended the same virtual conference last month",
    recentInteractions: [],
  },
];

export default function NetworkFinder() {
  const {
    step,
    url,
    csvFile,
    targetPerson,
    results,
    showIntroModal,
    selectedContact,
    introMessage,
    setStep,
    setUrl,
    setCsvFile,
    setTargetPerson,
    setResults,
    setShowIntroModal,
    setSelectedContact,
    setIntroMessage,
  } = useNetworkFinderStore();

  // Add searchingStep state
  const [searchingStep, setSearchingStep] = useState(0);

  // Mouse position for interactive effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Particle system ref
  const particlesRef = useRef<HTMLDivElement>(null);

  // History store
  const { addSearch } = useHistoryStore();

  // Update mouse position for interactive effects
  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);

    // Update particles if they exist
    if (particlesRef.current) {
      const rect = particlesRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Create a subtle glow effect where the mouse is
      const glowEffect = document.createElement("div");
      glowEffect.className =
        "absolute w-32 h-32 rounded-full bg-purple-500 opacity-10 pointer-events-none";
      glowEffect.style.left = `${x - 64}px`;
      glowEffect.style.top = `${y - 64}px`;
      glowEffect.style.transform = "scale(0)";
      particlesRef.current.appendChild(glowEffect);

      // Animate and remove
      setTimeout(() => {
        glowEffect.style.transition = "all 1s ease-out";
        glowEffect.style.transform = "scale(1)";
        glowEffect.style.opacity = "0";
        setTimeout(() => {
          if (particlesRef.current?.contains(glowEffect)) {
            particlesRef.current.removeChild(glowEffect);
          }
        }, 1000);
      }, 10);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    // Move to searching step and reset searching step
    setStep("searching");
    setSearchingStep(0);

    try {
      // Make API call to backend
      setSearchingStep(1); // Fetching profile
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/linkedin/profile`,
        {
          params: {
            url: url,
          },
        }
      );

      console.log("LinkedIn Profile API Response:", response.data);
      console.log("Profile Data:", response.data.data);

      if (response.data.success) {
        const profileData = response.data.data;
        setSearchingStep(2); // Profile found
        debugger;
        // Extract name from profile data or fallback to URL
        const name =
          profileData?.firstName || url.split("/").pop() || "Sam Taylor";

        setTargetPerson({
          name: name,
          company: profileData?.position[0]?.companyName || "Acme Corporation",
          avatar:
            profileData?.profilePicture ||
            "/placeholder.svg?height=60&width=60",
        });
        debugger;
        // Make second API call to filter connections
        try {
          setSearchingStep(3); // Analyzing connections
          const filterResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/linkedin/user-interactions`,
            {
              params: {
                profileId: response.data.data.id,
                url: url,
              },
            }
          );

          console.log("Filter Connections Response:", filterResponse.data);

          if (filterResponse.data.success) {
            setSearchingStep(4); // Connections found
            // Process and transform the interactions data

            const processedResults = filterResponse.data.data.interactions
              .map((interaction: LinkedInInteraction) => {
                //@ts-expect-error - interactionCount is not defined in the LinkedInInteraction interface
                const totalInteractions = interaction.interactionCount;
                const contact = {
                  id: interaction.interactions[0].urn,
                  name: `${interaction.interactions[0].author.firstName} ${interaction.interactions[0].author.lastName}`,
                  avatar: "/placeholder.svg?height=40&width=40",
                  role: interaction.interactions[0].author.headline,
                  interactionCount: totalInteractions,
                  connectionStrength: Math.min(
                    Math.round((totalInteractions / 40) * 100),
                    100
                  ),
                  reason: `e`,
                  mutualConnections: 0,
                  recentActivity: interaction.interactions[0].action,
                  entityType: interaction.interactions[0].entityType,
                  postedAt: interaction.interactions[0].postedAt,
                  recentInteractions: [interaction], // Store the original interaction data
                };

                return contact;
              })
              // Sort by total interactions in descending order
              .sort(
                (a: Contact, b: Contact) =>
                  b.interactionCount - a.interactionCount
              )
              // Take only the first 3 results
              .slice(0, 15);

            // Wait a moment to show the filtering process
            setTimeout(() => {
              setResults(processedResults);
              setStep("results");

              // Add to history
              addSearch({
                query: url.trim(),
                type: "person",
                result: processedResults,
              });
            }, 1500);
          }
        } catch (error) {
          console.error("Error filtering connections:", error);
          // Fallback to mock data if filtering fails
          setSearchingStep(4); // Using fallback data
          setTimeout(() => {
            setResults(mockContacts);
            setStep("results");
          }, 1500);
        }
      }
    } catch (error) {
      console.error("Error fetching LinkedIn profile:", error);
      setStep("input"); // Go back to input on error
    }
  };

  const handleAskForIntro = (contact: (typeof mockContacts)[0]) => {
    setSelectedContact(contact);
    // Create a personalized intro message using the target person's information
    const targetPersonName = targetPerson.name;
    const targetPersonCompany = targetPerson.company || "";

    setIntroMessage(
      `Hi ${
        contact.name
      },\n\nI noticed you're connected with ${targetPersonName}${
        targetPersonCompany ? ` at ${targetPersonCompany}` : ""
      }. I'm interested in connecting with them regarding potential collaboration opportunities. Would you be willing to introduce us?\n\nBest regards`
    );
    setShowIntroModal(true);
  };

  const handleSendIntro = () => {
    // In a real app, this would send the introduction request
    // For now, we'll just close the modal
    setShowIntroModal(false);

    // Show a success message or notification here
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      // In a real app, you would process the CSV file here
      setStep("input");
    }
  };

  const handleUseExample = () => {
    // In a real app, you would load the example CSV data here
    setStep("input");
  };

  return (
    <div className='relative space-y-6' onMouseMove={handleMouseMove}>
      {/* Interactive background particles */}
      <div
        ref={particlesRef}
        className='absolute inset-0 -z-10 overflow-hidden pointer-events-none'
      />

      {/* Subtle background effects */}
      <div
        className='absolute -inset-40 bg-indigo-50 rounded-full blur-3xl opacity-30 animate-pulse -z-10'
        style={{
          top: "30%",
          left: "20%",
          animationDuration: "15s",
        }}
      />
      <div
        className='absolute -inset-40 bg-sky-50 rounded-full blur-3xl opacity-30 animate-pulse -z-10'
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
              <h1 className='text-2xl font-bold text-indigo-600'>Introfy</h1>
            </div>

            <div className='space-y-8 text-center'>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className='space-y-2'
              >
                <h2 className='text-2xl font-semibold text-gray-900'>
                  Import your connections
                </h2>
                <p className='text-gray-500 text-sm'>
                  Upload a CSV file with your network connections or use our
                  example data
                </p>
              </motion.div>

              <motion.div
                className='space-y-6'
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className='flex flex-col items-center gap-4'>
                  <label
                    htmlFor='csv-upload'
                    className='w-full max-w-md h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-500 hover:bg-indigo-50/50 transition-all cursor-pointer'
                  >
                    <input
                      id='csv-upload'
                      type='file'
                      accept='.csv'
                      onChange={handleFileUpload}
                      className='hidden'
                    />
                    <ArrowUp className='h-6 w-6 text-gray-400 mb-2' />
                    <span className='text-sm text-gray-500'>
                      {csvFile
                        ? csvFile.name
                        : "Drop your CSV file here or click to browse"}
                    </span>
                  </label>

                  <div className='flex items-center gap-4'>
                    <div className='h-px w-16 bg-gray-200' />
                    <span className='text-sm text-gray-500'>or</span>
                    <div className='h-px w-16 bg-gray-200' />
                  </div>

                  <Button
                    onClick={handleUseExample}
                    className='bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 transition-all'
                  >
                    Use example CSV
                  </Button>
                </div>
              </motion.div>
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
              <h1 className='text-2xl font-bold text-indigo-600'>Introfy</h1>
            </div>

            <form onSubmit={handleSubmit} className='space-y-8 text-center'>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className='space-y-2'
              >
                <h2 className='text-2xl font-semibold text-gray-900'>
                  Find your next connection
                </h2>
                <p className='text-gray-500 text-sm'>
                  Enter a LinkedIn profile to discover optimal paths in your
                  network
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
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder='https://linkedin.com/in/connanbat'
                    className='py-6 pr-14 rounded-xl text-gray-900 placeholder:text-gray-500 focus-visible:ring-indigo-500 shadow-sm'
                  />
                  <Button
                    type='submit'
                    disabled={!url}
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
                  Analyzing your network
                </h2>
                <AnimatePresence mode='wait'>
                  {[
                    "Initializing search...",
                    "Fetching profile data...",
                    "Profile found, analyzing...",
                    "Filtering connections...",
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
                  {targetPerson.name ? (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Avatar className='h-24 w-24 shadow-md'>
                        <AvatarImage
                          src={targetPerson.avatar}
                          alt={targetPerson.name}
                        />
                        <AvatarFallback className='bg-gray-100 text-indigo-600'>
                          {targetPerson.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                  ) : (
                    <div className='h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center'>
                      <Users className='h-12 w-12 text-gray-400' />
                    </div>
                  )}

                  {/* Animated rings without borders */}
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

                  {/* Animated particles centered from the middle */}
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={`particle-${i}`}
                      className='absolute w-2 h-2 rounded-full bg-sky-400'
                      style={{
                        left: "50%",
                        top: "50%",
                        marginLeft: "-4px",
                        marginTop: "-4px",
                      }}
                      initial={{
                        x: 0,
                        y: 0,
                        opacity: 0,
                        scale: 0,
                      }}
                      animate={{
                        x: Math.cos((i * 30 * Math.PI) / 180) * 120,
                        y: Math.sin((i * 30 * Math.PI) / 180) * 120,
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.25,
                        ease: "easeInOut",
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
              {results.slice(0, 10).map((contact, index) => {
                const totalInteractions = contact.interactionCount;
                return (
                  <motion.div
                    key={contact.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.15 }}
                  >
                    <div
                      className={cn(
                        "p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all",
                        index === 0
                          ? "bg-gradient-to-r from-amber-50 to-white border-l-4 border-amber-500"
                          : ""
                      )}
                    >
                      <div className='flex items-center gap-4'>
                        <Avatar className='h-14 w-14 shadow-sm'>
                          <AvatarImage
                            src={contact.avatar}
                            alt={contact.name}
                          />
                          <AvatarFallback className='bg-gray-100'>
                            {contact.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center justify-start gap-2'>
                            <h3 className='font-medium text-lg text-black'>
                              {contact.name}
                            </h3>
                            <div
                              className={cn(
                                "px-3 py-1 rounded-full text-sm font-medium",
                                index === 0
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-gray-100 text-gray-800"
                              )}
                            >
                              {index + 1}° priority
                            </div>
                          </div>

                          <p className='text-gray-600 text-sm mt-1'>
                            {contact.role}
                          </p>

                          <div className='flex items-center justify-between mt-3'>
                            <div className='flex items-center gap-2'>
                              <span className='text-sm text-gray-500 flex items-center'>
                                <Users
                                  className={cn(
                                    "h-4 w-4 mr-1",
                                    index === 0
                                      ? "text-amber-500"
                                      : "text-gray-400"
                                  )}
                                />
                                {`${totalInteractions} interactions with ${targetPerson.name}`}
                              </span>
                            </div>

                            <Button
                              onClick={() => handleAskForIntro(contact)}
                              className={cn(
                                "flex items-center gap-1",
                                index === 0
                                  ? "bg-amber-500 hover:bg-amber-600 text-white"
                                  : "bg-black hover:bg-gray-800 text-white"
                              )}
                            >
                              <MessageCircle className='h-4 w-4 mr-1' />
                              Ask for intro
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Introduction Modal */}
            <AnimatePresence>
              {showIntroModal && selectedContact && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'
                  onClick={() => setShowIntroModal(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", damping: 25 }}
                    className='bg-white rounded-xl shadow-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto'
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className='flex justify-between items-center mb-4'>
                      <h3 className='text-xl font-semibold text-black'>
                        Request Introduction
                      </h3>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 rounded-full text-black hover:bg-gray-100'
                        onClick={() => setShowIntroModal(false)}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    </div>

                    <div className='flex justify-center items-center gap-4 mb-6'>
                      <div className='text-center'>
                        <Avatar className='h-16 w-16 mx-auto mb-2'>
                          <AvatarFallback className='bg-amber-100 text-amber-800'>
                            You
                          </AvatarFallback>
                        </Avatar>
                        <p className='text-sm text-gray-600'>You</p>
                      </div>

                      <div className='flex flex-col items-center'>
                        <ArrowRight className='h-5 w-5 text-gray-400 mb-1' />
                        <div className='h-0.5 w-12 bg-gray-200'></div>
                      </div>

                      <div className='text-center'>
                        <Avatar className='h-16 w-16 mx-auto mb-2'>
                          <AvatarImage
                            src={selectedContact.avatar}
                            alt={selectedContact.name}
                          />
                          <AvatarFallback className='bg-gray-100'>
                            {selectedContact.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <p className='text-sm text-gray-600'>
                          {selectedContact.name}
                        </p>
                        {/* <p className='text-xs text-gray-500 mt-1'>
                          {selectedContact.role}
                        </p> */}
                      </div>

                      <div className='flex flex-col items-center'>
                        <ArrowRight className='h-5 w-5 text-gray-400 mb-1' />
                        <div className='h-0.5 w-12 bg-gray-200'></div>
                      </div>

                      <div className='text-center'>
                        <Avatar className='h-16 w-16 mx-auto mb-2'>
                          <AvatarImage
                            src={targetPerson.avatar}
                            alt={targetPerson.name}
                          />
                          <AvatarFallback className='bg-gray-100'>
                            {targetPerson.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <p className='text-sm text-gray-600'>
                          {targetPerson.name}
                        </p>
                      </div>
                    </div>

                    <div className='mb-6'>
                      <h4 className='text-sm font-medium text-gray-700 mb-3'>
                        Last interaction
                      </h4>
                      <div className='space-y-3'>
                        {selectedContact &&
                          selectedContact.recentInteractions
                            ?.slice(0, 3)
                            .map((interaction, index) => (
                              <div
                                key={index}
                                className='bg-gray-50 p-4 rounded-lg space-y-2'
                              >
                                <div className='flex items-start justify-between'>
                                  <div className='space-y-1'>
                                    <p className='text-sm font-medium text-gray-900'>
                                      {interaction.interactions[0].action}
                                    </p>
                                    {interaction.interactions[0].text && (
                                      <p className='text-sm text-gray-600 line-clamp-2'>
                                        {interaction.interactions[0].text}
                                      </p>
                                    )}
                                  </div>
                                  <span className='text-xs text-gray-500'>
                                    {interaction.interactions[0].postedAt}
                                  </span>
                                </div>
                              </div>
                            ))}
                      </div>
                    </div>

                    <div className='mb-6'>
                      <h4 className='text-sm font-medium text-gray-700 mb-2'>
                        Your Message
                      </h4>
                      <Textarea
                        value={introMessage}
                        onChange={(e) => setIntroMessage(e.target.value)}
                        className='min-h-[120px] text-sm border-gray-200 focus-visible:ring-amber-500'
                        placeholder='Write your introduction request...'
                      />
                    </div>

                    <div className='flex justify-end gap-2'>
                      <Button
                        variant='outline'
                        onClick={() => setShowIntroModal(false)}
                        className='border-gray-200 text-black hover:bg-gray-50'
                      >
                        Cancel
                      </Button>
                      <Button
                        className='bg-amber-500 hover:bg-amber-600 text-white'
                        onClick={handleSendIntro}
                      >
                        Send Request
                      </Button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
