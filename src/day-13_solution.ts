import { Expect, Equal } from 'type-testing';

///

// type List<N extends number, T extends any[] = []> = T['length'] extends N
//   ? T
//   : List<N, [...T, any]>;

// type Increment<N extends number> = [
//   ...List<N>,
//   any,
// ]['length'] extends infer Length
//   ? Length extends number
//     ? Length
//     : never
//   : never;

// type DayCounter2<From extends number, To extends number> = To extends From
//   ? To
//   : From | DayCounter2<Increment<From>, To>;

// ////

// type DayCounter<
//   T1 extends number,
//   T2 extends number,
//   Result extends number[] = [T1, T2],
// > = Result['length'] extends T2
//   ? Result[number]
//   : DayCounter<T1, T2, [...Result, Result['length']]>;

type Enumerate<
  N extends number,
  Acc extends number[] = [],
> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>;

type Increment<N, Acc extends number[] = []> = Acc['length'] extends N
  ? [...Acc, 0]['length']
  : Increment<N, [...Acc, 0]>;

type DayCounter<Start extends number, End extends number> = Exclude<
  Enumerate<Increment<End>>,
  Enumerate<Start>
>;

type TwelveDaysOfChristmas = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type test_0_actual = DayCounter<1, 12>;
type test_0_expected = TwelveDaysOfChristmas;
type test_0 = Expect<Equal<test_0_expected, test_0_actual>>;

type DaysUntilChristmas =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25;
type test_1_actual = DayCounter<1, 25>;
type test_1_expected = DaysUntilChristmas;
type test_1 = Expect<Equal<test_1_expected, test_1_actual>>;
