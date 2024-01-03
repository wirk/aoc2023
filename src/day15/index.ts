import run from "aocrunner"
import { lines } from "../utils/index.js"
import { add, range } from "ramda"

const parseInput = (rawInput: string) => {
  return rawInput.split(",")
}

const hash = (step: string) => {
  let currentValue = 0
  step
    .split("")
    .forEach(
      (char) =>
        (currentValue = (17 * (currentValue + char.charCodeAt(0))) % 256),
    )
  return currentValue
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return input.map(hash).reduce(add)

  // return currentValue
}

type Lens = { label: string; focalLength: number }
const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  // const boxes: Map<string, Lens>[] = []
  const boxes: Lens[][] = range(0, 256).map(() => [])

  input.forEach((step) => {
    const [_, label, sign, focalLength] = step.match(/(\w+)([=-])(\d*)/i) ?? []
    const boxNumber = hash(label)
    const existingLensIndex = boxes[boxNumber].findIndex(
      (lens) => lens.label === label,
    )

    if (sign === "-" && existingLensIndex !== -1) {
      boxes[boxNumber].splice(existingLensIndex, 1)
    } else if (sign === "=") {
      const focalLengthAsNumber = parseInt(focalLength, 10)
      const lens: Lens = { label, focalLength: focalLengthAsNumber }

      if (existingLensIndex === -1) {
        boxes[boxNumber].push(lens)
      } else {
        boxes[boxNumber][existingLensIndex].focalLength = lens.focalLength
      }
    }
  })
  const focusingPower = boxes
    .map((lenses, boxNo) => ({ boxNo, lenses }))
    .filter((row) => row.lenses.length)
    .map((row) => {
      return row.lenses
        .map(
          (lens, slotIndex) =>
            (row.boxNo + 1) * (slotIndex + 1) * lens.focalLength,
        )
        .reduce(add)
    })
    .reduce(add)
  // console.log(focusingPower)

  return focusingPower
}

run({
  part1: {
    tests: [
      {
        input: `HASH`,
        expected: 52,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`,
        expected: 145,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
