"use client";

import { type ReactNode } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  GripVertical,
  EyeOff,
  Eye,
  type LucideIcon,
} from "lucide-react";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import type { TemplateProps } from "./index";
import type { PersonalInfoField } from "@/modules/cv/editor/editor-model";
import {
  useSectionLayout,
  useSectionTitle,
} from "@/modules/cv/editor/editor-provider";
import {
  SECTION_TITLES,
  type LayoutSectionKey,
} from "@/modules/cv/editor/section-layout";
import { EditableText } from "@/modules/cv/components/primitives/editable-text";
import { EditableExperienceList } from "@/modules/cv/components/primitives/editable-experience-list";
import { EditableEducationList } from "@/modules/cv/components/primitives/editable-education-list";
import { EditableProjectList } from "@/modules/cv/components/primitives/editable-project-list";
import { EditableSkillList } from "@/modules/cv/components/primitives/editable-skill-list";
import { EditableCertificationList } from "@/modules/cv/components/primitives/editable-certification-list";
import { EditableLanguageList } from "@/modules/cv/components/primitives/editable-language-list";
import { InlineEditableText } from "@/modules/cv/components/primitives/inline-editable-text";

/**
 * Inline-editable two-column resume. Every section edits directly on the
 * document via the editor store. Client-only and mounted exclusively in edit
 * mode, so the editor's JS never reaches the preview/print/public paths.
 *
 * Section order, visibility, and heading overrides live in the editor store and
 * autosave through the same engine as every section — durable per CV, server-
 * side, and honored on the export/public render paths.
 */
