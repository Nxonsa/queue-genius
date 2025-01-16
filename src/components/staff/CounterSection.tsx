import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Counter } from "@/types/counter";

interface CounterSectionProps {
  counters: Counter[];
  setCounters: (counters: Counter[]) => void;
}

const CounterSection: React.FC<CounterSectionProps> = ({ counters, setCounters }) => {
  const { toast } = useToast();
  const [localCounters, setLocalCounters] = React.useState<Counter[]>(counters);

  const handleSave = () => {
    setCounters(localCounters);
    toast({
      title: "Counters Saved",
      description: "Counter changes have been saved successfully",
    });
  };

  const handleNameChange = (id: string, newName: string) => {
    setLocalCounters(prevCounters =>
      prevCounters.map(counter =>
        counter.id === id ? { ...counter, name: newName } : counter
      )
    );
  };

  const handleStaffNameChange = (id: string, newStaffName: string) => {
    setLocalCounters(prevCounters =>
      prevCounters.map(counter =>
        counter.id === id ? { ...counter, staffName: newStaffName } : counter
      )
    );
  };

  return (
    <div className="mb-4 md:mb-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-2 md:space-y-0">
        <h3 className="text-lg font-semibold">Counters</h3>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {localCounters.map((counter) => (
          <Card key={counter.id} className="p-3">
            <div className="space-y-2">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
                <Input
                  value={counter.name}
                  onChange={(e) => handleNameChange(counter.id, e.target.value)}
                  className="w-full md:w-2/3"
                  placeholder="Counter Name"
                />
                <Badge variant={counter.isActive ? "default" : "secondary"}>
                  {counter.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <Input
                value={counter.staffName}
                onChange={(e) => handleStaffNameChange(counter.id, e.target.value)}
                placeholder="Staff Name"
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CounterSection;