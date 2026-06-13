import { computePageCount, pageBreakOffsets } from './paginated-sheet';

describe('computePageCount', () => {
  it('returns a single page when content fits', () => {
    expect(computePageCount(800, 1000)).toBe(1);
    expect(computePageCount(1000, 1000)).toBe(1);
  });

  it('rounds up to cover any overflow', () => {
    expect(computePageCount(1001, 1000)).toBe(2);
    expect(computePageCount(2500, 1000)).toBe(3);
  });

  it('never returns fewer than one page', () => {
    expect(computePageCount(0, 1000)).toBe(1);
  });

  it('guards against a zero or negative page height', () => {
    expect(computePageCount(5000, 0)).toBe(1);
  });
});

describe('pageBreakOffsets', () => {
  it('has no breaks for a single page', () => {
    expect(pageBreakOffsets(1, 1000)).toEqual([]);
  });

  it('places a break at the top of each page after the first', () => {
    expect(pageBreakOffsets(2, 1000)).toEqual([1000]);
    expect(pageBreakOffsets(3, 1000)).toEqual([1000, 2000]);
  });
});
