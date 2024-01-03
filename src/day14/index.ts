import run from "aocrunner"
import { lines } from "../utils/index.js"
import { add } from "ramda"

const parseInput = (rawInput: string) => {
  return lines(rawInput).map((row) => row.split(""))
}

const CUBE_SHAPED_ROCK = "#"
const ROUNDED_ROCK = "O"
const EMPTY_SPACE = "."

const tiltNorth = (rows: string[][]) => {
  for (let x = 0; x < rows[0].length; x++) {
    for (let y = 0; y < rows.length; y++) {
      if (rows[y][x] === EMPTY_SPACE) {
        for (let sy = y + 1; sy < rows.length; sy++) {
          if (rows[sy][x] === CUBE_SHAPED_ROCK) {
            break
          }
          if (rows[sy][x] === ROUNDED_ROCK) {
            rows[y][x] = ROUNDED_ROCK
            rows[sy][x] = EMPTY_SPACE
            break
          }
        }
      }
    }
  }
}

const tiltEast = (rows: string[][]) => {
  for (let x = rows[0].length - 1; x >= 0; x--) {
    for (let y = 0; y < rows.length; y++) {
      if (rows[y][x] === EMPTY_SPACE) {
        for (let sx = x - 1; sx >= 0; sx--) {
          if (rows[y][sx] === CUBE_SHAPED_ROCK) {
            break
          }
          if (rows[y][sx] === ROUNDED_ROCK) {
            rows[y][x] = ROUNDED_ROCK
            rows[y][sx] = EMPTY_SPACE
            break
          }
        }
      }
    }
  }
}

const tiltSouth = (rows: string[][]) => {
  for (let x = 0; x < rows[0].length; x++) {
    for (let y = rows.length - 1; y >= 0; y--) {
      if (rows[y][x] === EMPTY_SPACE) {
        for (let sy = y - 1; sy >= 0; sy--) {
          try {
            if (rows[sy][x] === CUBE_SHAPED_ROCK) {
              break
            }
            if (rows[sy][x] === ROUNDED_ROCK) {
              rows[y][x] = ROUNDED_ROCK
              rows[sy][x] = EMPTY_SPACE
              break
            }
          } catch (e) {
            console.log("erer", { y, sy, x })
          }
        }
      }
    }
  }
}

const tiltWest = (rows: string[][]) => {
  for (let x = 0; x < rows[0].length; x++) {
    for (let y = 0; y < rows.length; y++) {
      if (rows[y][x] === EMPTY_SPACE) {
        for (let sx = x + 1; sx < rows[0].length; sx++) {
          if (rows[y][sx] === CUBE_SHAPED_ROCK) {
            break
          }
          if (rows[y][sx] === ROUNDED_ROCK) {
            rows[y][x] = ROUNDED_ROCK
            rows[y][sx] = EMPTY_SPACE
            break
          }
        }
      }
    }
  }
}

const weigh = (rows: string[][]) => {
  return rows
    .reverse()
    .map((row, ri) => row.filter((c) => c === ROUNDED_ROCK).length * (ri + 1))
    .reduce(add)
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)

  tiltNorth(input)
  return weigh(input)
}

const getCurrent = (input: string[][]) =>
  input.map((r) => r.join("")).join("\n")

const printCurrent = (input: string[][]) => {
  console.log(getCurrent(input))
  console.log(" ")
  console.log(" ")
}

function spinCycle(input: string[][]) {
  tiltNorth(input)
  tiltWest(input)
  tiltSouth(input)
  tiltEast(input)
}

function determineResultIndex(i1: number, i2: number, cycleCount: number) {
  return i1 + ((cycleCount - i1) % (i2 - i1))
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  const results: string[] = []

  let i1 = 0
  let i2 = 0
  let i = 0
  while (i2 === 0) {
    const current = getCurrent(input)
    const firstOccurrence = results.findIndex((r) => r === current)
    const secondOccurrence = results.findIndex(
      (r, index) => r === current && index !== firstOccurrence,
    )

    if (firstOccurrence !== -1 && secondOccurrence !== -1) {
      i1 = firstOccurrence
      i2 = secondOccurrence

      break
    }

    results.push(current)
    i++
    spinCycle(input)
  }

  // results[n] = after n cycles
  // results[0] = 0 cycles
  // results[1] = 1 cycle
  console.log({ i1, i2 })
  const resultIndex = determineResultIndex(i1, i2, 1000000000)

  console.log(determineResultIndex(i1, i2, 0))
  console.log(determineResultIndex(i1, i2, 1))
  console.log(determineResultIndex(i1, i2, 2))
  console.log(determineResultIndex(i1, i2, 3))
  console.log(determineResultIndex(i1, i2, 4))
  console.log(determineResultIndex(i1, i2, 5))
  console.log(determineResultIndex(i1, i2, 6))
  console.log(determineResultIndex(i1, i2, 7))
  console.log(determineResultIndex(i1, i2, 8))

  // results.map((res, i) => console.log({ i, weight: weigh(parseInput(res)) }))
  console.log({ resultIndex })

  return weigh(parseInput(results[resultIndex]))
}

run({
  part1: {
    tests: [
      {
        input: `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`,
        expected: 136,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `O....#....
O.OO#....#
.....##...
OO.#O....O
.O.....O#.
O.#..O.#.#
..O..#O..O
.......O..
#....###..
#OO..#....`,
        expected: 64,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
