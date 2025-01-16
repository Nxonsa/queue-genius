import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Counter } from "@/types/counter";

interface CounterSectionProps {
  counters: Counter[];
}

const CounterSection: React.FC<CounterSectionProps> = ({ counters }) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6 animate-fade-in">
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
  );
};

export default CounterSection;