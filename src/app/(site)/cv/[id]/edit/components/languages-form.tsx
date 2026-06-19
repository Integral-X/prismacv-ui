"use client";

import { useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { languageSchema } from "@/lib/validations/cv";
import type { Language } from "@/modules/cv/data/mappers";
import { updateSectionAction } from "@/modules/cv/data/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  items: z.array(languageSchema),
});

type FormData = z.infer<typeof formSchema>;

const PROFICIENCY_OPTIONS = [
  { value: "BASIC", label: "Basic" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
  { value: "FLUENT", label: "Fluent" },
  { value: "NATIVE", label: "Native" },
] as const;

interface LanguagesFormProps {
  cvId: string;
  initialData: Language[];
  onSaved: (items: Language[]) => void;
}

export function LanguagesForm({
  cvId,
  initialData,
  onSaved,
}: LanguagesFormProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      items: initialData.map((lang) => ({
        name: lang.name,
        proficiency: lang.proficiency.toUpperCase() as
          | "BASIC"
          | "INTERMEDIATE"
          | "ADVANCED"
          | "FLUENT"
          | "NATIVE",
        sortOrder: lang.sortOrder,
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
        proficiency: item.proficiency,
        sortOrder: index,
      }));

      const result = await updateSectionAction(cvId, "languages", items);

      if (result.ok) {
        toast.success(result.message ?? "Languages saved.");
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
              Language {index + 1}
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
                placeholder="English"
              />
            </FieldWrapper>

            <FieldWrapper
              label="Proficiency"
              error={errors.items?.[index]?.proficiency?.message}
            >
              <select
                {...register(`items.${index}.proficiency`)}
                className={cn(
                  "flex h-9 w-full rounded-md border border-input",
                  "bg-transparent px-3 py-1 text-sm shadow-xs",
                  "focus-visible:border-ring",
                  "focus-visible:ring-ring/50",
                  "focus-visible:ring-[3px]"
                )}
              >
                <option value="">Select proficiency</option>
                {PROFICIENCY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </FieldWrapper>
          </div>
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
              proficiency: undefined,
              sortOrder: fields.length,
            })
          }
        >
          <Plus className="size-4" />
          Add Language
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
