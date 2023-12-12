import run from "aocrunner"
import { add, between, lines } from "../utils/index.js"
import { range } from "ramda"

const parseInput = (rawInput: string) => {
  return lines(rawInput).map((row) => [...row])
}

function getEmptySpace(input: string[][]) {
  const emptyCols: number[] = []
  const emptyRows: number[] = []
  for (let c = 0; c < input[0].length; c++) {
    if (range(0, input.length).every((r) => input[r][c] === ".")) {
      emptyCols.push(c)
    }
  }

  for (let r = input.length - 1; r >= 0; r--) {
    if (input[r].every((c) => c === ".")) {
      emptyRows.push(r)
    }
  }

  return { emptyCols, emptyRows }
}

function expand(input: any[][]) {
  const emptyCols: number[] = []
  for (let c = 0; c < input[0].length; c++) {
    if (range(0, input.length).every((r) => input[r][c] === ".")) {
      emptyCols.push(c)
    }
  }

  emptyCols.reverse().forEach((c) => input.forEach((r) => r.splice(c, 0, ".")))

  for (let r = input.length - 1; r >= 0; r--) {
    if (input[r].every((c) => c === ".")) {
      input.splice(r, 0, [...input[r]])
    }
  }
}

function getGalaxyPositions(input: any[][]) {
  const positions: number[][] = []
  input.forEach((r, y) =>
    r.forEach((c, x) => {
      if (c === "#") {
        positions.push([y, x])
      }
    }),
  )
  return positions
}

function getDistanceSum(input: string[][], spaceMultiplier = 1) {
  const positions = getGalaxyPositions(input)
  const { emptyCols, emptyRows } = getEmptySpace(input)

  return positions
    .flatMap((pos, posIndex) => {
      return positions
        .filter((_, posIndexCompare) => posIndex < posIndexCompare)
        .map((compPos) => {
          const extraRows =
            emptyRows.filter((r) => between(r, pos[0], compPos[0])).length *
            spaceMultiplier

          const extraCols =
            emptyCols.filter((c) => between(c, pos[1], compPos[1])).length *
            spaceMultiplier

          const rowDiff = Math.abs(pos[0] - compPos[0])
          const colDiff = Math.abs(pos[1] - compPos[1])

          return rowDiff + colDiff + extraRows + extraCols
        })
    })
    .reduce(add)
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return getDistanceSum(input)
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return getDistanceSum(input, 1000000 - 1)
}

run({
  part1: {
    tests: [
      {
        input: `...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....`,
        expected: 374,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
