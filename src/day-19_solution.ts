import { Expect, Equal } from 'type-testing';

/**
 * SOLUTION
 */

// type AddOne<T extends number, _I extends 0[] = []> = _I['length'] extends T
//   ? [..._I, 0]['length']
//   : AddOne<T, [..._I, 0]>;

// type TupleOf<
//   T,
//   N extends number,
//   Acc extends T[] = [],
// > = Acc['length'] extends N ? Acc : TupleOf<T, N, [T, ...Acc]>;

// type ItemsMap = {
//   1: '🛹';
//   2: '🚲';
//   3: '🛴';
//   4: '🏄';
// };

// type Rebuild<
//   T extends number[],
//   _Acc extends unknown[] = [],
//   _I extends keyof ItemsMap = 1,
// > = T extends [infer Count extends number, ...infer Tail extends number[]]
//   ? Rebuild<
//       Tail,
//       [..._Acc, ...TupleOf<ItemsMap[_I], Count>],
//       AddOne<_I> extends keyof ItemsMap ? AddOne<_I> : 1
//     >
//   : _Acc;

type Items<
  I extends string,
  C extends number,
  R extends ReadonlyArray<string> = [],
> = R['length'] extends C ? R : Items<I, C, [...R, I]>;

export type Rebuild<
  List extends ReadonlyArray<number>,
  Loop extends ReadonlyArray<string> = ['🛹', '🚲', '🛴', '🏄'],
  R extends ReadonlyArray<string> = [],
> = [List, Loop] extends [
  [infer H extends number, ...infer Rest extends ReadonlyArray<number>],
  [infer LH extends string, ...infer LRest extends ReadonlyArray<string>],
]
  ? Rest extends []
    ? [...R, ...Items<LH, H>]
    : [...R, ...Items<LH, H>] extends infer S extends ReadonlyArray<string>
      ? Rebuild<Rest, [...LRest, LH], S>
      : never
  : never;

/**
 * TESTS
 */

type test_0_actual = Rebuild<[2, 1, 3, 3, 1, 1, 2]>;
type test_0_expected = [
  '🛹',
  '🛹',
  '🚲',
  '🛴',
  '🛴',
  '🛴',
  '🏄',
  '🏄',
  '🏄',
  '🛹',
  '🚲',
  '🛴',
  '🛴',
];
type test_0 = Expect<Equal<test_0_expected, test_0_actual>>;

type test_1_actual = Rebuild<[3, 3, 2, 1, 2, 1, 2]>;
type test_1_expected = [
  '🛹',
  '🛹',
  '🛹',
  '🚲',
  '🚲',
  '🚲',
  '🛴',
  '🛴',
  '🏄',
  '🛹',
  '🛹',
  '🚲',
  '🛴',
  '🛴',
];
type test_1 = Expect<Equal<test_1_expected, test_1_actual>>;

type test_2_actual = Rebuild<[2, 3, 3, 5, 1, 1, 2]>;
type test_2_expected = [
  '🛹',
  '🛹',
  '🚲',
  '🚲',
  '🚲',
  '🛴',
  '🛴',
  '🛴',
  '🏄',
  '🏄',
  '🏄',
  '🏄',
  '🏄',
  '🛹',
  '🚲',
  '🛴',
  '🛴',
];
type test_2 = Expect<Equal<test_2_expected, test_2_actual>>;
