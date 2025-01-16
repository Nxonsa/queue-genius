import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Service } from "@/types/service";
import { Counter } from "@/types/counter";

interface ServiceSectionProps {
  services: Service[];
  setServices: (services: Service[]) => void;
  counters: Counter[];
}

const ServiceSection: React.FC<ServiceSectionProps> = ({ services, setServices, counters }) => {
  const { toast } = useToast();
  const [localServices, setLocalServices] = React.useState<Service[]>(services);

  const handleSave = () => {
    setServices(localServices);
    toast({
      title: "Services Saved",
      description: "Services have been updated and are now visible to customers",
    });
  };

  return (
    <div className="mb-4 md:mb-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-2 md:space-y-0">
        <h3 className="text-lg font-semibold">Services</h3>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {localServices.map((service) => (
          <Card key={service.id} className="p-3">
            <div className="flex flex-col space-y-2">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
                <Input
                  value={service.name}
                  onChange={(e) => {
                    const updatedServices = localServices.map(s =>
                      s.id === service.id ? { ...s, name: e.target.value } : s
                    );
                    setLocalServices(updatedServices);
                  }}
                  className="w-full md:w-2/3"
                  placeholder="Service Name"
                />
                <Badge variant={service.isActive ? "default" : "secondary"}>
                  {service.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <select
                value={service.counterId}
                onChange={(e) => {
                  const updatedServices = localServices.map(s =>
                    s.id === service.id ? { ...s, counterId: e.target.value } : s
                  );
                  setLocalServices(updatedServices);
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
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServiceSection;