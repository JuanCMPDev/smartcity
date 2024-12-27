import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface EthereumContractProps {
  incidentId: number
  contractAddress: string
  transactionHash: string
  blockNumber: number
}

const EthereumContract: React.FC<EthereumContractProps> = ({  
  contractAddress, 
  transactionHash, 
  blockNumber 
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <h5 className="text-lg font-semibold mb-4">Contrato Inteligente de Ethereum</h5>
        <div className="bg-muted p-4 rounded-md text-sm overflow-x-auto mb-4">
          <pre className="whitespace-pre-wrap">
{`pragma solidity ^0.8.0;

contract IncidentTracker {
  struct Incident {
      uint256 id;
      string status;
      uint256 timestamp;
  }

  mapping(uint256 => Incident) public incidents;

  event IncidentUpdated(uint256 indexed id, string status, uint256 timestamp);

  function updateIncident(uint256 _id, string memory _status) public {
      incidents[_id] = Incident(_id, _status, block.timestamp);
      emit IncidentUpdated(_id, _status, block.timestamp);
  }

  function getIncident(uint256 _id) public view returns (uint256, string memory, uint256) {
      Incident memory incident = incidents[_id];
      return (incident.id, incident.status, incident.timestamp);
  }
}`}
          </pre>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold mb-1">Dirección del Contrato:</p>
            <Badge variant="outline" className="font-mono text-xs">
              {contractAddress}
            </Badge>
          </div>
          <div>
            <p className="font-semibold mb-1">Hash de Transacción:</p>
            <Badge variant="outline" className="font-mono text-xs">
              {transactionHash}
            </Badge>
          </div>
          <div>
            <p className="font-semibold mb-1">Número de Bloque:</p>
            <Badge variant="outline" className="font-mono text-xs">
              {blockNumber}
            </Badge>
          </div>
          <div>
            <p className="font-semibold mb-1">Estado de la Transacción:</p>
            <Badge variant="outline">Confirmada</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default EthereumContract

