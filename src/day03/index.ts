import run from "aocrunner"
import { between, getTouchingRows } from "../utils/index.js"

const parseInput = (rawInput: string) => {
  return rawInput.split("\n")
}

const isSymbol = (v: string) => v.match(/[^\d.\s]/)

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  return input
    .map((row, rowIndex) =>
      [...row.matchAll(/(\d+)/g)]
        .filter((match) => {
          const index = match.index as number
          const numberLength = match[1].length

          return [
            rowIndex > 0
              ? input[rowIndex - 1]?.slice(
                  index === 0 ? 0 : index - 1,
                  index + numberLength + 1,
                )
              : "",
            ...[row[index - 1], row[index + numberLength]],
            rowIndex < input.length - 1
              ? input[rowIndex + 1]?.slice(
                  index === 0 ? 0 : index - 1,
                  index + numberLength + 1,
                )
              : "",
          ]
            .filter((v) => v !== undefined)
            .some(isSymbol)
        })
        .map((match) => +match[1]),
    )
    .flat()
    .reduce((prev, curr) => prev + curr)
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return input
    .map((row, rowIndex) => {
      const gearsInRow = [...row.matchAll(/[*]/g)]

      if (!gearsInRow.length) {
        return []
      } else {
        return gearsInRow
          .map((gear) => gear.index as number)
          .map((gearIndex) =>
            getTouchingRows(rowIndex, input)
              .map((touchingRow) =>
                [...touchingRow.matchAll(/(\d+)/g)]
                  .filter(
                    (numberMatch) =>
                      between(
                        (numberMatch.index as number) +
                          numberMatch[1].length -
                          1,
                        gearIndex - 1,
                        gearIndex + 1,
                      ) ||
                      between(
                        numberMatch.index as number,
                        gearIndex - 1,
                        gearIndex + 1,
                      ),
                  )
                  .map((numberMatch) => numberMatch[1]),
              )
              .flat(),
          )
      }
    })
    .flat()
    .filter((res) => res?.length === 2)
    .map((parts) => parts.reduce((prev, partNum) => +partNum * prev, 1))
    .reduce((prev, curr) => prev + curr)
}

run({
  part1: {
    tests: [
      {
        input: `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
        expected: 4361,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`,
        expected: 467835,
      },
      {
        input: `.........
......870
..514*...
.........`,
        expected: 447180,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
