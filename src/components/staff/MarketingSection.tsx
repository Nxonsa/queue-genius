import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileSpreadsheet } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface MarketingSectionProps {
  sheetsUrl: string;
  setSheetsUrl: (url: string) => void;
}

const MarketingSection: React.FC<MarketingSectionProps> = ({ sheetsUrl, setSheetsUrl }) => {
  const { toast } = useToast();

  const updateSheetsUrl = () => {
    // For now, we'll just store the marketing data locally
    console.log("Marketing data will be stored locally");
    toast({
      title: "Marketing Settings Updated",
      description: "Your changes have been saved locally",
    });
  };

  return (
    <div className="mb-6 space-y-4 animate-fade-in">
      <h3 className="text-lg font-semibold">Marketing Settings</h3>
      <div className="flex space-x-2">
        <Input
          placeholder="Marketing Reference"
          value={sheetsUrl}
          onChange={(e) => setSheetsUrl(e.target.value)}
        />
        <Button onClick={updateSheetsUrl}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Update
        </Button>
      </div>
    </div>
  );
};

export default MarketingSection;