"use client"

interface EndpointDetailsProps {
  endpointData: any
}

export function EndpointDetails({ endpointData }: EndpointDetailsProps) {
  return (
    <div>
      <h2>Endpoint Details</h2>
      <pre>{JSON.stringify(endpointData, null, 2)}</pre>
    </div>
  )
}

