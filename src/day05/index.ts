import run from "aocrunner"
import { match } from "../utils/index.js"

const parseInput = (rawInput: string) => {
  return rawInput
}

type MapConfig = { destStart: number; sourceStart: number; len: number }
const getMap = (input: string, name: string) => {
  return (
    input
      .match(new RegExp(`${name}:(\n(\\d( ?)+)*)+`, "g"))?.[0]
      .match(/((\d( ?)+)+)/g)
      ?.map((str) => [...(str.match(match.nums) ?? [])].map(parseFloat)) ?? []
  ).map(([destStart, sourceStart, len]) => ({
    destStart,
    sourceStart,
    len,
  }))
}
function getMappedVal(val: any, mapConfigs: MapConfig[]) {
  const conf = mapConfigs.find(
    (c) => val >= c.sourceStart && val < c.sourceStart + c.len,
  )
  if (conf) {
    return conf.destStart + (val - conf.sourceStart)
  } else {
    return val
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)

  const seeds = input
    .match(new RegExp(`${"seeds"}:( \\d+)*`, "g"))?.[0]
    .match(match.nums)
    ?.map(parseFloat)

  const seedToSoilMap = getMap(input, "seed-to-soil map")
  const soilToFertilizerMap = getMap(input, "soil-to-fertilizer map")
  const fertilizerToWaterMap = getMap(input, "fertilizer-to-water map")
  const waterToLightMap = getMap(input, "water-to-light map")
  const lightToTemperatureMap = getMap(input, "light-to-temperature map")
  const temperatureToHumidityMap = getMap(input, "temperature-to-humidity map")
  const humidityToLocationMap = getMap(input, "humidity-to-location map")

  return seeds
    ?.map((seed) => {
      const soil = getMappedVal(seed, seedToSoilMap)
      const fertilizer = getMappedVal(soil, soilToFertilizerMap)
      const water = getMappedVal(fertilizer, fertilizerToWaterMap)
      const light = getMappedVal(water, waterToLightMap)
      const temperature = getMappedVal(light, lightToTemperatureMap)
      const humidity = getMappedVal(temperature, temperatureToHumidityMap)
      return getMappedVal(humidity, humidityToLocationMap)
    })
    .sort((a, b) => a - b)[0]
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)

  const seedToSoilMap = getMap(input, "seed-to-soil map")
  const soilToFertilizerMap = getMap(input, "soil-to-fertilizer map")
  const fertilizerToWaterMap = getMap(input, "fertilizer-to-water map")
  const waterToLightMap = getMap(input, "water-to-light map")
  const lightToTemperatureMap = getMap(input, "light-to-temperature map")
  const temperatureToHumidityMap = getMap(input, "temperature-to-humidity map")
  const humidityToLocationMap = getMap(input, "humidity-to-location map")

  let numbers =
    input
      .match(new RegExp(`seeds:( \\d+)*`, "g"))?.[0]
      .match(match.nums)
      ?.map(parseFloat) ?? []
  let smallestLoc

  for (let i = 0; i < numbers.length / 2; i++) {
    const start = numbers[i * 2]
    const len = numbers[i * 2 + 1]
    const end = start + len - 1
    for (let seed = start; seed <= end; seed++) {
      const soil = getMappedVal(seed, seedToSoilMap)
      const fertilizer = getMappedVal(soil, soilToFertilizerMap)
      const water = getMappedVal(fertilizer, fertilizerToWaterMap)
      const light = getMappedVal(water, waterToLightMap)
      const temperature = getMappedVal(light, lightToTemperatureMap)
      const humidity = getMappedVal(temperature, temperatureToHumidityMap)
      const location = getMappedVal(humidity, humidityToLocationMap)
      if (!smallestLoc || location < smallestLoc) {
        smallestLoc = location
      }
    }
  }

  return smallestLoc
}

run({
  part1: {
    tests: [
      {
        input: `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`,
        expected: 35,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`,
        expected: 46,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
