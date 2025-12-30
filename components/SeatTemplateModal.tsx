"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { SeatTemplate } from "@/lib/model";

type SeatTemplateDialogProps = {
  templates: SeatTemplate[];
  onSelect: (template: SeatTemplate) => void;
};

export default function SeatTemplateDialog({
  templates,
  onSelect,
}: SeatTemplateDialogProps) {
  console.log(templates, "templates");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );

  const handleConfirm = () => {
    const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);
    if (selectedTemplate) onSelect(selectedTemplate);
  };

  return (
    <Dialog>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Choose a Seat Template</DialogTitle>
        </DialogHeader>

        <RadioGroup
          value={selectedTemplateId || undefined}
          onValueChange={(value) => setSelectedTemplateId(value)}
          className="flex flex-col space-y-2 mt-4"
        >
          {templates.map((template) => (
            <div key={template.id} className="flex items-center space-x-2">
              <RadioGroupItem value={template.id} id={template.id} />
              <Label htmlFor={template.id}>{template.name}</Label>
            </div>
          ))}
        </RadioGroup>

        <div className="mt-6 flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setSelectedTemplateId(null)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedTemplateId}>
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
