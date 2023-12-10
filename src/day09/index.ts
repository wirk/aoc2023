import run from "aocrunner"
import { add, lines } from "../utils/index.js"

const parseInput = (rawInput: string) => {
  return lines(rawInput).map((line) => line.trim().split(" ").map(parseFloat))
}

const numberDiffs = (nums: number[]) => {
  const diffs: number[] = []

  nums.forEach((num, i) => {
    if (i > 0) {
      diffs.push(num - (nums[i - 1] ?? 0))
    }
  })

  return diffs
}

function solve(input: number[][]) {
  return input
    .map((ln, li) => {
      const diffs = [numberDiffs(ln)]

      while (diffs[diffs.length - 1].some((v) => v !== 0)) {
        diffs.push(numberDiffs(diffs[diffs.length - 1]))
      }

      return (
        diffs.map((diffSet) => diffSet[diffSet.length - 1]).reduce(add) +
        ln[ln.length - 1]
      )
    })
    .reduce(add)
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return solve(input)
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return solve(input.map((row) => row.reverse()))
}

run({
  part1: {
    tests: [
      {
        input: `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`,
        expected: 114,
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
