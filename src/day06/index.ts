import run from "aocrunner"
import { joinNumbers, multiply } from "../utils/index.js"

const parseInput = (rawInput: string) => {
  let lines = rawInput.split("\n")
  const times = lines[0].match(/(\d+)/g)?.map((v) => +v) ?? []
  const distances = lines[1].match(/(\d+)/g)?.map((v) => +v) ?? []
  return { times, distances }
}

function solve(times: number[], distances: number[]) {
  return times
    .map((time, timeIndex) =>
      [...Array(time - 1)]
        .map((v, i) => i * (time - i))
        .filter((distance) => distance > distances[timeIndex]),
    )
    .map((distances) => distances.length)
    .reduce(multiply, 1)
}

const part1 = (rawInput: string) => {
  const { times, distances } = parseInput(rawInput)

  return solve(times, distances)
}

const part2 = (rawInput: string) => {
  const { times, distances } = parseInput(rawInput)

  return solve([joinNumbers(times)], [joinNumbers(distances)])
}

run({
  part1: {
    tests: [
      {
        input: `Time:      7  15   30
Distance:  9  40  200`,
        expected: 288,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      //       {
      //         input: `Time:      7  15   30
      // Distance:  9  40  200`,
      //         expected: "",
      //       },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
