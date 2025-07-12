"use client";

/**
 * Enhanced Profile Setup Form Component for SkillCircle Platform
 * Comprehensive user onboarding with skills, availability, and privacy settings
 */

import { useState } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signOut, signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import InputField from "@/components/AppInputFields/InputField";
import {
  profileSetupSchema,
  type ProfileSetupFormData,
} from "@/lib/validations/profile-setup";
import {
  Plus,
  Trash2,
  Clock,
  Users,
  Shield,
  BookOpen,
  Target,
  MapPin,
  User,
  FileText,
  Award,
  Globe,
  Tag,
} from "lucide-react";

interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
}

interface ProfileSetupFormProps {
  user: User;
}

// Constants for form options
const SKILL_CATEGORIES = [
  { value: "TECHNOLOGY", label: "Technology & Programming" },
  { value: "BUSINESS", label: "Business & Finance" },
  { value: "CREATIVE", label: "Creative Arts & Design" },
  { value: "LANGUAGES", label: "Languages" },
  { value: "MUSIC", label: "Music & Audio" },
  { value: "SPORTS", label: "Sports & Fitness" },
  { value: "COOKING", label: "Cooking & Culinary" },
  { value: "CRAFTS", label: "Crafts & DIY" },
  { value: "HEALTH_WELLNESS", label: "Health & Wellness" },
  { value: "EDUCATION", label: "Education & Teaching" },
  { value: "AUTOMOTIVE", label: "Automotive" },
  { value: "HOME_GARDEN", label: "Home & Garden" },
  { value: "OTHER", label: "Other" },
];

const EXPERIENCE_LEVELS = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
  { value: "EXPERT", label: "Expert" },
];

const DAYS_OF_WEEK = [
  { value: "MONDAY", label: "Monday" },
  { value: "TUESDAY", label: "Tuesday" },
  { value: "WEDNESDAY", label: "Wednesday" },
  { value: "THURSDAY", label: "Thursday" },
  { value: "FRIDAY", label: "Friday" },
  { value: "SATURDAY", label: "Saturday" },
  { value: "SUNDAY", label: "Sunday" },
];

const TIME_SLOTS = [
  { value: "EARLY_MORNING", label: "Early Morning (6-9 AM)" },
  { value: "MORNING", label: "Morning (9 AM-12 PM)" },
  { value: "AFTERNOON", label: "Afternoon (12-5 PM)" },
  { value: "EVENING", label: "Evening (5-8 PM)" },
  { value: "LATE_EVENING", label: "Late Evening (8-11 PM)" },
];

const SESSION_DURATIONS = [
  { value: "THIRTY_MINUTES", label: "30 minutes" },
  { value: "ONE_HOUR", label: "1 hour" },
  { value: "TWO_HOURS", label: "2 hours" },
  { value: "THREE_HOURS", label: "3 hours" },
  { value: "HALF_DAY", label: "Half day (4 hours)" },
  { value: "FULL_DAY", label: "Full day (8 hours)" },
  { value: "FLEXIBLE", label: "Flexible" },
];

