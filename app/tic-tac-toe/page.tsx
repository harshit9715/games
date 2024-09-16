"use client";
import { Button } from "@/components/ui/button";
import React, { useCallback, useState } from "react";

type Player = "X" | "O" | null;
type BlockState = Player[];
type BoardState = BlockState[];
type WinState = Player[];

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const Cell: React.FC<{
  value: Player;
  onClick: () => void;
  disabled: boolean;
}> = ({ value, onClick, disabled }) => (
  <button
    className={`w-12 h-12 border border-gray-900 flex items-center justify-center text-xl font-bold ${
      disabled ? "cursor-not-allowed bg-gray-900" : "hover:bg-gray-400"
    } ${value === "X" ? "text-blue-500" : "text-red-500"}`}
    onClick={onClick}
    disabled={disabled}
  >
    {value}
  </button>
);

const Block: React.FC<{
  state: BlockState;
  blockIndex: number;
  onCellClick: (blockIndex: number, cellIndex: number) => void;
  activeBlock: number | null;
  winner: Player;
}> = ({ state, blockIndex, onCellClick, activeBlock, winner }) => (
  <div
    className={`grid grid-cols-3 gap-1 p-2 ${winner ? "bg-green-600" : "bg-gray-700"}`}
  >
    {state.map((cell, cellIndex) => (
      <Cell
        key={cellIndex}
        value={cell}
        onClick={() => onCellClick(blockIndex, cellIndex)}
        disabled={
          winner !== null ||
          (activeBlock !== null && activeBlock !== blockIndex)
        }
      />
    ))}
  </div>
);

const Board: React.FC<{
  board: BoardState;
  blockWinners: WinState;
  onCellClick: (blockIndex: number, cellIndex: number) => void;
  activeBlock: number | null;
}> = ({ board, blockWinners, onCellClick, activeBlock }) => (
  <div className="grid grid-cols-3 gap-2 bg-gray-700 p-2">
    {board.map((block, blockIndex) => (
      <Block
        key={blockIndex}
        state={block}
        blockIndex={blockIndex}
        onCellClick={onCellClick}
        activeBlock={activeBlock}
        winner={blockWinners[blockIndex]}
      />
    ))}
  </div>
);

const checkWinner = (state: Player[]): Player => {
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    if (state[a] && state[a] === state[b] && state[a] === state[c]) {
      return state[a];
    }
  }
  return null;
};

export default function Game() {
  const [board, setBoard] = useState<BoardState>(
    Array(9)
      .fill(null)
      .map(() => Array(9).fill(null))
  );
  const [blockWinners, setBlockWinners] = useState<WinState>(
    Array(9).fill(null)
  );
  const [activeBlock, setActiveBlock] = useState<number | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [gameWinner, setGameWinner] = useState<Player>(null);

  const handleCellClick = useCallback(
    (blockIndex: number, cellIndex: number) => {
      if (
        gameWinner ||
        (activeBlock !== null && activeBlock !== blockIndex) ||
        board[blockIndex][cellIndex]
      ) {
        return;
      }

      const newBoard = board.map((block, bIndex) =>
        bIndex === blockIndex
          ? block.map((cell, cIndex) =>
              cIndex === cellIndex ? currentPlayer : cell
            )
          : block
      );

      const newBlockWinners = [...blockWinners];
      if (!newBlockWinners[blockIndex]) {
        const blockWinner = checkWinner(newBoard[blockIndex]);
        if (blockWinner) {
          newBlockWinners[blockIndex] = blockWinner;
          const gameWinner = checkWinner(newBlockWinners);
          if (gameWinner) {
            setGameWinner(gameWinner);
          }
        }
      }

      setBoard(newBoard);
      setBlockWinners(newBlockWinners);
      setActiveBlock(newBlockWinners[cellIndex] ? null : cellIndex);
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    },
    [board, blockWinners, activeBlock, currentPlayer, gameWinner]
  );

  const resetGame = () => {
    setBoard(
      Array(9)
        .fill(null)
        .map(() => Array(9).fill(null))
    );
    setBlockWinners(Array(9).fill(null));
    setActiveBlock(null);
    setCurrentPlayer("X");
    setGameWinner(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[95vh] bg-gray-900">
      <h1 className="text-4xl font-bold mb-4">Advanced Tic Tac Toe</h1>
      <Board
        board={board}
        blockWinners={blockWinners}
        onCellClick={handleCellClick}
        activeBlock={activeBlock}
      />
      <div className="mt-4 text-xl font-semibold">
        {gameWinner
          ? `Player ${gameWinner} wins!`
          : `Current player: ${currentPlayer}`}
      </div>
      <Button onClick={resetGame} className="mb-4 mt-2 bg-yellow-500">
        Reset Game
      </Button>
    </div>
  );
}
