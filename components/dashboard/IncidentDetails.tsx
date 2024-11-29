import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Calendar, Clock, AlertTriangle, FileText } from 'lucide-react'
import EthereumContract from './EthereumContract'

interface Incident {
  id: number
  title: string
  description: string
  alarm_level: string
  incident_date: string
  incident_time: string
  latitude: number
  longitude: number
  address: string
  status?: string
}

interface IncidentDetailsProps {
  incident: Incident
}

const IncidentDetails: React.FC<IncidentDetailsProps> = ({ incident }) => {
  const [contractData, setContractData] = useState<{
    contractAddress: string;
    transactionHash: string;
    blockNumber: number;
  } | null>(null)

  useEffect(() => {
    const simulateContractCreation = () => {
      const fakeContractAddress = `0x${Math.random().toString(16).slice(2, 42)}`
      const fakeTransactionHash = `0x${Math.random().toString(16).slice(2, 66)}`
      const fakeBlockNumber = Math.floor(Math.random() * 1000000) + 10000000
      setContractData({
        contractAddress: fakeContractAddress,
        transactionHash: fakeTransactionHash,
        blockNumber: fakeBlockNumber,
      })
    }

    simulateContractCreation()
  }, [incident.id])

  const getStatusColor = (status: string | undefined) => {
    switch (status?.toLowerCase()) {
      case 'pendiente':
        return 'bg-yellow-500'
      case 'en proceso':
        return 'bg-blue-500'
      case 'resuelto':
        return 'bg-green-500'
      default:
        return 'bg-green-500' // Default color is now green
    }
  }

  const getStatusText = (status: string | undefined) => {
    return status || 'Reportado' // Default text is now "Reportado"
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Detalles del Incidente</span>
          <Badge variant={incident.alarm_level === 'alto' ? 'destructive' : incident.alarm_level === 'moderado' ? 'warning' : 'default'}>
            {incident.alarm_level}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div>
            <h3 className="text-2xl font-semibold mb-2">{incident.title}</h3>
            <p className="text-muted-foreground">{incident.description}</p>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span className="font-semibold mr-2">Fecha:</span>
              {new Date(incident.incident_date).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <span className="font-semibold mr-2">Hora:</span>
              {incident.incident_time}
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4" />
              <span className="font-semibold mr-2">Dirección:</span>
              {incident.address}
            </div>
            <div className="flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4" />
              <span className="font-semibold mr-2">Estado:</span>
              <span className={`px-2 py-1 rounded-full text-white ${getStatusColor(incident.status)}`}>
                {getStatusText(incident.status)}
              </span>
            </div>
          </div>
          <Separator />
          <div>
            <h4 className="text-xl font-semibold mb-4 flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Trazabilidad Blockchain
            </h4>
            {contractData && (
              <EthereumContract 
                incidentId={incident.id}
                contractAddress={contractData.contractAddress}
                transactionHash={contractData.transactionHash}
                blockNumber={contractData.blockNumber}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default IncidentDetails

