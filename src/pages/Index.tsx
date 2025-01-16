import React from "react";
import CheckInForm from "@/components/CheckInForm";
import QueueDisplay from "@/components/QueueDisplay";
import QRCodeDisplay from "@/components/QRCodeDisplay";
import StaffDashboard from "@/components/StaffDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Service } from "@/types/service";

interface Customer {
  id: string;
  name: string;
  phone: string;
  position: number;
  waitTime: number;
  marketingConsent: boolean;
  queueId: string;
  positionsPassed: number;
  serviceId?: string;
}

const Index = () => {
  const [customers, setCustomers] = React.useState<Customer[]>([]);
  const [currentCustomer, setCurrentCustomer] = React.useState<Customer | null>(null);
  const [services, setServices] = React.useState<Service[]>([]);
  const { toast } = useToast();

  console.log("Current queue state:", customers);

  const handleCheckIn = (name: string, phone: string, marketingConsent: boolean, serviceId?: string) => {
    const queueId = Math.random().toString(36).substr(2, 9);
    const newCustomer: Customer = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      phone,
      position: customers.length + 1,
      waitTime: Math.floor(customers.length * 5),
      marketingConsent,
      queueId,
      positionsPassed: 0,
      serviceId,
    };

    if (marketingConsent) {
      // Here you would integrate with Google Sheets API to store marketing data
      console.log("Marketing consent given, storing data:", { name, phone });
    }

    setCustomers((prev) => [...prev, newCustomer]);
    setCurrentCustomer(newCustomer);
  };

  const handleCallNext = () => {
    if (customers.length > 0) {
      const [next, ...rest] = customers;
      setCustomers(rest.map((customer) => {
        const newPosition = customer.position - 1;
        const positionsPassed = customer.positionsPassed + 1;
        
        if (positionsPassed >= 3) {
          toast({
            title: "Customer Removed",
            description: `${customer.name} has been removed after passing 3 positions`,
            variant: "destructive",
          });
          return null;
        }
        
        return {
          ...customer,
          position: newPosition,
          waitTime: Math.max(0, customer.waitTime - 5),
          positionsPassed,
        };
      }).filter(Boolean) as Customer[]);
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
            <CheckInForm onCheckIn={handleCheckIn} services={services} />
            {currentCustomer && (
              <>
                <QueueDisplay
                  position={currentCustomer.position}
                  estimatedWaitTime={currentCustomer.waitTime}
                  totalInQueue={customers.length}
                />
                <QRCodeDisplay
                  queueId={currentCustomer.queueId}
                  position={currentCustomer.position}
                />
              </>
            )}
          </TabsContent>

          <TabsContent value="staff" className="animate-fade-in">
            <StaffDashboard
              customers={customers}
              onCallNext={handleCallNext}
              onRemoveCustomer={handleRemoveCustomer}
              isManager={true}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;