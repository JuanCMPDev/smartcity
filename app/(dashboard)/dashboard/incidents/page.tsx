"use client"

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorBoundary } from 'react-error-boundary'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ReloadIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"

const IncidentReportForm = dynamic(() => import('@/components/dashboard/IncidentReportForm'), {
  loading: () => <Skeleton className="w-full h-[400px]" />,
  ssr: false
})

interface ErrorFallbackProps {
  error: {
    message: string;
  };
  resetErrorBoundary: () => void;
}

function ErrorFallback({error, resetErrorBoundary}: ErrorFallbackProps) {
  return (
    <Alert variant="destructive">
      <AlertTitle>Algo salió mal:</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
      <Button onClick={resetErrorBoundary} className="mt-4">
        <ReloadIcon className="mr-2 h-4 w-4" /> Intentar de nuevo
      </Button>
    </Alert>
  )
}

export default function IncidentsPage() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <Skeleton className="w-full h-screen" />
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Reporte de Incidentes</h1>
      
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <IncidentReportForm />
      </ErrorBoundary>
    </div>
  )
}

