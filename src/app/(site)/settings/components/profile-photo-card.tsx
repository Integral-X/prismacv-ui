"use client";

import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AVATAR_ACCEPTED_TYPES,
  AVATAR_MAX_BYTES,
} from "@/lib/validations/user";
import type { UserProfile } from "@/modules/user/data/mappers";
import {
  removeAvatarAction,
  uploadAvatarAction,
} from "@/modules/user/data/actions";

interface ProfilePhotoCardProps {
  user: UserProfile;
}

function getInitials(name: string | null, email: string): string {
  if (name) {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  return email[0].toUpperCase();
}

export function ProfilePhotoCard({ user }: ProfilePhotoCardProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (
      !AVATAR_ACCEPTED_TYPES.includes(
        file.type as (typeof AVATAR_ACCEPTED_TYPES)[number]
      )
    ) {
      toast.error("Please upload a JPG or PNG image.");
      return;
    }

    if (file.size > AVATAR_MAX_BYTES) {
      toast.error("Image must be 2MB or smaller.");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    startTransition(async () => {
      const result = await uploadAvatarAction(formData);

      if (result.ok) {
        toast.success(result.message ?? "Profile photo updated");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  function handleRemove() {
    startTransition(async () => {
      const result = await removeAvatarAction();

      if (result.ok) {
        toast.success(result.message ?? "Profile photo removed");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  const displayName = user.name ?? "No name set";

  return (
    <Card className="border-subtle shadow-card">
      <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="size-16 border border-subtle">
            {user.avatarUrl ? (
              <AvatarImage src={user.avatarUrl} alt={displayName} />
            ) : null}
            <AvatarFallback className="bg-surface-elevated text-lg text-content-primary">
              {getInitials(user.name, user.email)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-content-primary">{displayName}</p>
            <p className="text-sm text-content-muted">JPG or PNG, max 2MB</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept={AVATAR_ACCEPTED_TYPES.join(",")}
            className="sr-only"
            aria-label="Upload profile photo"
            onChange={handleFileChange}
            disabled={isPending}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleUploadClick}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Upload Photo
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={handleRemove}
            disabled={isPending || !user.avatarUrl}
          >
            Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
