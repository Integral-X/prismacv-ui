"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  joinDisplayName,
  personalInfoSchema,
  splitDisplayName,
  type PersonalInfoFormData,
} from "@/lib/validations/user";
import type { UserProfile } from "@/modules/user/data/mappers";
import { updateProfileAction } from "@/modules/user/data/actions";

import { ComingSoonField } from "./coming-soon-field";

interface PersonalDetailsFormProps {
  user: UserProfile;
}

export function PersonalDetailsForm({ user }: PersonalDetailsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { firstName, lastName } = splitDisplayName(user.name);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName,
      lastName,
    },
  });

  function onSubmit(data: PersonalInfoFormData) {
    startTransition(async () => {
      const result = await updateProfileAction({
        name: joinDisplayName(data.firstName, data.lastName),
      });

      if (result.ok) {
        toast.success(result.message ?? "Profile updated");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Card className="border-subtle shadow-card">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-content-primary">
                First Name
              </Label>
              <Input
                id="firstName"
                placeholder="First name"
                {...register("firstName")}
                aria-invalid={!!errors.firstName}
                disabled={isPending}
              />
              {errors.firstName ? (
                <p className="text-sm text-destructive" role="alert">
                  {errors.firstName.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-content-primary">
                Last Name
              </Label>
              <Input
                id="lastName"
                placeholder="Last name"
                {...register("lastName")}
                aria-invalid={!!errors.lastName}
                disabled={isPending}
              />
              {errors.lastName ? (
                <p className="text-sm text-destructive" role="alert">
                  {errors.lastName.message}
                </p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <ComingSoonField
              id="phoneNumber"
              label="Phone Number"
              placeholder="+0000000000000000"
            />
            <ComingSoonField
              id="location"
              label="Location"
              placeholder="City, Country"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <ComingSoonField
              id="dateOfBirth"
              label="Date of Birth"
              placeholder="MM / DD / YYYY"
            />
            <ComingSoonField id="gender" label="Gender" placeholder="Select" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-content-primary">
              Email
            </Label>
            <Input id="email" value={user.email} disabled readOnly />
            <p className="text-xs text-content-muted">
              Email cannot be changed here.
            </p>
          </div>

          <div className="flex justify-end border-t border-subtle pt-6">
            <Button type="submit" disabled={isPending || !isDirty}>
              {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
              Save changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
