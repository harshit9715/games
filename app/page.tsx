import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Gamepad, Grid, Brain } from "lucide-react";

export default function GamesPortalLanding() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Welcome to Game Zone
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Your one-stop destination for classic games. Enjoy Snake,
                  Minesweeper, and Sudoku all in one place!
                </p>
              </div>
            </div>
          </div>
        </section>
        <section
          id="games"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
        >
          <div className="container px-4 md:px-6 text-black mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              All Games
            </h2>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-white p-4 rounded-full">
                  <Gamepad className="h-12 w-12 text-green-500" />
                </div>
                <h3 className="text-xl font-bold">Snake</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  {
                    "The classic game of snake. Eat, grow, and don't hit the walls!"
                  }
                </p>
                <Link href="/snake">
                  <Button variant="outline">Play Snake</Button>
                </Link>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-white p-4 rounded-full">
                  <Grid className="h-12 w-12 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold">Minesweeper</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Clear the minefield without detonating any mines. Use logic
                  and strategy!
                </p>
                <Link href="/minesweeper">
                  <Button variant="outline">Play Minesweeper</Button>
                </Link>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-white p-4 rounded-full">
                  <Brain className="h-12 w-12 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold">Sudoku</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Fill the grid so that every row, column, and 3x3 box contains
                  the digits 1-9.
                </p>
                <Link href="/sudoku">
                  <Button variant="outline">Play Sudoku</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      {/* <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        
      </footer> */}
    </div>
  );
}
