import React from "react";
import CheckInForm from "@/components/CheckInForm";
import QueueDisplay from "@/components/QueueDisplay";
import StaffDashboard from "@/components/StaffDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

interface Customer {
  id: string;
  name: string;
  phone: string;
  position: number;
  waitTime: number;
}

const Index = () => {
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [currentCustomer, setCurrentCustomer] = React.useState<Customer | null>(null);
  const { toast } = useToast();

  console.log("Current queue state:", customers);

  const handleCheckIn = (name: string, phone: string) => {
    const newCustomer: Customer = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      phone,
      position: customers.length + 1,
      waitTime: Math.floor(customers.length * 5),
    };

    setCustomers((prev) => [...prev, newCustomer]);
    setCurrentCustomer(newCustomer);
  };

  const handleCallNext = () => {
    if (customers.length > 0) {
      const [next, ...rest] = customers;
      setCustomers(rest.map((customer) => ({
        ...customer,
        position: customer.position - 1,
        waitTime: Math.max(0, customer.waitTime - 5),
      })));
    }
  };

  const handleRemoveCustomer = (id: string) => {
    setCustomers((prev) => {
      const index = prev.findIndex((c) => c.id === id);
      if (index === -1) return prev;

      const newCustomers = prev.filter((c) => c.id !== id);
      return newCustomers.map((customer, i) => ({
        ...customer,
        position: i + 1,
        waitTime: Math.floor(i * 5),
      }));
    });

    if (currentCustomer?.id === id) {
      setCurrentCustomer(null);
    }

    toast({
      title: "Customer Removed",
      description: "The customer has been removed from the queue",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Queue Management System
        </h1>

        <Tabs defaultValue="customer" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="customer">Customer View</TabsTrigger>
            <TabsTrigger value="staff">Staff View</TabsTrigger>
          </TabsList>

          <TabsContent value="customer" className="space-y-6 animate-fade-in">
            <CheckInForm onCheckIn={handleCheckIn} />
            {currentCustomer && (
              <QueueDisplay
                position={currentCustomer.position}
                estimatedWaitTime={currentCustomer.waitTime}
                totalInQueue={customers.length}
              />
            )}
          </TabsContent>

          <TabsContent value="staff" className="animate-fade-in">
            <StaffDashboard
              customers={customers}
              onCallNext={handleCallNext}
              onRemoveCustomer={handleRemoveCustomer}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;