import run from "aocrunner"
import { lines } from "../utils/index.js"
import { add } from "ramda"

const parseInput = (rawInput: string): Tile[][] => {
  return lines(rawInput).map((line) =>
    line.split("").map((c) => ({
      c,
      isEmpty: c === ".",
      isMirror: ["\\", "/"].includes(c),
      isSplitter: ["|", "-"].includes(c),
      beamSources: [],
    })),
  )
}

type Direction = "N" | "E" | "S" | "W"
type Position = [y: number, x: number]
type Beam = {
  direction: Direction
  position: Position
  done: boolean
}
type Tile = {
  c: string
  isEmpty: boolean
  isMirror: boolean
  isSplitter: boolean
  beamSources: Direction[]
}

type Matrix = Position
const matrices: Record<Direction, Matrix> = {
  N: [-1, 0],
  E: [0, 1],
  S: [1, 0],
  W: [0, -1],
}

const opposites: Record<Direction, Direction> = {
  N: "S",
  E: "W",
  S: "N",
  W: "E",
}

const directions: Record<string, Record<Direction, Direction[]>> = {
  ".": { N: ["N"], E: ["E"], S: ["S"], W: ["W"] },
  "\\": { N: ["W"], E: ["S"], S: ["E"], W: ["N"] },
  "/": { N: ["E"], E: ["N"], S: ["W"], W: ["S"] },
  "|": { N: ["N"], E: ["N", "S"], S: ["S"], W: ["N", "S"] },
  "-": { N: ["W", "E"], E: ["E"], S: ["W", "E"], W: ["W"] },
}

const debug = (input: Tile[][]) => {
  console.log(
    input
      .map((row) =>
        row
          .map((tile) => {
            if (tile.c !== "." || !tile.beamSources.length) {
              return tile.c
            } else if (tile.beamSources.length === 1) {
              return { N: "v", E: "<", S: "^", W: ">" }[tile.beamSources[0]]
            } else {
              return tile.beamSources.length
            }
          })
          .join(""),
      )
      .join("\n"),
  )
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  let beams: Beam[] = [{ direction: "E", position: [0, -1], done: false }]

  const move = (beam: Beam) => {
    const matrix = matrices[beam.direction]

    const newPosition: Position = beam.position.map(
      (coordinate, index) => coordinate + matrix[index],
    ) as Position
    const tileAtNewPosition = input[newPosition[0]]?.[newPosition[1]]

    if (
      tileAtNewPosition &&
      !tileAtNewPosition.beamSources.includes(opposites[beam.direction])
    ) {
      tileAtNewPosition.beamSources.push(opposites[beam.direction])
      return directions[tileAtNewPosition.c][beam.direction].map(
        (direction): Beam => ({
          direction,
          position: newPosition,
          done: false,
        }),
      )
    } else {
      beam.done = true
      return [beam]
    }
  }

  const step = () => {
    beams = beams.flatMap((beam, beamIndex) => {
      if (beam.done) {
        return [beam]
      }
      return move(beam)
    })
  }

  while (beams.some((beam) => !beam.done)) {
    step()
  }

  // debug(input)

  return input
    .map((row) => row.filter((tile) => !!tile.beamSources.length).length)
    .reduce(add)
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return
}

run({
  part1: {
    tests: [
      {
        input: `.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`,
        expected: 46,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
