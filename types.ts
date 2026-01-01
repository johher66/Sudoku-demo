
export type CellValue = number | null;

export interface SudokuCellData {
  value: CellValue;
  isInitial: boolean;
  isHighlight?: boolean;
}

export type SudokuBoard = SudokuCellData[][];
