"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const GRID_SIZE = 10;
const NUM_MINES = 15;

type CellState = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
};

export default function Minesweeper() {
  const [grid, setGrid] = useState<CellState[][]>([]);
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">(
    "playing"
  );

  useEffect(() => {
    initializeGrid();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeGrid = () => {
    const newGrid: CellState[][] = Array(GRID_SIZE)
      .fill(null)
      .map(() =>
        Array(GRID_SIZE)
          .fill(null)
          .map(() => ({
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            neighborMines: 0,
          }))
      );

    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < NUM_MINES) {
      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * GRID_SIZE);
      if (!newGrid[row][col].isMine) {
        newGrid[row][col].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbor mines
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (!newGrid[row][col].isMine) {
          newGrid[row][col].neighborMines = countNeighborMines(
            newGrid,
            row,
            col
          );
        }
      }
    }

    setGrid(newGrid);
    setGameStatus("playing");
  };

  const countNeighborMines = (
    grid: CellState[][],
    row: number,
    col: number
  ) => {
    let count = 0;
    for (
      let r = Math.max(0, row - 1);
      r <= Math.min(GRID_SIZE - 1, row + 1);
      r++
    ) {
      for (
        let c = Math.max(0, col - 1);
        c <= Math.min(GRID_SIZE - 1, col + 1);
        c++
      ) {
        if (grid[r][c].isMine) count++;
      }
    }
    return count;
  };

  const revealCell = (row: number, col: number) => {
    if (
      gameStatus !== "playing" ||
      grid[row][col].isRevealed ||
      grid[row][col].isFlagged
    )
      return;

    const newGrid = [...grid];
    newGrid[row][col].isRevealed = true;

    if (newGrid[row][col].isMine) {
      setGameStatus("lost");
      return;
    }

    if (newGrid[row][col].neighborMines === 0) {
      revealNeighbors(newGrid, row, col);
    }

    setGrid(newGrid);

    if (checkWinCondition(newGrid)) {
      setGameStatus("won");
    }
  };

  const revealNeighbors = (grid: CellState[][], row: number, col: number) => {
    for (
      let r = Math.max(0, row - 1);
      r <= Math.min(GRID_SIZE - 1, row + 1);
      r++
    ) {
      for (
        let c = Math.max(0, col - 1);
        c <= Math.min(GRID_SIZE - 1, col + 1);
        c++
      ) {
        if (!grid[r][c].isRevealed && !grid[r][c].isFlagged) {
          grid[r][c].isRevealed = true;
          if (grid[r][c].neighborMines === 0) {
            revealNeighbors(grid, r, c);
          }
        }
      }
    }
  };

  const toggleFlag = (row: number, col: number) => {
    if (gameStatus !== "playing" || grid[row][col].isRevealed) return;

    const newGrid = [...grid];
    newGrid[row][col].isFlagged = !newGrid[row][col].isFlagged;
    setGrid(newGrid);
  };

  const checkWinCondition = (grid: CellState[][]) => {
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (!grid[row][col].isMine && !grid[row][col].isRevealed) {
          return false;
        }
      }
    }
    return true;
  };

  const getCellContent = (cell: CellState) => {
    if (!cell.isRevealed) return cell.isFlagged ? "🚩" : "";
    if (cell.isMine) return "💣";
    return cell.neighborMines > 0 ? cell.neighborMines : "";
  };

  const getCellColor = (cell: CellState) => {
    if (!cell.isRevealed)
      return "bg-gray-900 hover:bg-blue-600 focus:outline-none cursor-pointer";
    if (cell.isMine) return "bg-red-500";
    return "bg-gray-700 cursor-default";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[95vh] bg-gray-900">
      <h1 className="text-4xl font-bold mb-4">Minesweeper</h1>
      <div className="mb-4">
        <Button onClick={initializeGrid}>New Game</Button>
      </div>
      <div className="grid gap-1 p-2 bg-gray-700 rounded-md shadow-lg">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={`w-8 h-8 rounded-sm flex text-black items-center ml-1 first:ml-0 justify-center font-bold ${getCellColor(cell)}`}
                onClick={() => revealCell(rowIndex, colIndex)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  toggleFlag(rowIndex, colIndex);
                }}
              >
                {getCellContent(cell)}
              </button>
            ))}
          </div>
        ))}
      </div>
      {gameStatus !== "playing" && (
        <div className="mt-4 text-2xl font-bold">
          {gameStatus === "won" ? "You Won!" : "Game Over!"}
        </div>
      )}
    </div>
  );
}
