'use client';

import type { ReactNode } from 'react';
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface SortableEntryListProps<T extends { id: string }> {
  items: T[];
  onReorder: (from: number, to: number) => void;
  renderItem: (item: T) => ReactNode;
  /** Spacing/layout for the list container. */
  className?: string;
}

/**
 * Wraps a list of entries with drag-to-reorder via dnd-kit. A grip handle
 * appears in the left margin on hover; dropping an entry calls `onReorder` with
 * the from/to indices. Kept generic so every editable section reuses it without
 * touching the entry editors themselves.
 */
export function SortableEntryList<T extends { id: string }>({
  items,
  onReorder,
  renderItem,
  className,
}: SortableEntryListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = items.findIndex((item) => item.id === active.id);
    const to = items.findIndex((item) => item.id === over.id);
    if (from !== -1 && to !== -1) onReorder(from, to);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className={className}>
          {items.map((item) => (
            <SortableEntry key={item.id} id={item.id}>
              {renderItem(item)}
            </SortableEntry>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableEntry({ id, children }: { id: string; children: ReactNode }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      className='group/sortable relative'
    >
      <button
        type='button'
        {...attributes}
        {...listeners}
        aria-label='Drag to reorder'
        className='absolute top-0 -left-5 cursor-grab text-content-tertiary opacity-30 transition-opacity group-hover/sortable:opacity-100'
      >
        <GripVertical className='size-3.5' />
      </button>
      {children}
    </div>
  );
}
