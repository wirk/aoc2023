import run from "aocrunner"

function splitNumbers(win: string) {
  return win
    .split(" ")
    .filter((v) => v.trim() !== "")
    .map((n) => +n)
}

const parseInput = (rawInput: string) => {
  return rawInput.split("\n").map((line) => {
    let [win, own] = line.split(": ")[1].split(" | ")
    return { win: splitNumbers(win), own: splitNumbers(own) }
  })
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  return input
    .map((card) => {
      let winningNumbers = card.own.filter((num) => card.win.includes(num))
      const winningCount = winningNumbers.length

      return winningCount ? Math.pow(2, winningCount - 1) : 0
    })
    .reduce((prev, points) => prev + points)
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  const cardInstances: { cardNumber: number; processed: boolean }[] = input.map(
    (_, i) => ({ cardNumber: i + 1, processed: false }),
  )

  const createCopies = (start: number, amount: number) =>
    [...Array(amount)].forEach((v, i) => {
      const cardNumber = start + i
      const newCard = { cardNumber: cardNumber, processed: true }
      cardInstances.push(newCard)
      const winningAmount = determineWinningAmount(cardNumber)

      createCopies(cardNumber + 1, winningAmount)
    })

  const totalNumberOfCardTypes = input.length

  function determineWinningAmount(cardNumber: number) {
    const card = input[cardNumber - 1]
    let winningNumbers = card.own.filter((num) => card.win.includes(num))

    return Math.min(winningNumbers.length, totalNumberOfCardTypes - cardNumber)
  }

  cardInstances.forEach((card, cardIndex) => {
    const winningAmount = determineWinningAmount(cardIndex + 1)

    createCopies(cardIndex + 2, winningAmount)
  })

  return cardInstances.length
}

run({
  part1: {
    tests: [
      {
        input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: 30,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
