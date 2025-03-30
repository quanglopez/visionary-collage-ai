import { ImageData } from './storage';

export interface CollageLayout {
  id: string;
  name: string;
  rows: number;
  columns: number;
  gaps: number;
}

export interface CollageCell {
  id: string;
  imageId?: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Collage {
  id: string;
  name: string;
  layout: CollageLayout;
  cells: CollageCell[];
  createdAt: Date;
  updatedAt: Date;
}

export const PRESET_LAYOUTS: CollageLayout[] = [
  { id: 'grid-2x2', name: '2x2 Grid', rows: 2, columns: 2, gaps: 10 },
  { id: 'grid-3x3', name: '3x3 Grid', rows: 3, columns: 3, gaps: 10 },
  { id: 'pinterest', name: 'Pinterest Style', rows: 3, columns: 4, gaps: 15 },
];

export const createCollage = (layout: CollageLayout, name: string = 'New Collage'): Collage => {
  const cells: CollageCell[] = [];
  const now = new Date();

  // Create cells based on layout
  for (let row = 0; row < layout.rows; row++) {
    for (let col = 0; col < layout.columns; col++) {
      cells.push({
        id: `cell-${row}-${col}`,
        x: col * (100 / layout.columns),
        y: row * (100 / layout.rows),
        width: 100 / layout.columns,
        height: 100 / layout.rows,
      });
    }
  }

  return {
    id: `collage-${Date.now()}`,
    name,
    layout,
    cells,
    createdAt: now,
    updatedAt: now,
  };
};

export const assignImageToCell = (collage: Collage, cellId: string, imageId: string): Collage => {
  return {
    ...collage,
    cells: collage.cells.map(cell => 
      cell.id === cellId ? { ...cell, imageId } : cell
    ),
    updatedAt: new Date(),
  };
};

export const removeImageFromCell = (collage: Collage, cellId: string): Collage => {
  return {
    ...collage,
    cells: collage.cells.map(cell => 
      cell.id === cellId ? { ...cell, imageId: undefined } : cell
    ),
    updatedAt: new Date(),
  };
};

export const updateCollageLayout = (collage: Collage, newLayout: CollageLayout): Collage => {
  // Create new cells based on new layout
  const cells: CollageCell[] = [];
  for (let row = 0; row < newLayout.rows; row++) {
    for (let col = 0; col < newLayout.columns; col++) {
      cells.push({
        id: `cell-${row}-${col}`,
        x: col * (100 / newLayout.columns),
        y: row * (100 / newLayout.rows),
        width: 100 / newLayout.columns,
        height: 100 / newLayout.rows,
      });
    }
  }

  return {
    ...collage,
    layout: newLayout,
    cells,
    updatedAt: new Date(),
  };
};
