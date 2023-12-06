import run from "aocrunner"

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n")
  const games = lines.map((lineStr) => {
    const matches = lineStr.match(/Game (\d+): (.*)/)

    // @ts-ignore
    const id = parseFloat(matches?.[1])
    const sets = matches?.[2].split("; ").map((set) => {
      const res = { red: 0, green: 0, blue: 0 }
      set.split(", ").forEach((cubes) => {
        const [count, color] = cubes.split(" ")
        // @ts-ignore
        res[color] = parseFloat(count)
      })

      return res
    })
    return { id, sets }
  })

  return games
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)

  const max = {
    red: 12,
    green: 13,
    blue: 14,
  }

  return input
    .filter((game) =>
      // @ts-ignore
      game.sets.every(
        (set) =>
          set.red <= max.red && set.green <= max.green && set.blue <= max.blue,
      ),
    )
    .map(({ id }) => id)
    .reduce((prev, curr) => prev + curr)
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  return input
    .map(({ sets }) => {
      const red = sets?.map(({ red }) => red).sort((a, b) => b - a)
      const green = sets?.map(({ green }) => green).sort((a, b) => b - a)
      const blue = sets?.map(({ blue }) => blue).sort((a, b) => b - a)

      return (red?.[0] ?? 0) * (green?.[0] ?? 0) * (blue?.[0] ?? 0)
    })
    .reduce((prev, curr) => prev + curr)

  // return
}

run({
  part1: {
    tests: [
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: 2286,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
