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

type NewLine = '\n';

type LettersKeys = keyof Letters;

type ToRow<
  Char extends string,
  Row extends [string, string, string] = ['', '', ''],
  K = Uppercase<Char>,
> = K extends LettersKeys
  ? [
      `${Row[0]}${Letters[K][0]}`,
      `${Row[1]}${Letters[K][1]}`,
      `${Row[2]}${Letters[K][2]}`,
    ]
  : Row;

type ToAsciiArt<
  Template extends string,
  Table extends string[] = [],
  Row extends [string, string, string] = ['', '', ''],
> = Template extends `${infer Char extends string}${infer Rest}`
  ? Char extends NewLine
    ? ToAsciiArt<Rest, [...Table, ...Row]>
    : ToAsciiArt<Rest, Table, ToRow<Char, Row>>
  : [...Table, ...Row];

///

type Alphabet = keyof Letters;

type RenderLettersLine<
  S extends string,
  LineNumber extends number,
> = S extends `${infer Letter}${infer Tail}`
  ? Letter extends Alphabet
    ? `${Letters[Letter][LineNumber]}${RenderLettersLine<Tail, LineNumber>}`
    : ''
  : '';

type RenderLettersLines<S extends string> = [
  RenderLettersLine<S, 0>,
  RenderLettersLine<S, 1>,
  RenderLettersLine<S, 2>,
];

export type ToAsciiArt2<S extends string> = S extends `${infer T}\n${infer U}`
  ? [...RenderLettersLines<Uppercase<T>>, ...ToAsciiArt2<U>]
  : RenderLettersLines<Uppercase<S>>;

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