const TIMEZONE_OPTIONS = [
  { value: "America/New_York", label: "America/New_York" },
  { value: "America/Chicago", label: "America/Chicago" },
  { value: "America/Denver", label: "America/Denver" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles" },
  { value: "Europe/London", label: "Europe/London" },
  { value: "Europe/Paris", label: "Europe/Paris" },
  { value: "Europe/Berlin", label: "Europe/Berlin" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo" },
  { value: "Asia/Shanghai", label: "Asia/Shanghai" },
  { value: "Australia/Sydney", label: "Australia/Sydney" },
  { value: "UTC", label: "UTC" },
];

export function ProfileSetupForm({ user }: ProfileSetupFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const { update } = useSession();

  const form = useForm({
    resolver: zodResolver(profileSetupSchema),
    defaultValues: {
      name: user.name || "",
      bio: "",
      location: undefined,
      availability: {
        daysOfWeek: [],
        timeSlots: [],
        sessionDuration: "ONE_HOUR" as const,
        timezone: "UTC",
        isRecurring: true,
      },
      privacy: {
        isPrivate: false,
        showLocation: true,
        showRatings: true,
        showSkillsOffered: true,
        showSkillsWanted: true,
        allowDirectContact: true,
      },
      skillsOffered: [],
      skillsWanted: [],
    },
    mode: "onChange",
  });
  console.log("errors", form.formState.errors);

  // TanStack Query mutation for profile setup
  const mutation = useMutation({
    mutationFn: async (formData: ProfileSetupFormData) => {
      const response = await fetch("/api/profile/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      return response.json();
    },
    onSuccess: async () => {
      try {
        // Update the session to reflect the new isSetupCompleted status
        console.log("🚀 Profile setup success - Updating session...");
        await update();
        console.log(
          "🚀 Profile setup success - Session updated, redirecting..."
        );

        // Navigate to home page after session is updated
        // Add a timestamp to bypass middleware caching issues
        window.location.href = "/?setup_completed=" + Date.now();
      } catch (error) {
        console.error("Error updating session:", error);
        // Fallback: force page reload
        window.location.href = "/";
      }
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    },
  });

  const {
    fields: skillsOfferedFields,
    append: appendSkillOffered,
    remove: removeSkillOffered,
  } = useFieldArray({
    control: form.control,
    name: "skillsOffered" as const,
  });

  const {
    fields: skillsWantedFields,
    append: appendSkillWanted,
    remove: removeSkillWanted,
  } = useFieldArray({
    control: form.control,
    name: "skillsWanted" as const,
  });

  const onSubmit = (data: any) => {
    // Type assertion to ensure data matches our expected structure
    const formData = data as ProfileSetupFormData;

    // Use the mutation to submit the form data
    mutation.mutate(formData);
  };

  const nextStep = async () => {
    if (currentStep < totalSteps) {
      // Trigger validation when moving to final step
      if (currentStep === totalSteps - 1) {
        await form.trigger();
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <FormProvider {...form}>
      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>
              Step {currentStep} of {totalSteps}
            </span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              {/* User Info Display */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-sky-600" />
                    Your Google Account
                  </CardTitle>
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

              {/* Basic Profile Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InputField
                    label="Display Name"
                    name="name"
                    type="text"
                    placeholder="How should others see your name?"
                    required
                    Icon={User}
                  />

                  <InputField
                    label="Bio"
                    name="bio"
                    type="text-area"
                    placeholder="Tell us about yourself, your interests, and what you're passionate about..."
                    description="This helps others understand your background and interests"
                    Icon={FileText}
                  />

                  <InputField
                    label="Location"
                    name="location"
                    type="places_autocomplete"
                    placeholder="Search for your city or address..."
                    description="Helps find skill exchange partners near you"
                    Icon={MapPin}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-2"
                >
                  Next: Availability
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Availability Setup */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-sky-600" />
                    Availability Setup
                  </CardTitle>
                  <p className="text-gray-600">
                    When are you available for skill exchanges?
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Days of Week */}
                  <div>
                    <Label className="text-base font-medium">
                      Available Days *
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                      {DAYS_OF_WEEK.map((day) => (
                        <div
                          key={day.value}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={day.value}
                            checked={form
                              .watch("availability.daysOfWeek")
                              ?.includes(day.value as any)}
                            onCheckedChange={(checked) => {
                              const currentDays =
                                form.getValues("availability.daysOfWeek") || [];
                              if (checked) {
                                form.setValue(
                                  "availability.daysOfWeek",
                                  [...currentDays, day.value as any],
                                  { shouldValidate: true }
                                );
                              } else {
                                form.setValue(
                                  "availability.daysOfWeek",
                                  currentDays.filter((d) => d !== day.value),
                                  { shouldValidate: true }
                                );
                              }
                            }}
                          />
                          <Label htmlFor={day.value} className="text-sm">
                            {day.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {form.formState.errors.availability?.daysOfWeek && (
                      <p className="text-red-500 text-sm mt-1">
                        {String(
                          form.formState.errors.availability.daysOfWeek
                            .message || "Please select at least one day"
                        )}
                      </p>
                    )}
                  </div>

                  {/* Time Slots */}
                  <div>
                    <Label className="text-base font-medium">
                      Preferred Time Slots *
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                      {TIME_SLOTS.map((slot) => (
                        <div
                          key={slot.value}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={slot.value}
                            checked={form
                              .watch("availability.timeSlots")
                              ?.includes(slot.value as any)}
                            onCheckedChange={(checked) => {
                              const currentSlots =
                                form.getValues("availability.timeSlots") || [];
                              if (checked) {
                                form.setValue(
                                  "availability.timeSlots",
                                  [...currentSlots, slot.value as any],
                                  { shouldValidate: true }
                                );
                              } else {
                                form.setValue(
                                  "availability.timeSlots",
                                  currentSlots.filter((s) => s !== slot.value),
                                  { shouldValidate: true }
                                );
                              }
                            }}
                          />
                          <Label htmlFor={slot.value} className="text-sm">
                            {slot.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {form.formState.errors.availability?.timeSlots && (
                      <p className="text-red-500 text-sm mt-1">
                        {String(
                          form.formState.errors.availability.timeSlots
                            .message || "Please select at least one time slot"
                        )}
                      </p>
                    )}
                  </div>

                  {/* Session Duration */}
                  <InputField
                    label="Preferred Session Duration"
                    name="availability.sessionDuration"
                    type="select"
                    placeholder="Select duration"
                    options={SESSION_DURATIONS}
                    Icon={Clock}
                  />

                  {/* Timezone */}
                  <InputField
                    label="Timezone"
                    name="availability.timezone"
                    type="select"
                    placeholder="Select timezone"
                    options={TIMEZONE_OPTIONS}
                    Icon={Globe}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button
                  type="button"
                  onClick={prevStep}
                  variant="outline"
                  className="px-8 py-2"
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-2"
                >
                  Next: Privacy Settings
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Privacy Settings */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-sky-600" />
                    Privacy Settings
                  </CardTitle>
                  <p className="text-gray-600">
                    Control who can see your information
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">
                          Private Profile
                        </Label>
                        <p className="text-sm text-gray-600">
                          Only show your profile to matched users
                        </p>
                      </div>
                      <Switch {...form.register("privacy.isPrivate")} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">
                          Show Location
                        </Label>
                        <p className="text-sm text-gray-600">
                          Display your location to other users
                        </p>
                      </div>
                      <Switch
                        {...form.register("privacy.showLocation")}
                        defaultChecked
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">
                          Show Skills Offered
                        </Label>
                        <p className="text-sm text-gray-600">
                          Display skills you can teach
                        </p>
                      </div>
                      <Switch
                        {...form.register("privacy.showSkillsOffered")}
                        defaultChecked
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">
                          Show Skills Wanted
                        </Label>
                        <p className="text-sm text-gray-600">
                          Display skills you want to learn
                        </p>
                      </div>
                      <Switch
                        {...form.register("privacy.showSkillsWanted")}
                        defaultChecked
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">
                          Show Ratings
                        </Label>
                        <p className="text-sm text-gray-600">
                          Display your ratings and reviews
                        </p>
                      </div>
                      <Switch
                        {...form.register("privacy.showRatings")}
                        defaultChecked
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">
                          Allow Direct Contact
                        </Label>
                        <p className="text-sm text-gray-600">
                          Let users contact you directly
                        </p>
                      </div>
                      <Switch
                        {...form.register("privacy.allowDirectContact")}
                        defaultChecked
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button
                  type="button"
                  onClick={prevStep}
                  variant="outline"
                  className="px-8 py-2"
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  onClick={nextStep}
                  className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-2"
                >
                  Next: Skills
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Skills Management */}
          {currentStep === 4 && (
            <div className="space-y-6">
              {/* Skills to Offer */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-sky-600" />
                    Skills You Can Offer
                  </CardTitle>
                  <p className="text-gray-600">
                    What skills can you teach others?
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {skillsOfferedFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="border rounded-lg p-4 space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Skill {index + 1}</h4>
                        <Button
                          type="button"
                          onClick={() => removeSkillOffered(index)}
                          variant="outline"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                          label="Skill Title"
                          name={`skillsOffered.${index}.title`}
                          type="text"
                          placeholder="Enter skill title"
                          Icon={BookOpen}
                          required
                        />
                        <InputField
                          label="Category"
                          name={`skillsOffered.${index}.category`}
                          type="select"
                          placeholder="Select category"
                          options={SKILL_CATEGORIES}
                          Icon={Tag}
                          required
                        />
                      </div>

                      <InputField
                        label="Skill Description"
                        name={`skillsOffered.${index}.description`}
                        type="text-area"
                        placeholder="Describe this skill and what you can teach..."
                        Icon={FileText}
                        required
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                          onValueChange={(value) =>
                            form.setValue(
                              `skillsOffered.${index}.experienceLevel`,
                              value as any
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Your level" />
                          </SelectTrigger>
                          <SelectContent>
                            {EXPERIENCE_LEVELS.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div className="space-y-2">
                          <Label
                            htmlFor={`yearsOfExperience-${index}`}
                            className="text-sm font-medium flex items-center gap-2"
                          >
                            <Award className="h-4 w-4" />
                            Years of Experience
                          </Label>
                          <Input
                            id={`yearsOfExperience-${index}`}
                            type="number"
                            placeholder="Years of experience (0-50)"
                            min="0"
                            max="50"
                            {...form.register(
                              `skillsOffered.${index}.yearsOfExperience`,
                              {
                                valueAsNumber: true,
                              }
                            )}
                          />
                          {form.formState.errors.skillsOffered?.[index]
                            ?.yearsOfExperience && (
                            <p className="text-red-500 text-sm">
                              {String(
                                form.formState.errors.skillsOffered[index]
                                  ?.yearsOfExperience?.message ||
                                  "Invalid years of experience"
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    onClick={() =>
                      appendSkillOffered({
                        title: "",
                        description: "",
                        category: "OTHER",
                        experienceLevel: "BEGINNER",
                      })
                    }
                    variant="outline"
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Skill to Offer
                  </Button>
                </CardContent>
              </Card>

              {/* Skills to Learn */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-sky-600" />
                    Skills You Want to Learn
                  </CardTitle>
                  <p className="text-gray-600">
                    What skills would you like to learn?
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {skillsWantedFields.map((field, index) => (
                    <div
                      key={field.id}
                      className="border rounded-lg p-4 space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Skill {index + 1}</h4>
                        <Button
                          type="button"
                          onClick={() => removeSkillWanted(index)}
                          variant="outline"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField
                          label="Skill Title"
                          name={`skillsWanted.${index}.title`}
                          type="text"
                          placeholder="Enter skill you want to learn"
                          Icon={Target}
                          required
                        />
                        <InputField
                          label="Category"
                          name={`skillsWanted.${index}.category`}
                          type="select"
                          placeholder="Select category"
                          options={SKILL_CATEGORIES}
                          Icon={Tag}
                          required
                        />
                      </div>

                      <InputField
                        label="Learning Description"
                        name={`skillsWanted.${index}.description`}
                        type="text-area"
                        placeholder="Describe what you want to learn and your learning goals..."
                        Icon={FileText}
                        required
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select
                          onValueChange={(value) =>
                            form.setValue(
                              `skillsWanted.${index}.currentLevel`,
                              value as any
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Current level" />
                          </SelectTrigger>
                          <SelectContent>
                            {EXPERIENCE_LEVELS.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          onValueChange={(value) =>
                            form.setValue(
                              `skillsWanted.${index}.desiredLevel`,
                              value as any
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Desired level" />
                          </SelectTrigger>
                          <SelectContent>
                            {EXPERIENCE_LEVELS.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    onClick={() =>
                      appendSkillWanted({
                        title: "",
                        description: "",
                        category: "OTHER",
                        desiredLevel: "BEGINNER",
                      })
                    }
                    variant="outline"
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Skill to Learn
                  </Button>
                </CardContent>
              </Card>

              {/* Submit Section */}
              <Card className="bg-sky-50 border-sky-200">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-sky-900 mb-2">
                    Ready to Join SkillCircle?
                  </h3>
                  <p className="text-sm text-sky-800 mb-4">
                    You're all set! Click below to complete your profile and
                    start connecting with the community.
                  </p>
                  <div className="flex justify-between">
                    <Button
                      type="button"
                      onClick={prevStep}
                      variant="outline"
                      className="px-8 py-2"
                    >
                      Previous
                    </Button>
                    <Button
                      type="submit"
                      disabled={mutation.isPending}
                      className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-2"
                    >
                      {mutation.isPending ? "Setting up..." : "Complete Setup"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </form>
      </div>
    </FormProvider>
  );
}
