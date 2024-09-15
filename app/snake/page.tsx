'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"

// Define types
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
type Position = [number, number]

const GRID_SIZE = 20
const CELL_SIZE = 20
const INITIAL_SNAKE: Position[] = [[5, 5]]
const INITIAL_FOOD: Position = [10, 10]
const INITIAL_DIRECTION: Direction = 'RIGHT'
const GAME_SPEED = 100 // milliseconds

export default function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE)
  const [food, setFood] = useState<Position>(INITIAL_FOOD)
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)

  const moveSnake = useCallback(() => {
    const newSnake = [...snake]
    const [headY, headX] = newSnake[0]

    let newHead: Position
    switch (direction) {
      case 'UP':
        newHead = [headY - 1, headX]
        break
      case 'DOWN':
        newHead = [headY + 1, headX]
        break
      case 'LEFT':
        newHead = [headY, headX - 1]
        break
      case 'RIGHT':
        newHead = [headY, headX + 1]
        break
    }

    // Check for collisions
    if (
      newHead[0] < 0 || newHead[0] >= GRID_SIZE ||
      newHead[1] < 0 || newHead[1] >= GRID_SIZE ||
      snake.some(segment => segment[0] === newHead[0] && segment[1] === newHead[1])
    ) {
      setGameOver(true)
      return
    }

    newSnake.unshift(newHead)

    // Check if snake ate food
    if (newHead[0] === food[0] && newHead[1] === food[1]) {
      setScore(prevScore => prevScore + 1)
      generateFood(newSnake)
    } else {
      newSnake.pop()
    }

    setSnake(newSnake)
  }, [snake, direction, food])

  const generateFood = (currentSnake: Position[]) => {
    let newFood: Position
    do {
      newFood = [
        Math.floor(Math.random() * GRID_SIZE),
        Math.floor(Math.random() * GRID_SIZE)
      ]
    } while (currentSnake.some(segment => segment[0] === newFood[0] && segment[1] === newFood[1]))
    setFood(newFood)
  }

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        setDirection(prev => prev !== 'DOWN' ? 'UP' : prev)
        break
      case 'ArrowDown':
        setDirection(prev => prev !== 'UP' ? 'DOWN' : prev)
        break
      case 'ArrowLeft':
        setDirection(prev => prev !== 'RIGHT' ? 'LEFT' : prev)
        break
      case 'ArrowRight':
        setDirection(prev => prev !== 'LEFT' ? 'RIGHT' : prev)
        break
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  useEffect(() => {
    if (!gameOver) {
      const gameLoop = setInterval(moveSnake, GAME_SPEED)
      return () => clearInterval(gameLoop)
    }
  }, [gameOver, moveSnake])

  const resetGame = () => {
    setSnake(INITIAL_SNAKE)
    setFood(INITIAL_FOOD)
    setDirection(INITIAL_DIRECTION)
    setGameOver(false)
    setScore(0)
  }

  const getHeadStyle = () => {
    let rotation = 0
    switch (direction) {
      case 'UP':
        rotation = 0
        break
      case 'DOWN':
        rotation = 180
        break
      case 'LEFT':
        rotation = 270
        break
      case 'RIGHT':
        rotation = 90
        break
    }
    return {
      transform: `rotate(${rotation}deg)`,
      borderRadius: '50% 50% 0 0',
      backgroundColor: 'green',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: CELL_SIZE,
      height: CELL_SIZE,
    }
  }

  const getTailStyle = () => {
    let rotation = 0
    switch (direction) {
      case 'UP':
        rotation = 180
        break
      case 'DOWN':
        rotation = 0
        break
      case 'LEFT':
        rotation = 90
        break
      case 'RIGHT':
        rotation = 270
        break
    }
    return {
      transform: `rotate(${rotation}deg)`,
      borderRadius: '50% 50% 0 0',
      backgroundColor: 'green',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: CELL_SIZE,
      height: CELL_SIZE,
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[95vh] bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Snake Game</h1>
      <div className="mb-4">Score: {score}</div>
      <div 
        className="border-2 border-gray-800" 
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
          position: 'relative'
        }}
      >
        {snake.map((segment, index) => {
          const isHead = index === 0
          const isTail = index === snake.length - 1
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: segment[0] * CELL_SIZE,
                left: segment[1] * CELL_SIZE,
                ...(isHead ? getHeadStyle() : (isTail ? getTailStyle() : { width: CELL_SIZE, height: CELL_SIZE, backgroundColor: 'green' }))
              }}
            >
              {isHead && <span style={{ fontSize: '12px' }}>{direction === 'LEFT' || direction === 'RIGHT' ? '::' : ':'}</span>}
            </div>
          )
        })}
        <div
          className="bg-red-500"
          style={{
            position: 'absolute',
            top: food[0] * CELL_SIZE,
            left: food[1] * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
            borderRadius: '50%'
          }}
        />
      </div>
      {gameOver && (
        <div className="mt-4">
          <p className="text-xl font-bold mb-2">Game Over!</p>
          <Button onClick={resetGame}>Play Again</Button>
        </div>
      )}
      <div className="mt-4 text-sm text-gray-600">
        Use arrow keys to control the snake
      </div>
    </div>
  )
}