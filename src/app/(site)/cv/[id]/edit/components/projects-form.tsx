"use client";

import { useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { projectSchema } from "@/lib/validations/cv";
import type { Project } from "@/modules/cv/data/mappers";
import { GrammarCheckInline } from "@/components/common/grammar-check-inline";
import { updateSectionAction } from "@/modules/cv/data/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2 } from "lucide-react";

const formSchema = z.object({
  items: z.array(projectSchema),
});

type FormData = z.infer<typeof formSchema>;

interface ProjectsFormProps {
  cvId: string;
  initialData: Project[];
  onSaved: (items: Project[]) => void;
}

function toDateString(date: Date | null | undefined): string {
  if (!date) return "";
  return date instanceof Date ? date.toISOString().split("T")[0] : "";
}

export function ProjectsForm({
  cvId,
  initialData,
  onSaved,
}: ProjectsFormProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: initialData.map((proj) => ({
        name: proj.name,
        description: proj.description ?? "",
        url: proj.url ?? "",
        startDate: toDateString(proj.startDate),
        endDate: toDateString(proj.endDate),
        sortOrder: proj.sortOrder,
      })),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  function onSubmit(data: FormData) {
    startTransition(async () => {
      const items = data.items.map((item, index) => ({
        name: item.name,
        description: item.description || undefined,
        url: item.url || undefined,
        startDate: item.startDate
          ? new Date(item.startDate).toISOString()
          : undefined,
        endDate: item.endDate
          ? new Date(item.endDate).toISOString()
          : undefined,
        sortOrder: index,
      }));

      const result = await updateSectionAction(cvId, "projects", items);

      if (result.ok) {
        toast.success(result.message ?? "Projects saved.");
        if (result.data) {
          onSaved(result.data);
        }
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="space-y-4 rounded-lg border border-subtle p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-content-primary">
              Project {index + 1}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FieldWrapper
              label="Name"
              error={errors.items?.[index]?.name?.message}
            >
              <Input
                {...register(`items.${index}.name`)}
                placeholder="My Awesome Project"
              />
            </FieldWrapper>

            <FieldWrapper
              label="URL"
              error={errors.items?.[index]?.url?.message}
            >
              <Input
                {...register(`items.${index}.url`)}
                placeholder="https://github.com/..."
              />
            </FieldWrapper>

            <FieldWrapper
              label="Start Date"
              error={errors.items?.[index]?.startDate?.message}
            >
              <Input type="date" {...register(`items.${index}.startDate`)} />
            </FieldWrapper>

            <FieldWrapper
              label="End Date"
              error={errors.items?.[index]?.endDate?.message}
            >
              <Input type="date" {...register(`items.${index}.endDate`)} />
            </FieldWrapper>
          </div>

          <FieldWrapper
            label="Description"
            error={errors.items?.[index]?.description?.message}
          >
            <Textarea
              {...register(`items.${index}.description`)}
              placeholder="What does this project do?"
              rows={3}
            />
            <GrammarCheckInline
              getText={() => getValues(`items.${index}.description`) ?? ""}
              context="project"
              emptyMessage="Write a short project description first."
            />
          </FieldWrapper>
        </div>
      ))}

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              name: "",
              description: "",
              url: "",
              startDate: undefined,
              endDate: undefined,
              sortOrder: fields.length,
            })
          }
        >
          <Plus className="size-4" />
          Add Project
        </Button>

        <Button type="submit" size="sm" disabled={isPending}>
          {isPending && <Loader2 className="size-4 animate-spin" />}
          Save
        </Button>
      </div>
    </form>
  );
}

function FieldWrapper({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-content-primary">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
