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
import { Users, Settings } from "lucide-react";
import { Service } from "@/types/service";
import { Counter } from "@/types/counter";
import { Customer } from "@/types/customer";
import CounterSection from "./staff/CounterSection";
import ServiceSection from "./staff/ServiceSection";
import QueueSection from "./staff/QueueSection";
import { useIsMobile } from "@/hooks/use-mobile";
import { useConversation } from "@11labs/react";

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
  const isMobile = useIsMobile();
  const [isAnnouncing, setIsAnnouncing] = React.useState(false);
  const conversation = useConversation();
  const [counters, setCounters] = React.useState<Counter[]>([
    { id: "1", name: "Counter 1", staffName: "John Doe", isActive: true },
    { id: "2", name: "Counter 2", staffName: "Jane Smith", isActive: true },
    { id: "3", name: "Counter 3", staffName: "Mike Johnson", isActive: true },
    { id: "4", name: "Counter 4", staffName: "Sarah Wilson", isActive: true },
    { id: "5", name: "Counter 5", staffName: "Emily Brown", isActive: true },
    { id: "6", name: "Counter 6", staffName: "David Clark", isActive: true },
    { id: "7", name: "Counter 7", staffName: "Lisa Anderson", isActive: true },
  ]);

  const handleCallNext = async () => {
    console.log("Calling next customer");
    setIsAnnouncing(true);
    
    const nextCustomer = customers[0];
    const activeCounter = counters.find(c => c.isActive);
    
    if (nextCustomer && activeCounter) {
      const service = services.find(s => s.id === nextCustomer.serviceId);
      const counterName = service ? 
        counters.find(c => c.id === service.counterId)?.name || activeCounter.name :
        activeCounter.name;

      // If ElevenLabs API key is not set, fallback to browser's speech synthesis
      if (!process.env.VITE_ELEVENLABS_API_KEY) {
        const utterance = new SpeechSynthesisUtterance(
          `Next customer, please proceed to ${counterName}`
        );
        window.speechSynthesis.speak(utterance);

        utterance.onend = () => {
          setIsAnnouncing(false);
          onCallNext();
          toast({
            title: "Customer Called",
            description: `Now serving next customer at ${counterName}`,
          });
        };
      } else {
        try {
          // Use ElevenLabs for more natural voice
          await conversation.startSession({
            agentId: process.env.VITE_ELEVENLABS_AGENT_ID,
          });

          const message = `Next customer, please proceed to ${counterName}`;
          await conversation.speak({ text: message });

          setIsAnnouncing(false);
          onCallNext();
          toast({
            title: "Customer Called",
            description: `Now serving next customer at ${counterName}`,
          });
        } catch (error) {
          console.error("Error with ElevenLabs voice:", error);
          // Fallback to browser's speech synthesis
          const utterance = new SpeechSynthesisUtterance(
            `Next customer, please proceed to ${counterName}`
          );
          window.speechSynthesis.speak(utterance);
        } finally {
          await conversation.endSession();
        }
      }
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
    <Card className="p-4 md:p-6 backdrop-blur-lg bg-card/80 shadow-lg animate-fade-in w-full overflow-x-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 space-y-2 md:space-y-0">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-lg md:text-xl font-semibold">Staff Dashboard</h2>
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

      <div className="space-y-4 md:space-y-6">
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
      </div>
    </Card>
  );

};

export default StaffDashboard;
