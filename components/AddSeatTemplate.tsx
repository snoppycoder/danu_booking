"use client"
import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";



export default function AddSeatTemplate() { 
    return (
        <div className="space-y-2">
                <Label htmlFor="new-capacity">Seating Capacity</Label>
                <Input
                  id="new-capacity"
                  type="number"
                  min="20"
                  max="60"
                  value={newBus.capacity}
                  onChange={(e) =>
                    setNewBus({
                      ...newBus,
                      capacity: Number.parseInt(e.target.value),
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Layout will be generated as {Math.ceil(newBus.capacity / 4)}{" "}
                  rows × 4 columns
                </p>
        </div>)

}