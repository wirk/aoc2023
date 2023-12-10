import run from "aocrunner"
import { lines } from "../utils/index.js"
import { booleanPointInPolygon, point, polygon } from "@turf/turf"

const parseInput = (rawInput: string) => {
  return lines(rawInput).map((row) => [...row])
}

enum Pipe {
  EW = "-",
  NS = "|",
  SE = "F",
  SW = "7",
  NW = "J",
  NE = "L",
}

type Tile = Pipe | "." | "S"

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

const findStart = (input: string[][]) => {
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

  return {
    startPipe,
    startPos,
  }
}

const getLoop = (input: string[][]) => {
  const { startPipe, startPos } = findStart(input)

  let currentTile: Tile = startPipe
  let directionsFromTile: Direction[]
  // let steps = 0
  let position = startPos
  let lastDirection: Direction | undefined = undefined

  const positions = [position]

  while (
    (directionsFromTile = directions[currentTile as Pipe]) &&
    position.every((coordinate) => coordinate >= 0)
  ) {
    // steps++

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

    positions.push(position)
    currentTile = input[position[0]][position[1]] as Tile

    if (currentTile === "S") break
  }

  return positions
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const loop = getLoop(input)
  return Math.ceil((loop.length - 1) / 2)
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const loop = getLoop(input)

  return input
    .map((row, y) =>
      row
        .map((tile, x) =>
          booleanPointInPolygon(point([y, x]), polygon([loop]), {
            ignoreBoundary: true,
          }),
        )
        .filter((v) => v),
    )
    .flat().length
}

run({
  part1: {
    tests: [
      {
        input: `.....
.S-7.
.|.|.
.L-J.
.....`,
        expected: 4,
      },
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
        expected: 4,
      },
      {
        input: `.F----7F7F7F7F-7....
.|F--7||||||||FJ....
.||.FJ||||||||L7....
FJL7L7LJLJ||LJ.L-7..
L--J.L7...LJS7F-7L7.
....F-J..F7FJ|L7L7L7
....L7.F7||L7|.L7L7|
.....|FJLJ|FJ|F7|.LJ
....FJL-7.||.||||...
....L---J.LJ.LJLJ...`,
        expected: 8,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
