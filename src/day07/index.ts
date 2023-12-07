import run from "aocrunner"
import { add, lines, split } from "../utils/index.js"
import { groupBy } from "ramda"

const cardValues = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  T: 10,
  "9": 9,
  "8": 8,
  "7": 7,
  "6": 6,
  "5": 5,
  "4": 4,
  "3": 3,
  "2": 2,
}

const cardValuesPart2 = {
  A: 14,
  K: 13,
  Q: 12,
  T: 10,
  "9": 9,
  "8": 8,
  "7": 7,
  "6": 6,
  "5": 5,
  "4": 4,
  "3": 3,
  "2": 2,
  J: 1,
}

type Card = keyof typeof cardValues
type Hand = Card[]

const parseInput = (rawInput: string) => {
  return lines(rawInput).map(split(" "))
}

enum HandType {
  HIGH_CARD,
  ONE_PAIR,
  TWO_PAIR,
  THREE_OF_A_KIND,
  FULL_HOUSE,
  FOUR_OF_A_KIND,
  FIVE_OF_A_KIND,
}

const {
  HIGH_CARD,
  ONE_PAIR,
  TWO_PAIR,
  THREE_OF_A_KIND,
  FULL_HOUSE,
  FOUR_OF_A_KIND,
  FIVE_OF_A_KIND,
} = HandType

function handTypeByGroups(groups: Card[][]) {
  const hasGroupOfSize = (l: number) =>
    groups.some((group) => group?.length === l)

  if (hasGroupOfSize(5)) {
    return FIVE_OF_A_KIND
  } else if (hasGroupOfSize(4)) {
    return FOUR_OF_A_KIND
  } else if (hasGroupOfSize(3) && hasGroupOfSize(2)) {
    return FULL_HOUSE
  } else if (hasGroupOfSize(3)) {
    return THREE_OF_A_KIND
  } else if (groups.length === 3) {
    return TWO_PAIR
  } else if (groups.length === 4) {
    return ONE_PAIR
  } else {
    return HIGH_CARD
  }
}

function getHandType(h: string | Hand) {
  const byLabel = groupBy((c: string) => c)
  const grouped = byLabel([...h])
  const groups = Object.values(grouped) as Card[][]
  return handTypeByGroups(groups)
}

function getHandTypeWithJokers(h: string) {
  const groupByLabel = groupBy((c: string) => c)
  const grouped = groupByLabel([...h])
  let groups = Object.values(grouped) as Card[][]

  if (h.includes("J")) {
    const cardsBySubstitutionValue = Object.keys(grouped)
      .filter((k) => k !== "J")
      .sort((a, b) => {
        const byCount = (grouped[b]?.length ?? 0) - (grouped[a]?.length ?? 0)
        return byCount === 0
          ? cardValuesPart2[b as Card] - cardValuesPart2[a as Card]
          : byCount
      })

    const hsub = h.replace(/J/g, cardsBySubstitutionValue[0])

    groups = Object.values(groupByLabel([...hsub])) as Card[][]
  }

  return handTypeByGroups(groups)
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return input
    .map(([h, b]): [h: Hand, b: number, t: HandType] => [
      h as unknown as Hand,
      +b,
      getHandType(h),
    ])
    .sort((a, b) => {
      const handDiff = +a[2] - +b[2]
      if (handDiff === 0) {
        for (let i = 0; i < 5; i++) {
          const res = cardValues[a[0][i]] - cardValues[b[0][i]]
          if (res !== 0) return res
        }
        return 0
      } else {
        return handDiff
      }
    })
    .map((h, i) => h[1] * (i + 1))
    .reduce(add)
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  const sorted = input
    .map(([h, b]): [h: Hand, b: number, t: HandType] => [
      h as unknown as Hand,
      +b,
      getHandTypeWithJokers(h),
    ])
    .sort((a, b) => {
      const handDiff = +a[2] - +b[2]
      if (handDiff === 0) {
        for (let i = 0; i < 5; i++) {
          const cardA = a[0][i]
          const cardB = b[0][i]
          const res = cardValuesPart2[cardA] - cardValuesPart2[cardB]
          if (res !== 0) return res
        }
        return 0
      } else {
        return handDiff
      }
    })

  return sorted.map((h, i) => h[1] * (i + 1)).reduce(add)
}

run({
  part1: {
    tests: [
      {
        input: `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`,
        expected: 6440,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`,
        expected: 5905,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
