"use client";

import * as React from "react";
import { toast } from "sonner";
import { Link2, Loader2, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  getCvShareInfoAction,
  shareCvAction,
  unshareCvAction,
} from "@/modules/cv/data/actions";
import type { CvShareInfo } from "@/modules/cv/data/mappers";

interface CvSharePanelProps {
  cvId: string;
}

export function CvSharePanel({ cvId }: CvSharePanelProps) {
  const [share, setShare] = React.useState<CvShareInfo | null | undefined>(
    undefined
  );
  const [loading, setLoading] = React.useState(true);
  const [pending, setPending] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    const result = await getCvShareInfoAction(cvId);
    setLoading(false);
    if (!result.ok) {
      toast.error(result.message);
      setShare(null);
      return;
    }
    setShare(result.data ?? null);
  }, [cvId]);

  React.useEffect(() => {
    void load();
  }, [load]);

  const publicUrl =
    typeof window !== "undefined" && share
      ? `${window.location.origin}/public/cv/${encodeURIComponent(share.shareSlug)}`
      : "";

  async function handleEnableShare() {
    setPending(true);
    const result = await shareCvAction(cvId, { isPublic: true });
    setPending(false);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    setShare(result.data);
    toast.success("Share link created.");
  }

  async function handleTogglePublic(checked: boolean) {
    if (!share) return;
    setPending(true);
    const result = await shareCvAction(cvId, { isPublic: checked });
    setPending(false);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    setShare(result.data);
    toast.success(checked ? "Link is public." : "Link is private.");
  }

  async function handleUnshare() {
    setPending(true);
    const result = await unshareCvAction(cvId);
    setPending(false);
    if (!result.ok) {
      toast.error(result.message);
      return;
    }
    setShare(null);
    toast.success("Share link removed.");
  }

  function handleCopy() {
    if (!publicUrl) return;
    void navigator.clipboard.writeText(publicUrl);
    toast.success("Link copied.");
  }

  return (
    <div className="rounded-lg border border-subtle bg-surface-card p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-content-primary">
        <Link2 className="size-4" />
        Share
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-content-secondary">
          <Loader2 className="size-4 animate-spin" />
          Loading…
        </div>
      ) : !share ? (
        <div className="space-y-3">
          <p className="text-xs text-content-secondary">
            Create a read-only link so others can preview this CV. You can make
            it public or keep it off while you draft.
          </p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => void handleEnableShare()}
          >
            {pending ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
            Create share link
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <Checkbox
              id="cv-share-public"
              checked={share.isPublic}
              disabled={pending}
              onCheckedChange={(v) => void handleTogglePublic(v === true)}
            />
            <div className="grid gap-1 leading-none">
              <Label
                htmlFor="cv-share-public"
                className="cursor-pointer text-sm font-normal text-content-primary"
              >
                Anyone with the link can view
              </Label>
              <p className="text-xs text-content-muted">
                Views: {share.viewCount} · Downloads: {share.downloadCount}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={pending || !share.isPublic}
              onClick={handleCopy}
            >
              <Copy className="mr-1 size-3.5" />
              Copy link
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="text-destructive hover:text-destructive"
              disabled={pending}
              onClick={() => void handleUnshare()}
            >
              <Trash2 className="mr-1 size-3.5" />
              Remove link
            </Button>
          </div>

          {share.isPublic ? (
            <p className="break-all text-xs text-content-muted">{publicUrl}</p>
          ) : (
            <p className="text-xs text-content-muted">
              Turn on &quot;Anyone with the link&quot; to copy a public URL.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
