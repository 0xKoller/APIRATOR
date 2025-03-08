import { EndpointDetail } from "@/components/endpoint-detail"

export default function EndpointExample() {
  const exampleEndpoint = {
    name: "Create a User",
    method: "POST" as const,
    path: "/api/users",
    description: "Create a new user account with the provided information.",
    requestBody: {
      type: "application/json",
      properties: [
        {
          name: "name",
          type: "string",
          required: true,
          description: "The user's full name",
          minLength: 2,
        },
        {
          name: "email",
          type: "string",
          required: true,
          description: "The user's email address",
          format: "email",
        },
        {
          name: "password",
          type: "string",
          required: true,
          description: "The user's password",
          minLength: 8,
        },
      ],
    },
    responses: [
      {
        status: 201,
        description: "Created",
        content: {
          id: "123",
          name: "John Doe",
          email: "john@example.com",
          created_at: "2024-03-08T18:09:08Z",
        },
      },
      {
        status: 400,
        description: "Bad Request - Invalid input parameters",
      },
      {
        status: 409,
        description: "Conflict - Email already exists",
      },
    ],
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <EndpointDetail endpoint={exampleEndpoint} />
    </div>
  )
}