export function TwoColumnEditable({ accentColor }: TemplateProps) {
  const {
    mainOrder,
    sideOrder,
    hiddenInMain,
    hiddenInSide,
    reorderMain,
    reorderSide,
    hideSection,
    showSection,
  } = useSectionLayout();

  return (
    <div className="mx-auto min-h-[297mm] w-[210mm] bg-white p-10 text-content-primary shadow-lg">
      <EditableHeader accentColor={accentColor} />

      <div className="mt-6 grid grid-cols-3 gap-8">
        {/* Main column (wide, left) */}
        <div className="col-span-2">
          <SortableColumn
            items={mainOrder}
            onReorder={reorderMain}
            onHide={hideSection}
            hidden={hiddenInMain}
            onShow={showSection}
            accentColor={accentColor}
          />
        </div>

        {/* Side column (narrow, right) */}
        <div className="col-span-1">
          <SortableColumn
            items={sideOrder}
            onReorder={reorderSide}
            onHide={hideSection}
            hidden={hiddenInSide}
            onShow={showSection}
            accentColor={accentColor}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Column with drag-to-reorder ────────────────────────────────────────────

function SortableColumn({
  items,
  onReorder,
  onHide,
  hidden,
  onShow,
  accentColor,
}: {
  items: LayoutSectionKey[];
  onReorder: (from: number, to: number) => void;
  onHide: (key: LayoutSectionKey) => void;
  hidden: LayoutSectionKey[];
  onShow: (key: LayoutSectionKey) => void;
  accentColor: string;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = items.indexOf(active.id as LayoutSectionKey);
    const to = items.indexOf(over.id as LayoutSectionKey);
    if (from !== -1 && to !== -1) onReorder(from, to);
  }

  return (
    <div className="space-y-5">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((key) => (
            <SortableSection
              key={key}
              sectionKey={key}
              onHide={() => onHide(key)}
              accentColor={accentColor}
            />
          ))}
        </SortableContext>
      </DndContext>

      {hidden.length > 0 && (
        <div className="space-y-0.5 border-t border-dashed border-subtle pt-3">
          <p className="mb-1.5 text-[10px] uppercase tracking-wide text-content-tertiary">
            Hidden sections
          </p>
          {hidden.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => onShow(key)}
              className="flex w-full cursor-pointer items-center gap-1.5 rounded px-1.5 py-1 text-xs text-content-tertiary transition-colors hover:bg-surface-card hover:text-content-secondary"
            >
              <Eye className="size-3 shrink-0" />
              {SECTION_TITLES[key]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Individual sortable section ─────────────────────────────────────────────

function SortableSection({
  sectionKey,
  onHide,
  accentColor,
}: {
  sectionKey: LayoutSectionKey;
  onHide: () => void;
  accentColor: string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sectionKey });

  const defaultTitle = SECTION_TITLES[sectionKey];
  const { title, setTitle } = useSectionTitle(sectionKey);

  return (
    <section
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "group/section relative rounded transition-shadow",
        isDragging
          ? "z-10 opacity-50 ring-1 ring-primary/30"
          : "hover:ring-1 hover:ring-primary/20"
      )}
    >
      {/* Floating toolbar: drag handle + hide — revealed on section hover */}
      <div className="absolute right-0 top-0 z-20 flex items-center gap-0.5 opacity-0 transition-opacity group-hover/section:opacity-100">
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder section"
          className="cursor-grab rounded p-0.5 text-content-tertiary transition-colors duration-150 hover:bg-surface-elevated hover:text-content-primary active:cursor-grabbing"
        >
          <GripVertical className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={onHide}
          aria-label="Hide section"
          className="cursor-pointer rounded p-0.5 text-content-tertiary transition-colors duration-150 hover:bg-surface-elevated hover:text-content-primary active:scale-90"
        >
          <EyeOff className="size-3.5" />
        </button>
      </div>

      {/* Section heading — title is click-to-edit, pr reserves space for toolbar */}
      <h2 className="mb-2 border-b-2 border-content-primary pb-1 pr-12 text-xs font-bold uppercase tracking-widest text-content-primary">
        <InlineEditableText
          as="span"
          value={title}
          onChange={setTitle}
          ariaLabel={`${defaultTitle} section title`}
          placeholder={defaultTitle}
          className="uppercase tracking-widest"
        />
      </h2>

      {renderSectionContent(sectionKey, accentColor)}
    </section>
  );
}

function renderSectionContent(
  key: LayoutSectionKey,
  accentColor: string
): ReactNode {
  switch (key) {
    case "summary":
      return (
        <EditableText
          field="summary"
          ariaLabel="Professional summary"
          placeholder="Write a short professional summary…"
          as="p"
          multiline
          className="text-xs leading-relaxed text-content-secondary"
        />
      );
    case "experience":
      return <EditableExperienceList accentColor={accentColor} />;
    case "projects":
      return <EditableProjectList accentColor={accentColor} />;
    case "skills":
      return <EditableSkillList accentColor={accentColor} />;
    case "education":
      return <EditableEducationList accentColor={accentColor} />;
    case "certifications":
      return <EditableCertificationList accentColor={accentColor} />;
    case "languages":
      return <EditableLanguageList />;
  }
}

// ─── Header ──────────────────────────────────────────────────────────────────

function EditableHeader({ accentColor }: { accentColor: string }) {
  return (
    <header className="border-b border-subtle pb-4">
      <EditableText
        field="fullName"
        ariaLabel="Full name"
        placeholder="Your Name"
        as="h1"
        className="text-3xl font-bold tracking-tight text-content-primary"
      />
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-content-secondary">
        <ContactField
          icon={Phone}
          field="phone"
          label="Phone"
          placeholder="+1 555 000 0000"
          accentColor={accentColor}
        />
        <ContactField
          icon={Mail}
          field="email"
          label="Email"
          placeholder="email@example.com"
          accentColor={accentColor}
        />
        <ContactField
          icon={Globe}
          field="website"
          label="Website"
          placeholder="website.com"
          accentColor={accentColor}
        />
        <ContactField
          icon={Linkedin}
          field="linkedinUrl"
          label="LinkedIn"
          placeholder="linkedin.com/in/you"
          accentColor={accentColor}
        />
        <ContactField
          icon={MapPin}
          field="location"
          label="Location"
          placeholder="City, Country"
          accentColor={accentColor}
        />
      </div>
    </header>
  );
}

function ContactField({
  icon: Icon,
  field,
  label,
  placeholder,
  accentColor,
}: {
  icon: LucideIcon;
  field: PersonalInfoField;
  label: string;
  placeholder: string;
  accentColor: string;
}) {
  return (
    <span className="flex items-center gap-1">
      <Icon className="h-3 w-3" style={{ color: accentColor }} />
      <EditableText
        field={field}
        ariaLabel={label}
        placeholder={placeholder}
        className="text-content-secondary"
      />
    </span>
  );
}
