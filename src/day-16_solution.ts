import { Expect, Equal } from 'type-testing';

/**
 * SOLUTION
 */

type Santa = '🎅🏼';
type SantaOrTree = Santa | '🎄';
type Row = ReadonlyArray<SantaOrTree>;
type Forest = ReadonlyArray<Row>;

type Some<X> = {
  readonly tag: 'some';
  readonly some: X;
};
type None = {
  readonly tag: 'none';
};

type FindSantaInRow<
  R extends Row,
  I extends ReadonlyArray<number> = [],
> = R extends readonly [infer H, ...infer T extends Row]
  ? H extends Santa
    ? Some<I['length']>
    : FindSantaInRow<T, [...I, 0]>
  : None;

type FindSanta<
  F extends Forest,
  I extends ReadonlyArray<number> = [],
> = F extends readonly [infer R extends Row, ...infer RestForest extends Forest]
  ? FindSantaInRow<R> extends infer Result extends Some<number>
    ? [I['length'], Result['some']]
    : FindSanta<RestForest, [...I, 0]>
  : None;

/**
 * TESTS
 */

type Forest0 = [
  ['🎅🏼', '🎄', '🎄', '🎄'],
  ['🎄', '🎄', '🎄', '🎄'],
  ['🎄', '🎄', '🎄', '🎄'],
  ['🎄', '🎄', '🎄', '🎄'],
];
type test_0_actual = FindSanta<Forest0>;
type test_0_expected = [0, 0];
type test_0 = Expect<Equal<test_0_expected, test_0_actual>>;

type Forest1 = [
  ['🎄', '🎄', '🎄', '🎄'],
  ['🎄', '🎄', '🎄', '🎄'],
  ['🎄', '🎄', '🎄', '🎄'],
  ['🎄', '🎅🏼', '🎄', '🎄'],
];
type test_1_actual = FindSanta<Forest1>;
type test_1_expected = [3, 1];
type test_1 = Expect<Equal<test_1_expected, test_1_actual>>;

type Forest2 = [
  ['🎄', '🎄', '🎄', '🎄'],
  ['🎄', '🎄', '🎄', '🎄'],
  ['🎄', '🎄', '🎅🏼', '🎄'],
  ['🎄', '🎄', '🎄', '🎄'],
];
type test_2_actual = FindSanta<Forest2>;
type test_2_expected = [2, 2];
type test_2 = Expect<Equal<test_2_expected, test_2_actual>>;

type Forest3 = [
  ['🎄', '🎄', '🎄', '🎄'],
  ['🎄', '🎄', '🎄', '🎄'],
  ['🎄', '🎅🏼', '🎄', '🎄'],
  ['🎄', '🎄', '🎄', '🎄'],
];
type test_3_actual = FindSanta<Forest3>;
type test_3_expected = [2, 1];
type test_3 = Expect<Equal<test_3_expected, test_3_actual>>;

type Forest4 = [
  ['🎄', '🎄', '🎄', '🎄'],
  ['🎄', '🎄', '🎅🏼', '🎄'],
  ['🎄', '🎄', '🎄', '🎄'],
  ['🎄', '🎄', '🎄', '🎄'],
];
type test_4_actual = FindSanta<Forest4>;
type test_4_expected = [1, 2];
type test_4 = Expect<Equal<test_4_expected, test_4_actual>>;
