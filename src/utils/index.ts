export const match = {
  nums: /(\d+)/g,
}

export function numeralToDigit(v: string) {
  return +(
    {
      zero: 0,
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
    }[v] ?? v
  )
}

export const getTouchingRows = (rowIndex: number, rows: string[]) =>
  rows.slice(
    rowIndex === 0 ? 0 : rowIndex - 1,
    rowIndex === rows.length - 1 ? rowIndex + 1 : rowIndex + 2,
  )

export const between = (x: number, min: number, max: number) =>
  x >= min && x <= max

export const multiply = (prev: number, val: string | number) => +val * prev

export const add = (prev: number, val: string | number) => +val + prev

export const joinNumbers = (
  numbers: string | number | Array<string | number> | undefined,
  ...rest: Array<string | number | undefined>
) => +[numbers, rest].flat().join("")
