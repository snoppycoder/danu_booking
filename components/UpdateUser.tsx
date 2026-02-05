"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function UpdateUserForm() {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    display_name: "",
    dob: "",
    gender: "",
    avatar_file_id: "",
    bio: "",
    address: {
      country: "",
      region: "",
      city: "",
      sub_city: "",
      woreda: "",
      kebele: "",
      house_number: "",
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement API call to update user
      console.log("[v0] Update user data:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast("Your profile information has been successfully updated.");
    } catch (error) {
      toast("Failed to update your profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Basic Information */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="first_name">First Name</Label>
          <Input
            id="first_name"
            value={formData.first_name}
            onChange={(e) => handleInputChange("first_name", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            id="last_name"
            value={formData.last_name}
            onChange={(e) => handleInputChange("last_name", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="display_name">Display Name</Label>
          <Input
            id="display_name"
            value={formData.display_name}
            onChange={(e) => handleInputChange("display_name", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <Input
            id="dob"
            type="date"
            value={formData.dob}
            onChange={(e) => handleInputChange("dob", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={formData.gender}
            onValueChange={(value) => handleInputChange("gender", value)}
          >
            <SelectTrigger id="gender">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2  py-2">
          <Label htmlFor="avatar_file_id">Avatar File ID</Label>
          <Input
            id="avatar_file_id"
            value={formData.avatar_file_id}
            onChange={(e) =>
              handleInputChange("avatar_file_id", e.target.value)
            }
            type="file"
          />
        </div>
      </div>

      {/* Bio */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => handleInputChange("bio", e.target.value)}
          placeholder="Tell us about yourself..."
          rows={4}
        />
      </div>

      {/* Address Information */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-foreground">Address</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* <div className="flex flex-col gap-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={formData.address.country}
              onChange={(e) => handleAddressChange("country", e.target.value)}
              placeholder="Ethiopia"
            />
          </div> */}

          <div className="flex flex-col gap-2">
            <Label htmlFor="region">Region</Label>
            <Input
              id="region"
              value={formData.address.region}
              onChange={(e) => handleAddressChange("region", e.target.value)}
              // placeholder="Addis Ababa"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.address.city}
              onChange={(e) => handleAddressChange("city", e.target.value)}
              // placeholder="Addis Ababa"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="sub_city">Sub City</Label>
            <Input
              id="sub_city"
              value={formData.address.sub_city}
              onChange={(e) => handleAddressChange("sub_city", e.target.value)}
              // placeholder="Bole"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="woreda">Woreda</Label>
            <Input
              id="woreda"
              value={formData.address.woreda}
              onChange={(e) => handleAddressChange("woreda", e.target.value)}
              // placeholder="12"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="kebele">Kebele</Label>
            <Input
              id="kebele"
              value={formData.address.kebele}
              onChange={(e) => handleAddressChange("kebele", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="house_number">House Number</Label>
            <Input
              id="house_number"
              value={formData.address.house_number}
              onChange={(e) =>
                handleAddressChange("house_number", e.target.value)
              }
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Profile"}
        </Button>
      </div>
    </form>
  );
}
