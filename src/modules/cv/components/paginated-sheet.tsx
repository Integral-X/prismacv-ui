'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

const PX_PER_MM = 96 / 25.4;

/** A4 page height (297mm) in CSS pixels at 96dpi — matches the sheet's height. */
export const A4_PAGE_HEIGHT_PX = Math.round(297 * PX_PER_MM);

/** How many A4 pages the rendered content spans. */
export function computePageCount(
  contentHeightPx: number,
  pageHeightPx: number
): number {
  if (pageHeightPx <= 0) return 1;
  return Math.max(1, Math.ceil(contentHeightPx / pageHeightPx));
}

/** Vertical offsets (px from the top) of each page break after the first page. */
export function pageBreakOffsets(
  pageCount: number,
  pageHeightPx: number
): number[] {
  const offsets: number[] = [];
  for (let page = 1; page < pageCount; page += 1) {
    offsets.push(page * pageHeightPx);
  }
  return offsets;
}

/**
 * Wraps the rendered resume and overlays a page-break marker at every A4
 * boundary, so the editor shows where content spills onto page 2, 3, … like
 * Enhancv. The content flows continuously (one render) so inline editing is
 * untouched; the actual paginated PDF is produced separately by the print path.
 */
export function PaginatedSheet({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    function measure() {
      if (!element) return;
      setPageCount(computePageCount(element.scrollHeight, A4_PAGE_HEIGHT_PX));
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const breaks = pageBreakOffsets(pageCount, A4_PAGE_HEIGHT_PX);

  return (
    <div ref={ref} className='relative mx-auto w-[210mm]'>
      {children}
      {breaks.map((offset, index) => (
        <div
          key={offset}
          aria-hidden
          className='pointer-events-none absolute inset-x-0 flex items-center gap-3'
          style={{ top: offset }}
        >
          <div className='h-0 flex-1 border-t border-dashed border-subtle' />
          <span className='rounded-full bg-surface-elevated px-2 py-0.5 text-[10px] font-medium text-content-tertiary shadow-sm'>
            Page {index + 2}
          </span>
          <div className='h-0 flex-1 border-t border-dashed border-subtle' />
        </div>
      ))}
    </div>
  );
}
