import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Users, Clock, Volume2, Plus, Settings, FileSpreadsheet } from "lucide-react";
import { Service } from "@/types/service";

interface Customer {
  id: string;
  name: string;
  phone: string;
  position: number;
  waitTime: number;
  marketingConsent?: boolean;
  serviceId?: string;
}

interface Counter {
  id: string;
  name: string;
  staffName: string;
  isActive: boolean;
}

interface StaffDashboardProps {
  customers: Customer[];
  onCallNext: () => void;
  onRemoveCustomer: (id: string) => void;
  isManager?: boolean;
}

const StaffDashboard: React.FC<StaffDashboardProps> = ({
  customers,
  onCallNext,
  onRemoveCustomer,
  isManager = false,
}) => {
  const { toast } = useToast();
  const [isAnnouncing, setIsAnnouncing] = React.useState(false);
  const [counters, setCounters] = React.useState<Counter[]>([
    { id: "1", name: "Counter 1", staffName: "John Doe", isActive: true },
  ]);
  const [services, setServices] = React.useState<Service[]>([]);
  const [sheetsUrl, setSheetsUrl] = React.useState("");

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

  const updateSheetsUrl = () => {
    console.log("Updating Google Sheets URL:", sheetsUrl);
    toast({
      title: "Marketing Sheet Updated",
      description: "The Google Sheets URL has been updated successfully",
    });
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
            <DropdownMenuItem onClick={() => {}}>
              View Marketing Data
            </DropdownMenuItem>
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
          <div className="mb-6 space-y-4">
            <h3 className="text-lg font-semibold">Marketing Sheet</h3>
            <div className="flex space-x-2">
              <Input
                placeholder="Google Sheets URL"
                value={sheetsUrl}
                onChange={(e) => setSheetsUrl(e.target.value)}
              />
              <Button onClick={updateSheetsUrl}>
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Update
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {counters.map((counter) => (
              <Card key={counter.id} className="p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{counter.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {counter.staffName}
                    </p>
                  </div>
                  <Badge variant={counter.isActive ? "default" : "secondary"}>
                    {counter.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <div className="grid grid-cols-2 gap-4">
              {services.map((service) => (
                <Card key={service.id} className="p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <Input
                        value={service.name}
                        onChange={(e) => {
                          const updatedServices = services.map(s =>
                            s.id === service.id ? { ...s, name: e.target.value } : s
                          );
                          setServices(updatedServices);
                        }}
                        className="mb-2"
                      />
                      <select
                        value={service.counterId}
                        onChange={(e) => {
                          const updatedServices = services.map(s =>
                            s.id === service.id ? { ...s, counterId: e.target.value } : s
                          );
                          setServices(updatedServices);
                        }}
                        className="w-full p-2 rounded border"
                      >
                        {counters.map(counter => (
                          <option key={counter.id} value={counter.id}>
                            {counter.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Badge variant={service.isActive ? "default" : "secondary"}>
                      {service.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}

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