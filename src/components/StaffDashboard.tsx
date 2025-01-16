import React from "react";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Users, Settings, Plus } from "lucide-react";
import { Service } from "@/types/service";
import { Counter } from "@/types/counter";
import { Customer } from "@/types/customer";
import CounterSection from "./staff/CounterSection";
import ServiceSection from "./staff/ServiceSection";
import QueueSection from "./staff/QueueSection";

interface StaffDashboardProps {
  customers: Customer[];
  onCallNext: () => void;
  onRemoveCustomer: (id: string) => void;
  isManager?: boolean;
  services: Service[];
  setServices: (services: Service[]) => void;
}

const StaffDashboard: React.FC<StaffDashboardProps> = ({
  customers,
  onCallNext,
  onRemoveCustomer,
  isManager = false,
  services,
  setServices,
}) => {
  const { toast } = useToast();
  const [isAnnouncing, setIsAnnouncing] = React.useState(false);
  const [counters, setCounters] = React.useState<Counter[]>([
    { id: "1", name: "Counter 1", staffName: "John Doe", isActive: true },
    { id: "2", name: "Counter 2", staffName: "Jane Smith", isActive: true },
    { id: "3", name: "Counter 3", staffName: "Mike Johnson", isActive: true },
    { id: "4", name: "Counter 4", staffName: "Sarah Wilson", isActive: true },
  ]);

  const handleCallNext = () => {
    console.log("Calling next customer");
    setIsAnnouncing(true);
    
    const nextCustomer = customers[0];
    const activeCounter = counters.find(c => c.isActive);
    
    if (nextCustomer && activeCounter) {
      const service = services.find(s => s.id === nextCustomer.serviceId);
      const counterName = service ? 
        counters.find(c => c.id === service.counterId)?.name || activeCounter.name :
        activeCounter.name;

      const utterance = new SpeechSynthesisUtterance(
        `Customer number ${nextCustomer.position}, please proceed to ${counterName}`
      );
      window.speechSynthesis.speak(utterance);

      utterance.onend = () => {
        setIsAnnouncing(false);
        onCallNext();
        toast({
          title: "Customer Called",
          description: `Now serving ${nextCustomer.name} at ${counterName}`,
        });
      };
    }
  };

  const addCounter = () => {
    if (isManager) {
      const newCounter: Counter = {
        id: (counters.length + 1).toString(),
        name: `Counter ${counters.length + 1}`,
        staffName: "New Staff",
        isActive: true,
      };
      setCounters([...counters, newCounter]);
    }
  };

  const addService = () => {
    if (isManager) {
      const newService: Service = {
        id: Math.random().toString(36).substr(2, 9),
        name: "New Service",
        counterId: counters[0].id,
        isActive: true,
      };
      setServices([...services, newService]);
    }
  };

  return (
    <Card className="p-6 backdrop-blur-lg bg-card/80 shadow-lg animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Staff Dashboard</h2>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {isManager && (
              <>
                <DropdownMenuItem onClick={addCounter}>
                  Add Counter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={addService}>
                  Add Service
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {}}>
                  Manage Staff
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isManager && (
        <>
          <CounterSection counters={counters} setCounters={setCounters} />
          <ServiceSection 
            services={services}
            setServices={setServices}
            counters={counters}
          />
        </>
      )}

      <QueueSection
        customers={customers}
        isAnnouncing={isAnnouncing}
        onCallNext={handleCallNext}
        onRemoveCustomer={onRemoveCustomer}
      />
    </Card>
  );
};

export default StaffDashboard;