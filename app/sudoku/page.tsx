"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useCallback, useEffect, useRef, useState } from "react";

const generateSudoku = () => {
  const puzzle = Array(9)
    .fill(null)
    .map(() => Array(9).fill(0));
  const solution = Array(9)
    .fill(null)
    .map(() => Array(9).fill(0));

  const isValid = (
    board: number[][],
    row: number,
    col: number,
    num: number
  ) => {
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num || board[x][col] === num) return false;
    }
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[boxRow + i][boxCol + j] === num) return false;
      }
    }
    return true;
  };

  const solveSudoku = (board: number[][]) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              if (solveSudoku(board)) {
                return true;
              } else {
                board[row][col] = 0;
              }
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  solveSudoku(solution);

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (Math.random() > 0.3) {
        puzzle[i][j] = solution[i][j];
      }
    }
  }

  return { puzzle, solution };
};

export default function SudokuGame() {
  const [game, setGame] = useState(() => generateSudoku());
  const [board, setBoard] = useState(game.puzzle);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(
    null
  );
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSections, setCompletedSections] = useState(new Set());
  const [animatingSections, setAnimatingSections] = useState(new Set());
  const [mistakes, setMistakes] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const checkCompletion = useCallback(() => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] !== game.solution[i][j]) {
          return false;
        }
      }
    }
    return true;
  }, [board, game.solution]);

  useEffect(() => {
    const completed = checkCompletion();
    setIsComplete(completed);
    if (completed) {
      setIsRunning(false);
    }
  }, [board, checkCompletion]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !gameOver && !isComplete) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, gameOver, isComplete]);

  useEffect(() => {
    if (animatingSections.size > 0) {
      const timer = setTimeout(() => {
        setAnimatingSections(new Set());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [animatingSections]);

  useEffect(() => {
    if (mistakes >= 3) {
      setGameOver(true);
      setIsRunning(false);
    }
  }, [mistakes]);

  const handleCellClick = (row: number, col: number) => {
    if (gameOver || isComplete) return;
    setSelectedCell([row, col]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
    if (!isRunning) {
      setIsRunning(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedCell || gameOver || isComplete) return;
    const [row, col] = selectedCell;
    const newValue = e.target.value === "" ? 0 : parseInt(e.target.value, 10);
    if (isNaN(newValue) || newValue < 0 || newValue > 9) return;
    const newBoard = board.map((row) => [...row]);
    newBoard[row][col] = newValue;

    if (newValue !== 0 && newValue !== game.solution[row][col]) {
      setMistakes((prev) => prev + 1);
    }

    setBoard(newBoard);
    checkCompletedSections(newBoard, row, col);
    setSelectedCell(null);
  };

  const handleClearCell = () => {
    if (!selectedCell || gameOver || isComplete) return;
    const [row, col] = selectedCell;
    const newBoard = board.map((row) => [...row]);
    newBoard[row][col] = 0;
    setBoard(newBoard);
  };

  const handleNewGame = () => {
    const newGame = generateSudoku();
    setGame(newGame);
    setBoard(newGame.puzzle);
    setSelectedCell(null);
    setIsComplete(false);
    setTimer(0);
    setIsRunning(false);
    setCompletedSections(new Set());
    setAnimatingSections(new Set());
    setMistakes(0);
    setGameOver(false);
  };

  const checkCompletedSections = (
    newBoard: number[][],
    row: number,
    col: number
  ) => {
    const newCompletedSections = new Set(completedSections);
    const newAnimatingSections = new Set(animatingSections);

    // Check row
    if ([...Array(9)].every((_, i) => newBoard[row][i] !== 0)) {
      const rowCorrect = [...Array(9)].every(
        (_, i) => newBoard[row][i] === game.solution[row][i]
      );
      if (rowCorrect && !completedSections.has(`row-${row}`)) {
        newCompletedSections.add(`row-${row}`);
        newAnimatingSections.add(`row-${row}`);
      }
    }

    // Check column
    if ([...Array(9)].every((_, i) => newBoard[i][col] !== 0)) {
      const colCorrect = [...Array(9)].every(
        (_, i) => newBoard[i][col] === game.solution[i][col]
      );
      if (colCorrect && !completedSections.has(`col-${col}`)) {
        newCompletedSections.add(`col-${col}`);
        newAnimatingSections.add(`col-${col}`);
      }
    }

    // Check square
    const squareRow = Math.floor(row / 3);
    const squareCol = Math.floor(col / 3);
    if (
      [...Array(3)].every((_, i) =>
        [...Array(3)].every(
          (_, j) => newBoard[squareRow * 3 + i][squareCol * 3 + j] !== 0
        )
      )
    ) {
      const squareCorrect = [...Array(3)].every((_, i) =>
        [...Array(3)].every(
          (_, j) =>
            newBoard[squareRow * 3 + i][squareCol * 3 + j] ===
            game.solution[squareRow * 3 + i][squareCol * 3 + j]
        )
      );
      const squareKey = `square-${squareRow}-${squareCol}`;
      if (squareCorrect && !completedSections.has(squareKey)) {
        newCompletedSections.add(squareKey);
        newAnimatingSections.add(squareKey);
      }
    }

    setCompletedSections(newCompletedSections);
    setAnimatingSections(newAnimatingSections);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[95vh] bg-gray-900">
      <h1 className="text-4xl font-bold mb-8">Sudoku Game</h1>
      <div className="mb-4 text-xl font-semibold">
        Time: {formatTime(timer)}
      </div>
      <div className="mb-4 text-xl font-semibold">Mistakes: {mistakes}/3</div>
      <div className="grid grid-cols-9 gap-px mb-4 bg-gray-900 p-px">
        {board.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className={`w-8 h-8 flex items-center justify-center text-gray-100 ${
                cell === 0 ? "bg-gray-400" : "bg-gray-700"
              } ${
                i % 3 === 2 && i !== 8 ? "border-b border-gray-900" : ""
              } ${j % 3 === 2 && j !== 8 ? "border-r border-gray-900" : ""} ${
                selectedCell && selectedCell[0] === i && selectedCell[1] === j
                  ? "bg-blue-200"
                  : game.puzzle[i][j] !== 0
                    ? "bg-gray-200"
                    : cell !== 0 && cell !== game.solution[i][j]
                      ? "bg-red-200"
                      : ""
              } ${
                animatingSections.has(`row-${i}`) ||
                animatingSections.has(`col-${j}`) ||
                animatingSections.has(
                  `square-${Math.floor(i / 3)}-${Math.floor(j / 3)}`
                )
                  ? "animate-pulse-green-3s"
                  : ""
              } cursor-pointer transition-all duration-300`}
              onClick={() => handleCellClick(i, j)}
            >
              {cell !== 0 && cell}
            </div>
          ))
        )}
      </div>
      <div className="mb-4 flex space-x-2">
        <Input
          type="number"
          min="1"
          max="9"
          value={
            selectedCell ? board[selectedCell[0]][selectedCell[1]] || "" : ""
          }
          onChange={handleInputChange}
          className="w-20 text-center bg-gray-700"
          ref={inputRef}
          disabled={gameOver || isComplete}
        />
        <Button onClick={handleClearCell} disabled={gameOver || isComplete}>
          Clear
        </Button>
      </div>
      <Button onClick={handleNewGame} className="mb-4 bg-blue-500">
        New Game
      </Button>
      {isComplete && (
        <div className="text-2xl font-bold text-green-600">
          Congratulations! You solved the puzzle in {formatTime(timer)}!
        </div>
      )}
      {gameOver && (
        <div className="text-2xl font-bold text-red-600">
          Game Over! You made 3 mistakes. Try again!
        </div>
      )}
      <style jsx global>{`
        @keyframes pulse-green-3s {
          0%,
          100% {
            background-color: transparent;
          }
          50% {
            background-color: rgba(34, 197, 94, 0.2);
          }
        }
        .animate-pulse-green-3s {
          animation: pulse-green-3s 3s;
        }
      `}</style>
    </div>
  );
}
