"use client";

import React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Edit2,
  Play,
  Save,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Terminal,
  FileJson,
  ListChecks,
  Settings,
  Sliders,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Globe,
  Search,
  Filter,
  MousePointerClick,
  Database,
  Code,
} from "lucide-react";
import { Plus, X, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StagehandResponse } from "@/lib/types";

interface EndpointCreationProcessProps {
  url: string;
  prompt: string;
  stagehandSteps?: StagehandResponse;
  onComplete: (endpointData: any) => void;
  onBack: () => void;
}

interface QueryParameter {
  id: string;
  name: string;
  type: string;
  description: string;
  possibleValues: string;
  required: boolean;
  isEditing: boolean;
}

interface Instruction {
  id: string;
  title: string;
  details: string;
  isEditing: boolean;
  isExpanded: boolean;
}

interface ProcessingStep {
  id: string;
  action: string;
  target: string;
  description: string;
  icon: React.ReactNode;
  parameters: { name: string; description: string }[];
}

export function EndpointCreationProcess({
  url,
  prompt,
  stagehandSteps,
  onComplete,
  onBack,
}: EndpointCreationProcessProps) {
  const [endpointName, setEndpointName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [queryParameters, setQueryParameters] = useState<QueryParameter[]>([]);
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [responseSchema, setResponseSchema] = useState("");
  const [isEditingSchema, setIsEditingSchema] = useState(false);
  const [testResult, setTestResult] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isTesting, setIsTesting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [isEditingStep, setIsEditingStep] = useState(false);
  const [isAddingStep, setIsAddingStep] = useState(false);
  const [editingStep, setEditingStep] = useState<ProcessingStep | null>(null);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([]);
  const [stepToDelete, setStepToDelete] = useState<ProcessingStep | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Initialize data from stagehand steps
  useEffect(() => {
    if (stagehandSteps) {
      // Set endpoint name
      setEndpointName(stagehandSteps.name);

      // Convert stagehand params to query parameters
      const convertedParams = stagehandSteps.params.map((param, index) => ({
        id: String(index + 1),
        name: param.name,
        type: param.type,
        description: param.description,
        possibleValues:
          param.type === "enum"
            ? "Enum values will be provided"
            : "Any valid " + param.type,
        required: true, // You might want to add this to the backend response
        isEditing: false,
      }));
      setQueryParameters(convertedParams);

      // Convert stagehand instructions to processing steps
      const convertedSteps = stagehandSteps.instructions.map(
        (instruction, index) => ({
          id: String(index + 1),
          action:
            instruction.type.charAt(0).toUpperCase() +
            instruction.type.slice(1),
          target: instruction.action,
          description: `${instruction.type} operation: ${instruction.action}`,
          icon: getIconForType(instruction.type),
          parameters: Object.entries(instruction.variables || {}).map(
            ([key, value]) => ({
              name: key,
              description: value,
            })
          ),
        })
      );
      setProcessingSteps(convertedSteps);

      // Set response schema
      try {
        const schemaStr = JSON.stringify(
          stagehandSteps.expectedResult,
          null,
          2
        );
        setResponseSchema(schemaStr);
      } catch (error) {
        console.error("Error stringifying schema:", error);
        setResponseSchema("{}");
      }

      setIsLoading(false);
    }
  }, [stagehandSteps]);

  const getIconForType = (type: "observe" | "goto" | "extract" | "act") => {
    switch (type) {
      case "observe":
        return <Search className='h-4 w-4' />;
      case "goto":
        return <Globe className='h-4 w-4' />;
      case "extract":
        return <Database className='h-4 w-4' />;
      case "act":
        return <MousePointerClick className='h-4 w-4' />;
    }
  };

  const handleEditParameter = (
    id: string,
    field: keyof QueryParameter,
    value: string | boolean
  ) => {
    setQueryParameters((params) =>
      params.map((param) =>
        param.id === id ? { ...param, [field]: value } : param
      )
    );
  };

  const handleToggleEditParameter = (id: string) => {
    setQueryParameters((params) =>
      params.map((param) =>
        param.id === id ? { ...param, isEditing: !param.isEditing } : param
      )
    );
  };

  const handleEditInstruction = (
    id: string,
    field: keyof Instruction,
    value: string | boolean
  ) => {
    setInstructions((items) =>
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleToggleEditInstruction = (id: string) => {
    setInstructions((items) =>
      items.map((item) =>
        item.id === id ? { ...item, isEditing: !item.isEditing } : item
      )
    );
  };

  const handleTestEndpoint = () => {
    setIsTesting(true);

    // Simulate API testing with a delay
    setTimeout(() => {
      setTestResult(`{
  "results": [
    {
      "id": "apt12345",
      "title": "Modern 2 Bedroom Apartment in Palermo",
      "price": 120000,
      "currency": "ARS",
      "location": "Palermo, Buenos Aires",
      "bedrooms": 2,
      "bathrooms": 1,
      "area": 75,
      "description": "Beautiful modern apartment with great views, close to parks and restaurants.",
      "images": [
        "https://example.com/images/apt12345-1.jpg",
        "https://example.com/images/apt12345-2.jpg"
      ],
      "url": "https://zonaprop.com.ar/properties/apt12345",
      "contactInfo": {
        "phone": "+54 11 1234-5678",
        "email": "contact@agency.com"
      }
    },
    {
      "id": "apt67890",
      "title": "Spacious 3 Bedroom in Belgrano",
      "price": 150000,
      "currency": "ARS",
      "location": "Belgrano, Buenos Aires",
      "bedrooms": 3,
      "bathrooms": 2,
      "area": 110,
      "description": "Spacious family apartment in a quiet neighborhood with excellent amenities.",
      "images": [
        "https://example.com/images/apt67890-1.jpg",
        "https://example.com/images/apt67890-2.jpg"
      ],
      "url": "https://zonaprop.com.ar/properties/apt67890",
      "contactInfo": {
        "phone": "+54 11 2345-6789",
        "email": "info@realestate.com"
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 15,
    "totalResults": 42
  }
}`);
      setIsTesting(false);
    }, 2000);
  };

  const handleAccept = () => {
    // Prepare the endpoint data to pass to the next screen
    const endpointData = {
      name: endpointName,
      url,
      prompt,
      parameters: queryParameters,
      instructions,
      responseSchema: JSON.parse(responseSchema),
      testResult: testResult ? JSON.parse(testResult) : null,
    };

    onComplete(endpointData);
  };

  const handleDeleteStep = (step: ProcessingStep) => {
    setStepToDelete(step);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteStep = () => {
    if (stepToDelete) {
      const updatedSteps = processingSteps.filter(
        (step) => step.id !== stepToDelete.id
      );
      setProcessingSteps(updatedSteps);
      setStepToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className='w-full max-w-md mx-auto'>
        <div className='flex items-center justify-center mb-8'>
          <div className='flex items-center gap-2'>
            <div className='bg-primary rounded-md p-1.5 text-white font-bold'>
              <svg
                width='28'
                height='28'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M12 4L4 8L12 12L20 8L12 4Z' fill='currentColor' />
                <path d='M4 12L12 16L20 12' fill='currentColor' />
                <path d='M4 16L12 20L20 16' fill='currentColor' />
              </svg>
            </div>
            <span className='text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'>
              Apirator
            </span>
          </div>
        </div>

        <div className='bg-white rounded-xl border shadow-sm p-8 text-center'>
          <div className='flex flex-col items-center justify-center mb-6'>
            <Loader2 className='h-12 w-12 text-primary animate-spin mb-4' />
            <h2 className='text-xl font-semibold mb-2'>
              Creating Your API Endpoint
            </h2>
            <p className='text-muted-foreground mb-6'>{currentStep}</p>
            <Progress value={progress} className='w-full h-2' />
          </div>

          <div className='text-sm text-muted-foreground'>
            <p>
              Analyzing{" "}
              <span className='font-medium text-foreground'>{url}</span>
            </p>
            <p>
              Creating endpoint for:{" "}
              <span className='font-medium text-foreground'>{prompt}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full max-w-4xl mx-auto'>
      <div className='flex items-center justify-center mb-8'>
        <div className='flex items-center gap-2'>
          <div className='bg-primary rounded-md p-1.5 text-white font-bold'>
            <svg
              width='28'
              height='28'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path d='M12 4L4 8L12 12L20 8L12 4Z' fill='currentColor' />
              <path d='M4 12L12 16L20 12' fill='currentColor' />
              <path d='M4 16L12 20L20 16' fill='currentColor' />
            </svg>
          </div>
          <span className='text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent'>
            Apirator
          </span>
        </div>
      </div>

      <div className='mb-6 flex items-center justify-between'>
        <Button
          variant='outline'
          onClick={onBack}
          className='flex items-center gap-2'
        >
          <ArrowLeft className='h-4 w-4' /> Back
        </Button>

        <div className='text-sm bg-slate-100 px-3 py-1.5 rounded-full'>
          Creating API for: <span className='font-medium'>{url}</span>
        </div>
      </div>

      {/* Endpoint Name */}
      <Card className='mb-6 border shadow-sm'>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <Settings className='h-5 w-5 text-primary' />
              <CardTitle>Endpoint Configuration</CardTitle>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setIsEditingName(!isEditingName)}
              className='h-8 w-8 p-0'
            >
              <Edit2 className='h-4 w-4' />
            </Button>
          </div>
          <CardDescription>
            Define the basic configuration for your API endpoint
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isEditingName ? (
            <div className='flex gap-2'>
              <Input
                value={endpointName}
                onChange={(e) => setEndpointName(e.target.value)}
                className='flex-1'
              />
              <Button
                variant='outline'
                size='sm'
                onClick={() => setIsEditingName(false)}
              >
                <Save className='h-4 w-4' />
              </Button>
            </div>
          ) : (
            <div className='flex flex-col gap-2'>
              <div className='flex items-center gap-2'>
                <span className='text-sm font-medium text-muted-foreground'>
                  Endpoint Name:
                </span>
                <Badge
                  variant='outline'
                  className='text-base py-1 px-3 bg-slate-50'
                >
                  {endpointName}
                </Badge>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-sm font-medium text-muted-foreground'>
                  API URL:
                </span>
                <span className='text-sm font-mono bg-slate-50 px-2 py-1 rounded'>
                  /api/{endpointName}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Query Parameters */}
      <Card className='mb-6 border shadow-sm'>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Sliders className='h-5 w-5 text-primary' />
            <CardTitle>Query Parameters</CardTitle>
          </div>
          <CardDescription>
            Define the parameters that can be used to filter and customize API
            results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {queryParameters.map((param) => (
              <div
                key={param.id}
                className='border rounded-lg p-4 bg-white shadow-sm'
              >
                <div className='flex items-center justify-between mb-2'>
                  <div className='flex items-center gap-2'>
                    <Badge variant={param.required ? "default" : "outline"}>
                      {param.required ? "Required" : "Optional"}
                    </Badge>
                    <h3 className='font-semibold'>{param.name}</h3>
                    <Badge variant='secondary'>{param.type}</Badge>
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => handleToggleEditParameter(param.id)}
                    className='h-8 w-8 p-0'
                  >
                    {param.isEditing ? (
                      <Save className='h-4 w-4' />
                    ) : (
                      <Edit2 className='h-4 w-4' />
                    )}
                  </Button>
                </div>

                {param.isEditing ? (
                  <div className='space-y-3'>
                    <div>
                      <label className='text-sm font-medium'>Name:</label>
                      <Input
                        value={param.name}
                        onChange={(e) =>
                          handleEditParameter(param.id, "name", e.target.value)
                        }
                        className='mt-1'
                      />
                    </div>
                    <div>
                      <label className='text-sm font-medium'>Type:</label>
                      <Input
                        value={param.type}
                        onChange={(e) =>
                          handleEditParameter(param.id, "type", e.target.value)
                        }
                        className='mt-1'
                      />
                    </div>
                    <div>
                      <label className='text-sm font-medium'>
                        Description:
                      </label>
                      <Textarea
                        value={param.description}
                        onChange={(e) =>
                          handleEditParameter(
                            param.id,
                            "description",
                            e.target.value
                          )
                        }
                        className='mt-1'
                      />
                    </div>
                    <div>
                      <label className='text-sm font-medium'>
                        Possible Values:
                      </label>
                      <Textarea
                        value={param.possibleValues}
                        onChange={(e) =>
                          handleEditParameter(
                            param.id,
                            "possibleValues",
                            e.target.value
                          )
                        }
                        className='mt-1'
                      />
                    </div>
                    <div className='flex items-center gap-2'>
                      <label className='text-sm font-medium'>Required:</label>
                      <input
                        type='checkbox'
                        checked={param.required}
                        onChange={(e) =>
                          handleEditParameter(
                            param.id,
                            "required",
                            e.target.checked
                          )
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <div className='space-y-2'>
                    <div>
                      <span className='text-sm font-medium'>Description: </span>
                      <span className='text-sm'>{param.description}</span>
                    </div>
                    <div>
                      <span className='text-sm font-medium'>
                        Possible Values:{" "}
                      </span>
                      <span className='text-sm'>{param.possibleValues}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step-by-Step Instructions */}
      <Card className='mb-6 border shadow-sm'>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <ListChecks className='h-5 w-5 text-primary' />
            <CardTitle>Processing Steps</CardTitle>
          </div>
          <CardDescription>
            The sequence of operations performed by the API to retrieve and
            process data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            {/* Steps List */}
            {processingSteps.map((step, index) => (
              <React.Fragment key={step.id}>
                {/* Add Step Button (before first step or between steps) */}
                {index === 0 && (
                  <div className='flex justify-center my-2'>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-8 w-8 p-0 rounded-full border border-dashed border-gray-300 hover:bg-gray-100'
                      onClick={() => {
                        // Create a new step and open edit modal
                        const newStep = {
                          id: `new-${Date.now()}`,
                          action: "Go to",
                          target: "",
                          description: "",
                          icon: <Globe className='h-4 w-4' />,
                          parameters: [],
                        };
                        setEditingStep(newStep);
                        setIsAddingStep(true);
                        setIsEditingStep(true);
                        // Insert at the beginning
                        setProcessingSteps([newStep, ...processingSteps]);
                      }}
                    >
                      <Plus className='h-4 w-4' />
                    </Button>
                  </div>
                )}

                {/* Step Card */}
                <Card className='border p-4'>
                  <div className='flex items-start gap-3'>
                    {/* Step Number */}
                    <div className='flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium'>
                      {index + 1}
                    </div>

                    <div className='flex-grow space-y-2'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          {/* Icon */}
                          <div className='text-primary'>{step.icon}</div>

                          {/* Action */}
                          <span className='font-semibold text-lg'>
                            {step.action}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className='flex items-center gap-1'>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-8 w-8 p-0 text-muted-foreground hover:text-destructive'
                            onClick={() => handleDeleteStep(step)}
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-8 w-8 p-0'
                            onClick={() => {
                              // Open edit modal for this step
                              setEditingStep(step);
                              setIsEditingStep(true);
                            }}
                          >
                            <Edit2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </div>

                      {/* Target with special formatting */}
                      <div className='font-mono text-sm bg-muted rounded-md p-2'>
                        {step.target.includes(url)
                          ? step.target
                          : step.target.replace("[website]", url)}
                      </div>

                      {/* Description */}
                      <p className='text-sm text-muted-foreground'>
                        {step.description}
                      </p>

                      {/* Optional Parameters */}
                      {step.parameters && step.parameters.length > 0 && (
                        <div className='mt-2 space-y-2'>
                          <div className='text-sm font-medium'>Parameters:</div>
                          <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                            {step.parameters.map((param, i) => (
                              <div
                                key={i}
                                className='flex flex-col bg-slate-50 p-2 rounded-md border'
                              >
                                <span className='font-mono text-xs'>
                                  {param.name}
                                </span>
                                <span className='text-xs text-muted-foreground'>
                                  {param.description}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Add Step Button (between steps) */}
                <div className='flex justify-center my-2'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-8 w-8 p-0 rounded-full border border-dashed border-gray-300 hover:bg-gray-100'
                    onClick={() => {
                      // Create a new step and open edit modal
                      const newStep = {
                        id: `new-${Date.now()}`,
                        action: "Go to",
                        target: "",
                        description: "",
                        icon: <Globe className='h-4 w-4' />,
                        parameters: [],
                      };
                      setEditingStep(newStep);
                      setIsAddingStep(true);
                      setIsEditingStep(true);

                      // Insert at the current position
                      const updatedSteps = [...processingSteps];
                      updatedSteps.splice(index + 1, 0, newStep);
                      setProcessingSteps(updatedSteps);
                    }}
                  >
                    <Plus className='h-4 w-4' />
                  </Button>
                </div>
              </React.Fragment>
            ))}

            {/* Edit Step Dialog */}
            {isEditingStep && editingStep && (
              <Dialog open={isEditingStep} onOpenChange={setIsEditingStep}>
                <DialogContent className='sm:max-w-[500px]'>
                  <DialogHeader>
                    <DialogTitle>
                      {isAddingStep ? "Add New Step" : "Edit Step"}
                    </DialogTitle>
                    <DialogDescription>
                      Customize this processing step for your API endpoint.
                    </DialogDescription>
                  </DialogHeader>

                  <div className='space-y-4 py-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='action-type'>Action Type</Label>
                      <Select
                        defaultValue={editingStep.action}
                        onValueChange={(value) => {
                          setEditingStep({
                            ...editingStep,
                            action: value,
                            icon:
                              value === "Go to" ? (
                                <Globe className='h-4 w-4' />
                              ) : value === "Extract" ? (
                                <Database className='h-4 w-4' />
                              ) : value === "Observe" ? (
                                <Search className='h-4 w-4' />
                              ) : (
                                <MousePointerClick className='h-4 w-4' />
                              ),
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select action type' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='Go to'>Go to</SelectItem>
                          <SelectItem value='Extract'>Extract</SelectItem>
                          <SelectItem value='Observe'>Observe</SelectItem>
                          <SelectItem value='Act'>Act</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='target'>Target</Label>
                      <Input
                        id='target'
                        value={editingStep.target}
                        onChange={(e) =>
                          setEditingStep({
                            ...editingStep,
                            target: e.target.value,
                          })
                        }
                        placeholder='URL or element selector'
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='description'>Description</Label>
                      <Textarea
                        id='description'
                        value={editingStep.description}
                        onChange={(e) =>
                          setEditingStep({
                            ...editingStep,
                            description: e.target.value,
                          })
                        }
                        placeholder='Describe what this step does'
                        rows={3}
                      />
                    </div>

                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <Label>Parameters (Optional)</Label>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => {
                            const newParams = [
                              ...(editingStep.parameters || []),
                              { name: "", description: "" },
                            ];
                            setEditingStep({
                              ...editingStep,
                              parameters: newParams,
                            });
                          }}
                        >
                          <Plus className='h-3 w-3 mr-1' />
                          Add
                        </Button>
                      </div>

                      {editingStep.parameters &&
                        editingStep.parameters.map((param, idx) => (
                          <div key={idx} className='flex gap-2 items-start'>
                            <div className='flex-1 space-y-1'>
                              <Input
                                value={param.name}
                                onChange={(e) => {
                                  const newParams = [...editingStep.parameters];
                                  newParams[idx].name = e.target.value;
                                  setEditingStep({
                                    ...editingStep,
                                    parameters: newParams,
                                  });
                                }}
                                placeholder='Parameter name'
                                className='text-xs'
                              />
                              <Input
                                value={param.description}
                                onChange={(e) => {
                                  const newParams = [...editingStep.parameters];
                                  newParams[idx].description = e.target.value;
                                  setEditingStep({
                                    ...editingStep,
                                    parameters: newParams,
                                  });
                                }}
                                placeholder='Description'
                                className='text-xs'
                              />
                            </div>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='h-8 w-8 p-0 mt-1'
                              onClick={() => {
                                const newParams = [...editingStep.parameters];
                                newParams.splice(idx, 1);
                                setEditingStep({
                                  ...editingStep,
                                  parameters: newParams,
                                });
                              }}
                            >
                              <X className='h-4 w-4' />
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant='outline'
                      onClick={() => setIsEditingStep(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        // Save the changes
                        if (isAddingStep) {
                          // Add new step to the list
                          const updatedSteps = [
                            ...processingSteps,
                            editingStep,
                          ];
                          setProcessingSteps(updatedSteps);
                        } else {
                          // Update existing step
                          const updatedSteps = processingSteps.map((step) =>
                            step.id === editingStep.id ? editingStep : step
                          );
                          setProcessingSteps(updatedSteps);
                        }
                        setIsEditingStep(false);
                        setIsAddingStep(false);
                      }}
                    >
                      Save Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Processing Step</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this step? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={confirmDeleteStep}
                    className='bg-destructive text-destructive-foreground'
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Expected Response Schema & Test Results */}
      <Tabs defaultValue='schema' className='mb-6'>
        <TabsList className='grid w-full grid-cols-2 mb-4'>
          <TabsTrigger value='schema' className='flex items-center gap-2'>
            <FileJson className='h-4 w-4' />
            Response Schema
          </TabsTrigger>
          <TabsTrigger value='test' className='flex items-center gap-2'>
            <Terminal className='h-4 w-4' />
            Test Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value='schema'>
          <Card className='border shadow-sm'>
            <CardHeader className='pb-3'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <FileJson className='h-5 w-5 text-primary' />
                  <CardTitle>Expected Response Schema</CardTitle>
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setIsEditingSchema(!isEditingSchema)}
                  className='h-8 w-8 p-0'
                >
                  <Edit2 className='h-4 w-4' />
                </Button>
              </div>
              <CardDescription>
                The structure of data returned by your API endpoint
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditingSchema ? (
                <div className='space-y-3'>
                  <Textarea
                    value={responseSchema}
                    onChange={(e) => setResponseSchema(e.target.value)}
                    className='font-mono text-sm bg-slate-50'
                    rows={15}
                  />
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setIsEditingSchema(false)}
                    className='flex items-center gap-2'
                  >
                    <Save className='h-4 w-4' />
                    Save Schema
                  </Button>
                </div>
              ) : (
                <pre className='bg-slate-50 p-4 rounded-md overflow-auto text-sm font-mono border'>
                  {responseSchema}
                </pre>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='test'>
          <Card className='border shadow-sm'>
            <CardHeader>
              <div className='flex items-center gap-2'>
                <Terminal className='h-5 w-5 text-primary' />
                <CardTitle>Test Results</CardTitle>
              </div>
              <CardDescription>
                Preview the response from your API endpoint
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <Button
                  onClick={handleTestEndpoint}
                  disabled={isTesting}
                  className='flex items-center gap-2'
                >
                  {isTesting ? (
                    <>
                      <div className='h-4 w-4 border-2 border-t-transparent border-current rounded-full animate-spin'></div>
                      Testing...
                    </>
                  ) : (
                    <>
                      <Play className='h-4 w-4' />
                      Test Endpoint
                    </>
                  )}
                </Button>

                {testResult ? (
                  <pre className='bg-slate-50 p-4 rounded-md overflow-auto text-sm font-mono border'>
                    {testResult}
                  </pre>
                ) : (
                  <div className='bg-slate-50 p-8 rounded-md text-center text-muted-foreground border'>
                    <Terminal className='h-12 w-12 mx-auto mb-3 text-slate-300' />
                    <p>Click "Test Endpoint" to see results</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Accept Button */}
      <div className='flex justify-end mb-8'>
        <Button
          onClick={handleAccept}
          className='flex items-center gap-2'
          size='lg'
        >
          Accept and Continue <ArrowRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}
