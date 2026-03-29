"use client";

import type React from "react";

import { useEffect, useState } from "react";
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
import { useAuth } from "@/lib/authContext";
import { profileApi } from "@/app/api/api";
import { isAxiosError } from "axios";

export function UpdateUserForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  console.log(user);
  const getMaxDOB = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split("T")[0];
  };

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    display_name: "",
    dob: "",
    gender: "",
    // avatar_file_id: "",
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

  useEffect(() => {
    setFormData({
      first_name: user?.first_name ?? "",
      last_name: user?.last_name ?? "",
      display_name: user?.display_name ?? "",
      dob: user?.dob ?? "",
      gender: user?.gender ?? "",
      // avatar_file_id: user?.avatar_file_id ?? "",
      bio: user?.bio ?? "",
      address: {
        country: user?.address?.country ?? "",
        region: user?.address?.region ?? "",
        city: user?.address?.city ?? "",
        sub_city: user?.address?.sub_city ?? "",
        woreda: user?.address?.woreda ?? "",
        kebele: user?.address?.kebele ?? "",
        house_number: user?.address?.house_number ?? "",
      },
    });
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidDOB(formData.dob)) {
      toast.error("You must be at least 18 years old.");
      return;
    }

    if (formData.dob === new Date().toISOString().split("T")[0]) {
      toast.error("Invalid date of birth");
      return;
    }

    setIsLoading(true);
    try {
      await profileApi.editProfileInfo(formData);
      toast.success("Your profile information has been successfully updated.");
    } catch (error) {
      console.log(error);
      if (isAxiosError(error)) {
        if (error.response?.data.detail) {
          toast.error(error.response?.data.detail);
        } else {
          toast.error("Failed to update your profile. Please try again.");
        }
        return;
      }
      toast.error("Failed to update your profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const isValidDOB = (dob: string) => {
    if (!dob) return false;

    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age >= 18;
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
            max={getMaxDOB()}
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
            // value={formData.avatar_file_id}
            // onChange={(e) =>
            //   handleInputChange("avatar_file_id", e.target.value)
            // }
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
