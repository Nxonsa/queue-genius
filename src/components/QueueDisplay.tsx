import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Timer } from "lucide-react";

interface QueueDisplayProps {
  position: number;
  estimatedWaitTime: number;
  totalInQueue: number;
}

const QueueDisplay: React.FC<QueueDisplayProps> = ({
  position,
  estimatedWaitTime,
  totalInQueue,
}) => {
  const { toast } = useToast();
  console.log("Queue Display rendered with position:", position);

  React.useEffect(() => {
    if (position === 3) {
      toast({
        title: "Almost Your Turn!",
        description: "You're number 3 in line. Please return to the waiting area.",
        duration: 5000,
      });
    }
  }, [position, toast]);

  return (
    <Card className="p-6 backdrop-blur-lg bg-card/80 shadow-lg animate-fade-in">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-sm">
            Current Position
          </Badge>
          <span className="text-4xl font-bold text-primary">{position}</span>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <Timer className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Estimated Wait</span>
          </div>
          <span className="text-lg font-semibold">
            {estimatedWaitTime} mins
          </span>
        </div>

        <div className="h-2 bg-secondary rounded-full mt-4">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${((totalInQueue - position) / totalInQueue) * 100}%`,
            }}
          />
        </div>

        <p className="text-sm text-muted-foreground text-center mt-4">
          {totalInQueue - position} people ahead of you
        </p>
      </div>
    </Card>
  );
};

export default QueueDisplay;