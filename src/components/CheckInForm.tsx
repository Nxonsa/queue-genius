import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { UserPlus, Mail } from "lucide-react";

interface CheckInFormProps {
  onCheckIn: (name: string, phone: string, marketingConsent: boolean) => void;
}

const CheckInForm: React.FC<CheckInFormProps> = ({ onCheckIn }) => {
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [marketingConsent, setMarketingConsent] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Check-in submitted:", { name, phone, marketingConsent });

    if (!name || !phone) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    onCheckIn(name, phone, marketingConsent);
    setName("");
    setPhone("");
    setMarketingConsent(false);

    toast({
      title: "Check-in Successful",
      description: "You have been added to the queue",
    });
  };

  return (
    <Card className="p-6 backdrop-blur-lg bg-card/80 shadow-lg animate-slide-up">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-2 mb-6">
          <UserPlus className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Check-In</h2>
        </div>

        <div className="space-y-3">
          <Input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
          />
          <Input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full"
          />
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="marketing"
              checked={marketingConsent}
              onCheckedChange={(checked) => setMarketingConsent(checked as boolean)}
            />
            <label
              htmlFor="marketing"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>Receive promotions and updates</span>
              </div>
            </label>
          </div>
        </div>

        <Button type="submit" className="w-full">
          Join Queue
        </Button>
      </form>
    </Card>
  );
};

export default CheckInForm;