import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Service } from "@/types/service";
import { Counter } from "@/types/counter";

interface ServiceSectionProps {
  services: Service[];
  setServices: (services: Service[]) => void;
  counters: Counter[];
}

const ServiceSection: React.FC<ServiceSectionProps> = ({ services, setServices, counters }) => {
  return (
    <div className="mb-6 animate-fade-in">
      <h3 className="text-lg font-semibold mb-4">Services</h3>
      <div className="grid grid-cols-2 gap-4">
        {services.map((service) => (
          <Card key={service.id} className="p-3">
            <div className="flex justify-between items-center">
              <div className="w-full space-y-2">
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
  );
};

export default ServiceSection;