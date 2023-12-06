import run from "aocrunner"
import { joinNumbers, numeralToDigit } from "../utils/index.js"

const parseInput = (rawInput: string) => {
  return rawInput.split("\n")
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return input.reduce((prev, line) => {
    const matches = line.match(/(\d)/g)
    return prev + joinNumbers(matches?.[0], matches?.[matches.length - 1])
  }, 0)
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return input.reduce((prev, line) => {
    const matches = [
      ...line.matchAll(
        /(?=(\d|one|two|three|four|five|six|seven|eight|nine))/g,
      ),
    ].map((v) => v[1])

    return (
      prev +
      joinNumbers([
        numeralToDigit(matches[0]),
        numeralToDigit(matches[matches.length - 1]),
      ])
    )
  }, 0)
}

run({
  part1: {
    solution: part1,
  },
  part2: {
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
