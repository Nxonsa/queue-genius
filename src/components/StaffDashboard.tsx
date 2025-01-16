import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { Users, Clock, Volume2 } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  phone: string;
  position: number;
  waitTime: number;
}

interface StaffDashboardProps {
  customers: Customer[];
  onCallNext: () => void;
  onRemoveCustomer: (id: string) => void;
}

const StaffDashboard: React.FC<StaffDashboardProps> = ({
  customers,
  onCallNext,
  onRemoveCustomer,
}) => {
  const { toast } = useToast();
  const [isAnnouncing, setIsAnnouncing] = React.useState(false);

  const handleCallNext = () => {
    console.log("Calling next customer");
    setIsAnnouncing(true);
    
    // Simulate voice announcement
    const nextCustomer = customers[0];
    if (nextCustomer) {
      const utterance = new SpeechSynthesisUtterance(
        `Now serving number ${nextCustomer.position}, ${nextCustomer.name}`
      );
      window.speechSynthesis.speak(utterance);

      utterance.onend = () => {
        setIsAnnouncing(false);
        onCallNext();
        toast({
          title: "Customer Called",
          description: `Now serving ${nextCustomer.name}`,
        });
      };
    }
  };

  return (
    <Card className="p-6 backdrop-blur-lg bg-card/80 shadow-lg animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Staff Dashboard</h2>
        </div>
        <Badge variant="secondary" className="text-sm">
          {customers.length} in queue
        </Badge>
      </div>

      <div className="space-y-4">
        <Button
          onClick={handleCallNext}
          className="w-full flex items-center justify-center space-x-2"
          disabled={customers.length === 0 || isAnnouncing}
        >
          <Volume2 className="w-4 h-4" />
          <span>{isAnnouncing ? "Announcing..." : "Call Next"}</span>
        </Button>

        <div className="space-y-3 mt-4">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="flex items-center justify-between p-3 bg-accent rounded-lg"
            >
              <div>
                <p className="font-medium">{customer.name}</p>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{customer.waitTime} mins</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveCustomer(customer.id)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default StaffDashboard;