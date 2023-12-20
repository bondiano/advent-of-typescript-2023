import { Expect, Equal } from 'type-testing';

/**
 * SOLUTION
 */

type BuildList<
  Count,
  El,
  Output extends unknown[] = [],
> = Output['length'] extends Count
  ? Output
  : BuildList<Count, El, [...Output, El]>;

type NextEl = {
  '🛹': '🚲';
  '🚲': '🛴';
  '🛴': '🏄';
  '🏄': '🛹';
};

type Rebuild<T, Output extends unknown[] = []> = T extends [
  infer Head,
  ...infer Rest,
]
  ? Output extends [...infer _Head, infer Last extends keyof NextEl]
    ? Rebuild<Rest, [...Output, ...BuildList<Head, NextEl[Last]>]>
    : Rebuild<Rest, [...Output, ...BuildList<Head, '🛹'>]>
  : Output;

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
