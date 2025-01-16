import React from "react";
import { Button } from "@/components/ui/button";
import { Clock, Volume2 } from "lucide-react";
import { Customer } from "@/types/customer";

interface QueueSectionProps {
  customers: Customer[];
  isAnnouncing: boolean;
  onCallNext: () => void;
  onRemoveCustomer: (id: string) => void;
}

const QueueSection: React.FC<QueueSectionProps> = ({
  customers,
  isAnnouncing,
  onCallNext,
  onRemoveCustomer,
}) => {
  return (
    <div className="space-y-4 animate-fade-in">
      <Button
        onClick={onCallNext}
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
  );
};

export default QueueSection;