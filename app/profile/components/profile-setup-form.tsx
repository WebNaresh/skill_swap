"use client";

/**
 * Profile Setup Form Component for SkillCircle Platform
 * Handles new user profile completion
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
}

interface ProfileSetupFormProps {
  user: User;
}

export function ProfileSetupForm({ user }: ProfileSetupFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    bio: "",
    location: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/profile/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Redirect to home page after successful setup
        router.push("/");
        router.refresh();
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* User Info Display */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Google Account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {user.image && (
              <Image
                src={user.image}
                alt="Profile picture"
                width={64}
                height={64}
                className="rounded-full"
              />
            )}
            <div>
              <p className="font-medium text-gray-900">{user.name}</p>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Name */}
          <div>
            <Label htmlFor="name">Display Name *</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="How should others see your name?"
              required
              className="mt-1"
            />
          </div>

          {/* Bio */}
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself, your interests, and what you're passionate about..."
              rows={4}
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              This helps others understand your background and interests
            </p>
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="City, State/Country (e.g., San Francisco, CA)"
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Helps find skill exchange partners near you
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps Info */}
      <Card className="bg-sky-50 border-sky-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-sky-900 mb-2">What's Next?</h3>
          <ul className="text-sm text-sky-800 space-y-1">
            <li>• Browse skills offered by our community</li>
            <li>• Post skills you'd like to teach or learn</li>
            <li>• Connect with like-minded learners</li>
            <li>• Start your first skill exchange!</li>
          </ul>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading || !formData.name.trim()}
          className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-2"
        >
          {isLoading ? "Setting up..." : "Complete Setup"}
        </Button>
      </div>
    </form>
  );
}
