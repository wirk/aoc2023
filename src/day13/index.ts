import run from "aocrunner"
import { add, lines } from "../utils/index.js"

const parseInput = (rawInput: string) => {
  return rawInput.split("\n\n").map((group) => lines(group))
}

const isHorizontalMirror = (group: string[], gapIndex: number) => {
  console.log("***", { gapIndex })
  for (let i = 0; i <= Math.min(gapIndex, group.length - gapIndex - 2); i++) {
    if (group[gapIndex - i] !== group[i + gapIndex + 1]) {
      return false
    }
  }

  return true
}

const isVerticalMirror = (group: string[], gapIndex: number) => {
  for (
    let i = 0;
    i <= Math.min(gapIndex, group[0].length - gapIndex - 2);
    i++
  ) {
    for (let rowIndex = 0; rowIndex <= group.length - 1; rowIndex++) {
      if (group[rowIndex][gapIndex - i] !== group[rowIndex][i + gapIndex + 1]) {
        return false
      }
    }
  }

  return true
}

const isHorizontalMirrorWithSmudge = (group: string[], gapIndex: number) => {
  let smudgeCount = 0
  for (let i = 0; i <= Math.min(gapIndex, group.length - gapIndex - 2); i++) {
    for (let colIndex = 0; colIndex <= group[0].length - 1; colIndex++) {
      if (group[gapIndex - i][colIndex] !== group[i + gapIndex + 1][colIndex]) {
        smudgeCount++
      }

      if (smudgeCount > 1) {
        return false
      }
    }
  }

  return smudgeCount === 1
}

const isVerticalMirrorWithSmudge = (group: string[], gapIndex: number) => {
  let smudgeCount = 0
  for (
    let i = 0;
    i <= Math.min(gapIndex, group[0].length - gapIndex - 2);
    i++
  ) {
    for (let rowIndex = 0; rowIndex <= group.length - 1; rowIndex++) {
      if (group[rowIndex][gapIndex - i] !== group[rowIndex][i + gapIndex + 1]) {
        smudgeCount++
      }

      if (smudgeCount > 1) {
        return false
      }
    }
  }

  return smudgeCount === 1
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return input
    .map((group) => {
      for (let gapIndex = 0; gapIndex <= group.length - 2; gapIndex++) {
        if (isHorizontalMirror(group, gapIndex)) {
          return 100 * (gapIndex + 1)
        }
      }

      for (let gapIndex = 0; gapIndex <= group[0].length - 2; gapIndex++) {
        if (isVerticalMirror(group, gapIndex)) {
          return gapIndex + 1
        }
      }
      return 0
    })
    .reduce(add)
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return input
    .map((group) => {
      for (let gapIndex = 0; gapIndex <= group.length - 2; gapIndex++) {
        if (isHorizontalMirrorWithSmudge(group, gapIndex)) {
          return 100 * (gapIndex + 1)
        }
      }

      for (let gapIndex = 0; gapIndex <= group[0].length - 2; gapIndex++) {
        if (isVerticalMirrorWithSmudge(group, gapIndex)) {
          return gapIndex + 1
        }
      }
      return 0
    })
    .reduce(add)
}

run({
  part1: {
    tests: [
      {
        input: `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`,
        expected: 405,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `#.##..##.
..#.##.#.
##......#
##......#
..#.##.#.
..##..##.
#.#.##.#.

#...##..#
#....#..#
..##..###
#####.##.
#####.##.
..##..###
#....#..#`,
        expected: 400,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
