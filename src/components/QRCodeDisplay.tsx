import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { Card } from "@/components/ui/card";

interface QRCodeDisplayProps {
  queueId: string;
  position: number;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ queueId, position }) => {
  const qrData = JSON.stringify({
    queueId,
    position,
    timestamp: new Date().toISOString(),
  });

  return (
    <Card className="p-4 flex flex-col items-center space-y-2">
      <h3 className="text-lg font-semibold">Your Queue QR Code</h3>
      <QRCodeSVG value={qrData} size={128} />
      <p className="text-sm text-muted-foreground">
        Scan to check your position
      </p>
    </Card>
  );
};

export default QRCodeDisplay;