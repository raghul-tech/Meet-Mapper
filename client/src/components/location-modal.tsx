import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin } from "lucide-react";

interface LocationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAllowLocation: () => void;
  onDenyLocation: () => void;
}

export function LocationModal({ 
  open, 
  onOpenChange, 
  onAllowLocation, 
  onDenyLocation 
}: LocationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
            <MapPin className="h-6 w-6 text-blue-600" />
          </div>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Enable Location Access
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            We need your location to show nearby meeting spaces and provide accurate distance calculations.
          </DialogDescription>
        </DialogHeader>
        <div className="flex space-x-3 mt-6">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => {
              onDenyLocation();
              onOpenChange(false);
            }}
          >
            Not Now
          </Button>
          <Button 
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              onAllowLocation();
              onOpenChange(false);
            }}
          >
            Allow Access
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
