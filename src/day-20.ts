import { Equal, Expect } from 'type-testing';
/**
 * SOLUTION
 */

/* eslint-disable prettier/prettier */
type Letters = {
  A: [
    '█▀█ ',
    '█▀█ ',
    '▀ ▀ ',
  ],
  B: [
    '█▀▄ ',
    '█▀▄ ',
    '▀▀  '
  ],
  C: [
    '█▀▀ ',
    '█ ░░',
    '▀▀▀ '
  ],
  E: [
    '█▀▀ ',
    '█▀▀ ',
    '▀▀▀ '
  ],
  H: [
    '█ █ ',
    '█▀█ ',
    '▀ ▀ '
  ],
  I: [
    '█ ',
    '█ ',
    '▀ '
  ],
  M: [
    '█▄░▄█ ',
    '█ ▀ █ ',
    '▀ ░░▀ '
  ],
  N: [
    '█▄░█ ',
    '█ ▀█ ',
    '▀ ░▀ '
  ],
  P: [
    '█▀█ ',
    '█▀▀ ',
    '▀ ░░'
  ],
  R: [
    '█▀█ ',
    '██▀ ',
    '▀ ▀ '
  ],
  S: [
    '█▀▀ ',
    '▀▀█ ',
    '▀▀▀ '
  ],
  T: [
    '▀█▀ ',
    '░█ ░',
    '░▀ ░'
  ],
  Y: [
    '█ █ ',
    '▀█▀ ',
    '░▀ ░'
  ],
  W: [
    '█ ░░█ ',
    '█▄▀▄█ ',
    '▀ ░ ▀ '
  ],
  ' ': [
    '░',
    '░',
    '░'
  ],
  ':': [
    '#',
    '░',
    '#'
  ],
  '*': [
    '░',
    '#',
    '░'
  ],
};
/* eslint-enable prettier/prettier */

type ToAsciiArtLine<
  Str,
  Output extends [string, string, string] = ['', '', ''],
> = Str extends `${infer Char}${infer Rest}`
  ? Char extends keyof Letters
    ? ToAsciiArtLine<
        Rest,
        [
          `${Output[0]}${Letters[Char][0]}`,
          `${Output[1]}${Letters[Char][1]}`,
          `${Output[2]}${Letters[Char][2]}`,
        ]
      >
    : Rest
  : Output;

type ToAsciiArt<
  Str,
  Output extends string[] = [],
> = Str extends `${infer Line}\n${infer Rest}`
  ? ToAsciiArt<Rest, [...Output, ...ToAsciiArtLine<Uppercase<Line>>]>
  : Str extends `${infer Line}`
    ? [...Output, ...ToAsciiArtLine<Uppercase<Line>>]
    : Output;

/**
 * TESTS
 */

type test_0_actual = ToAsciiArt<'   * : * Merry * : *   \n  Christmas  '>;
type test_0_expected = [
  '░░░░░#░░░█▄░▄█ █▀▀ █▀█ █▀█ █ █ ░░░#░░░░░',
  '░░░#░░░#░█ ▀ █ █▀▀ ██▀ ██▀ ▀█▀ ░#░░░#░░░',
  '░░░░░#░░░▀ ░░▀ ▀▀▀ ▀ ▀ ▀ ▀ ░▀ ░░░░#░░░░░',
  '░░█▀▀ █ █ █▀█ █ █▀▀ ▀█▀ █▄░▄█ █▀█ █▀▀ ░░',
  '░░█ ░░█▀█ ██▀ █ ▀▀█ ░█ ░█ ▀ █ █▀█ ▀▀█ ░░',
  '░░▀▀▀ ▀ ▀ ▀ ▀ ▀ ▀▀▀ ░▀ ░▀ ░░▀ ▀ ▀ ▀▀▀ ░░',
];
type test_0 = Expect<Equal<test_0_actual, test_0_expected>>;

type test_1_actual = ToAsciiArt<'  Happy new  \n  * : * : * Year * : * : *  '>;
type test_1_expected = [
  '░░█ █ █▀█ █▀█ █▀█ █ █ ░█▄░█ █▀▀ █ ░░█ ░░',
  '░░█▀█ █▀█ █▀▀ █▀▀ ▀█▀ ░█ ▀█ █▀▀ █▄▀▄█ ░░',
  '░░▀ ▀ ▀ ▀ ▀ ░░▀ ░░░▀ ░░▀ ░▀ ▀▀▀ ▀ ░ ▀ ░░',
  '░░░░#░░░#░░░█ █ █▀▀ █▀█ █▀█ ░░░#░░░#░░░░',
  '░░#░░░#░░░#░▀█▀ █▀▀ █▀█ ██▀ ░#░░░#░░░#░░',
  '░░░░#░░░#░░░░▀ ░▀▀▀ ▀ ▀ ▀ ▀ ░░░#░░░#░░░░',
];
type test_1 = Expect<Equal<test_1_actual, test_1_expected>>;

type test_2_actual =
  ToAsciiArt<'  * : * : * : * : * : * \n  Trash  \n  * : * : * : * : * : * '>;
type test_2_expected = [
  '░░░░#░░░#░░░#░░░#░░░#░░░',
  '░░#░░░#░░░#░░░#░░░#░░░#░',
  '░░░░#░░░#░░░#░░░#░░░#░░░',
  '░░▀█▀ █▀█ █▀█ █▀▀ █ █ ░░',
  '░░░█ ░██▀ █▀█ ▀▀█ █▀█ ░░',
  '░░░▀ ░▀ ▀ ▀ ▀ ▀▀▀ ▀ ▀ ░░',
  '░░░░#░░░#░░░#░░░#░░░#░░░',
  '░░#░░░#░░░#░░░#░░░#░░░#░',
  '░░░░#░░░#░░░#░░░#░░░#░░░',
];
type test_2 = Expect<Equal<test_2_actual, test_2_expected>>;

type test_3_actual =
  ToAsciiArt<'  : * : * : * : * : * : * : \n  Ecyrbe  \n  : * : * : * : * : * : * : '>;
type test_3_expected = [
  '░░#░░░#░░░#░░░#░░░#░░░#░░░#░',
  '░░░░#░░░#░░░#░░░#░░░#░░░#░░░',
  '░░#░░░#░░░#░░░#░░░#░░░#░░░#░',
  '░░█▀▀ █▀▀ █ █ █▀█ █▀▄ █▀▀ ░░',
  '░░█▀▀ █ ░░▀█▀ ██▀ █▀▄ █▀▀ ░░',
  '░░▀▀▀ ▀▀▀ ░▀ ░▀ ▀ ▀▀  ▀▀▀ ░░',
  '░░#░░░#░░░#░░░#░░░#░░░#░░░#░',
  '░░░░#░░░#░░░#░░░#░░░#░░░#░░░',
  '░░#░░░#░░░#░░░#░░░#░░░#░░░#░',
];
type test_3 = Expect<Equal<test_3_actual, test_3_expected>>;
