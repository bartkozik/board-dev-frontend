import { useEffect, useState, RefObject } from 'react';

function calculateMaxHeight(rows: HTMLTableRowElement[]): number {
  let maxH = 0;

  rows.forEach((tr) => {
    tr.style.height = 'auto';
    const h = tr.offsetHeight;
    if (h > maxH) {
      maxH = h;
    }
  });

  return maxH;
}

function groupRowsByAttribute(
  rows: NodeListOf<HTMLTableRowElement>,
  attributeName: string
): Record<string, HTMLTableRowElement[]> {
  const mapOfRows: Record<string, HTMLTableRowElement[]> = {};

  rows.forEach((tr) => {
    const rowId = tr.getAttribute(attributeName);
    if (!rowId) return;

    if (!mapOfRows[rowId]) mapOfRows[rowId] = [];
    mapOfRows[rowId].push(tr);
  });

  return mapOfRows;
}

function calculateHeightsForGroups(mapOfRows: Record<string, HTMLTableRowElement[]>): Record<string, number> {
  const newRowHeights: Record<string, number> = {};

  Object.keys(mapOfRows).forEach((rowId) => {
    newRowHeights[rowId] = calculateMaxHeight(mapOfRows[rowId]);
  });

  return newRowHeights;
}

interface UseTableRowHeightsReturn {
  rowHeights: Record<string, number>;
}

interface UseTabelRowHeightsArgs {
  containerRef: RefObject<HTMLDivElement>;
  isLoading: boolean;
  rowSelector?: string;
  attributeName?: string;
  deps?: unknown[];
}

export const useTableRowHeights = ({
  containerRef,
  isLoading,
  rowSelector = 'tr[data-row-id]',
  attributeName = 'data-row-id',
  deps = [],
}: UseTabelRowHeightsArgs): UseTableRowHeightsReturn => {
  const [rowHeights, setRowHeights] = useState<Record<string, number>>({});

  useEffect(() => {
    if (isLoading || !containerRef.current) return;

    const allRows = containerRef.current.querySelectorAll<HTMLTableRowElement>(rowSelector);

    const mapOfRows = groupRowsByAttribute(allRows, attributeName);

    const newRowHeights = calculateHeightsForGroups(mapOfRows);

    setRowHeights(newRowHeights);
  }, [containerRef, isLoading, ...deps]);

  return { rowHeights };
};
