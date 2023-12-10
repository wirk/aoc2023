import run from "aocrunner"
import { lines } from "../utils/index.js"

const parseInput = (rawInput: string) => {
  return lines(rawInput)
}

enum Pipe {
  EW = "-",
  NS = "|",
  SE = "F",
  SW = "7",
  NW = "J",
  NE = "L",
}

enum Direction {
  N = "N",
  E = "E",
  S = "S",
  W = "W",
}

const directions = {
  [Pipe.EW]: [Direction.E, Direction.W],
  [Pipe.NS]: [Direction.S, Direction.N],
  [Pipe.SE]: [Direction.S, Direction.E],
  [Pipe.SW]: [Direction.S, Direction.W],
  [Pipe.NW]: [Direction.N, Direction.W],
  [Pipe.NE]: [Direction.N, Direction.E],
}

const opposites = {
  [Direction.N]: Direction.S,
  [Direction.E]: Direction.W,
  [Direction.S]: Direction.N,
  [Direction.W]: Direction.E,
}

const matrices = {
  N: [-1, 0],
  E: [0, 1],
  S: [1, 0],
  W: [0, -1],
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput).map((row) => [...row])

  const startPos: number[] = []

  input.forEach((r, ri) => {
    const ci = r.findIndex((c) => c === "S")
    if (ci !== -1) startPos.push(ri, ci)
  })

  const startN = input[startPos[0] - 1][startPos[1]]
  const startW = input[startPos[0]][startPos[1] - 1]
  const startS = input[startPos[0] + 1][startPos[1]]
  const startE = input[startPos[0]][startPos[1] + 1]

  const startDirections: Direction[] = []
  if (startN !== "." && directions[startN as Pipe]?.includes(Direction.S)) {
    startDirections.push(Direction.N)
  }
  if (startE !== "." && directions[startE as Pipe]?.includes(Direction.W)) {
    startDirections.push(Direction.E)
  }
  if (startS !== "." && directions[startS as Pipe]?.includes(Direction.N)) {
    startDirections.push(Direction.S)
  }
  if (startW !== "." && directions[startW as Pipe]?.includes(Direction.E)) {
    startDirections.push(Direction.W)
  }

  const startPipe = Object.keys(directions).find((pipe) =>
    directions[pipe as Pipe].every((direction) =>
      startDirections.includes(direction),
    ),
  ) as Pipe

  const countSteps = (tile: string, rowIndex: number, cellIndex: number) => {
    let currentTile = tile
    let directionsFromTile: Direction[]
    let steps = 0
    let position = [rowIndex, cellIndex]
    let lastDirection: Direction | undefined = undefined

    while (
      (directionsFromTile = directions[currentTile as Pipe]) &&
      position.every((coordinate) => coordinate >= 0)
    ) {
      steps++

      const directionIndex: number = lastDirection
        ? directionsFromTile.findIndex(
            (direction) =>
              !!lastDirection && direction !== opposites[lastDirection],
          )
        : 0

      lastDirection = directionsFromTile[directionIndex]
      const directions = matrices[lastDirection]
      position = position.map(
        (coordinate, index) => coordinate + directions[index],
      )

      currentTile = input[position[0]][position[1]]

      if (currentTile === "S") break
    }

    return steps
  }

  const loopLength = countSteps(startPipe, startPos[0], startPos[1])

  return Math.ceil(loopLength / 2)
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return
}

run({
  part1: {
    tests: [
      // {
      //         input: `.....
      // .S-7.
      // .|.|.
      // .L-J.
      // .....`,
      //         expected: 4,
      //       },
      {
        input: `..F7.
.FJ|.
SJ.L7
|F--J
LJ...`,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `...........
.S-------7.
.|F-----7|.
.||.....||.
.||.....||.
.|L-7.F-J|.
.|..|.|..|.
.L--J.L--J.
...........`,
        expected: "",
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
