import run from "aocrunner"
import { leastCommonMultiple, lines } from "../utils/index.js"
import { curry } from "ramda"

const parseInput = (rawInput: string) => {
  return lines(rawInput)
}

const createDirectionIndex = curry((directionString: string, step: number) => {
  const indexMap = { L: 0, R: 1 }
  const dir = directionString[step % directionString.length] as "L" | "R"

  return indexMap[dir]
})

function createNodes(input: string[]) {
  const nodes: Record<string, [string, string]> = {}
  for (let i = 2; i < input.length; i++) {
    nodes[input[i].slice(0, 3)] = [
      input[i].slice(7, 10),
      input[i].slice(12, 15),
    ]
  }
  return nodes
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const getDirIndex = createDirectionIndex(input[0])

  const nodes = createNodes(input)

  let steps = 0
  let currentStep = "AAA"

  while (currentStep !== "ZZZ") {
    const node = nodes[currentStep]
    currentStep = node[getDirIndex(steps)]
    steps++
  }

  return steps
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const getDirIndex = createDirectionIndex(input[0])

  const nodes = createNodes(input)

  const startingSteps = Object.keys(nodes).filter((key) => key.endsWith("A"))

  const stepCounts = startingSteps.map((start) => {
    let currentStep = start
    let node
    let steps = 0
    while (!currentStep.endsWith("Z")) {
      node = nodes[currentStep]
      currentStep = node[getDirIndex(steps)]
      steps++
    }
    return steps
  })

  return leastCommonMultiple(stepCounts)
}

run({
  part1: {
    tests: [
      {
        input: `RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)`,
        expected: 2,
      },
      {
        input: `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`,
        expected: 6,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
