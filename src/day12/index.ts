import run from "aocrunner"
import { lines } from "../utils/index.js"
import { add, range, uniq } from "ramda"

const parseInput = (rawInput: string) => {
  return lines(rawInput).map((row) => {
    const [springs, conditions] = row.split(" ")
    return [[...springs], conditions.split(",").map(parseFloat)] as [
      string[],
      number[],
    ]
  })
}

const UNKNOWN = "?"
const OPERATIONAL = "."
const DAMAGED = "#"
const DETECTED = "@"

enum Spring {
  "?" = UNKNOWN,
  "." = OPERATIONAL,
  "#" = DAMAGED,
}

const getGroups = ([springs, conditions]: [string[], number[]]) => {
  const groups: string[][] = []

  let groupCount = 0
  let group: string[] = []
  let previousWasDamaged = false
  springs.forEach((spring, springIndex) => {
    if (spring === UNKNOWN) {
      group.push(spring)
    } else if (spring === DAMAGED) {
      group.push(spring)
    } else if (group.length > 0) {
      groups.push(group)
      group = []
    }
  })
  if (group.length > 0) {
    groups.push(group)
    group = []
  }
  return groups
}

const count = (row: [string[], number[]]) => {
  const groups = getGroups(row)
  const [springs, conditions] = row

  //???.### 1,1,3

  /**
   * for (group in groupd)
   * while (groupHasSpace(group))
   * fitMore()
   *
   * return true === (all groups consumed)
   *
   */
  // return groups

  let groupString = springs.join("")

  const replace = (
    currentString: string,
    i: number,
  ): string | false | (string | false)[] => {
    const damagedCount = conditions[i]
    i++

    let matches: { 0: string; index: number }[] = []
    range(0, currentString.length - damagedCount + 1).forEach((i) => {
      const damaged = [DAMAGED, DETECTED]
      const prev = currentString[i - 1]
      const next = currentString[i + damagedCount]
      const part = currentString.slice(i, i + damagedCount)
      const partBefore = currentString.slice(0, i)

      const wouldIgnorePriorDamage = partBefore.indexOf(DAMAGED) !== -1
      if (
        !damaged.includes(prev) &&
        !damaged.includes(next) &&
        !wouldIgnorePriorDamage &&
        part.match(new RegExp(`([${UNKNOWN}${DAMAGED}]{${damagedCount}})`))
      ) {
        matches.push({ 0: part, index: i })
      }
    })

    if (matches.length) {
      return matches
        .map((match) => {
          const variant = currentString
          const before = variant
            .slice(0, match.index)
            .replace(/\?/g, OPERATIONAL)

          const after = variant.slice((match.index ?? 0) + damagedCount)
          const replaced = Array(damagedCount).fill(DETECTED).join("")

          const newVariant = `${before}${replaced}${after}`

          return replace(newVariant, i)
        })
        .filter((variant) => !!variant && !(variant.length === 0))
        .flat()
    } else {
      const damagesMatched = (
        currentString
          // .replace(/#/g, "I")
          .match(new RegExp(`[${DETECTED}${DAMAGED}]{1}`, "g")) || []
      ).length
      const matchedDamageGroups =
        currentString.match(
          new RegExp(
            `(?<![${DAMAGED}${DETECTED}])([${DAMAGED}${DETECTED}])+(?![${DAMAGED}${DETECTED}])`,
            "g",
          ),
        ) || []
      const totalDamaged = conditions.reduce(add)
      // const done = matchedDamageGroups === totalDamaged

      // const done = matchedDamageGroups.every(
      //   (group, groupIndex) => group.length === conditions[groupIndex],
      // )

      const done =
        totalDamaged === damagesMatched &&
        conditions.every(
          (condition, conditionIndex) =>
            condition === matchedDamageGroups[conditionIndex]?.length,
        )

      return done ? currentString.replace(/\?/g, OPERATIONAL) : false
    }
  }

  const result = replace(groupString, 0)

  const totalInLine = conditions.reduce(add)
  const checkResult = (res) => {
    const checkedChars = [...groupString].every((templ, i) => {
      const repl = res[i]
      const ok =
        (templ === "#" && ["@", "#"].includes(repl)) ||
        (templ === "." && repl === ".") ||
        (templ === "?" && ["@", "."].includes(repl))

      return ok
    })

    const checkedTotal =
      totalInLine ===
      [...groupString].filter((c) => ["@", "#"].includes(c)).length

    const ollkorekt = checkedChars && checkedTotal
    return ollkorekt
  }
  const isValid = Array.isArray(result)
    ? result.every(checkResult)
    : checkResult(result)

  return Array.isArray(result)
    ? result.length
    : typeof result === "string"
    ? 1
    : 0
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  return (
    input
      .map(count)
      // .map((r) => r.length)
      .reduce(add)
  )
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  const unfold = ([springs, conditions]: [string[], number[]]) => [
    [...Array(5).fill(springs.join("")).join("?")],
    Array(5).fill(conditions).flat(),
  ]

  // console.log(input[0], unfold(input[0]))
  return input.map((row) => count(unfold(row))).reduce(add)
}

run({
  part1: {
    tests: [
      {
        input: `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`,
        expected: 525152,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
