import { Expect, Equal } from 'type-testing';

/**
 * SOLUTION
 */

type Connect4Chips = '🔴' | '🟡';
type Connect4Cell = Connect4Chips | '  ';
type Connect4EndState = '🔴 Won' | '🟡 Won' | 'Draw';
type Connect4State = '🔴' | '🟡' | Connect4EndState;

type EmptyBoard = [
  ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
  ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
  ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
  ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
  ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
  ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
];

type NewGame = {
  board: EmptyBoard;
  state: '🟡';
};

type Connect4Board = Connect4Cell[][];
type Connect4Game = {
  board: Connect4Board;
  state: Connect4State;
};
type Connect4Turn = {
  board: Connect4Board;
  state: Connect4Chips;
};

type UpdateRow4<
  Row extends Connect4Cell[],
  Chip extends Connect4Chips,
  N extends number,
  Output extends Connect4Cell[] = [],
> = Row extends [
  infer H extends Connect4Cell,
  ...infer R extends Connect4Cell[],
]
  ? N extends Output['length']
    ? H extends '  '
      ? [...Output, Chip, ...R]
      : never
    : UpdateRow4<R, Chip, N, [...Output, H]>
  : Output;

type IsEmptyRow4<
  Row extends Connect4Cell[],
  N extends number,
  Output extends Connect4Cell[] = [],
> = Row extends [
  infer H extends Connect4Cell,
  ...infer R extends Connect4Cell[],
]
  ? N extends Output['length']
    ? H extends '  '
      ? true
      : false
    : IsEmptyRow4<R, N, [...Output, H]>
  : true;

type UpdatedBoard4<
  Board extends Connect4Board,
  Chip extends Connect4Chips,
  N extends number,
  Output extends Connect4Board = [],
> = Board extends [
  ...infer HR extends Connect4Board,
  infer R extends Connect4Cell[],
]
  ? IsEmptyRow4<R, N> extends true
    ? [...HR, UpdateRow4<R, Chip, N>, ...Output]
    : UpdatedBoard4<HR, Chip, N, [R, ...Output]>
  : Output;

type Transpose<M extends unknown[][], R = M['length'] extends 0 ? [] : M[0]> = {
  [X in keyof R]: {
    [Y in keyof M]: X extends keyof M[Y] ? M[Y][X] : never;
  };
};

type _FourInARow<
  Row extends Connect4Cell[],
  Chip extends Connect4Chips,
> = Row extends [
  infer H1 extends Chip,
  infer H2 extends Chip,
  infer H3 extends Chip,
  infer H4 extends Chip,
  ...infer R extends Connect4Cell[],
]
  ? true
  : Row extends [infer H, ...infer R extends Connect4Cell[]]
    ? _FourInARow<R, Chip>
    : false;

type FourInARow<
  Board extends Connect4Board,
  Chip extends Connect4Chips,
> = Board extends [
  infer H extends Connect4Cell[],
  ...infer R extends Connect4Board,
]
  ? _FourInARow<H, Chip> extends true
    ? true
    : FourInARow<R, Chip>
  : false;

type FourInColumn<
  Board extends Connect4Board,
  Chip extends Connect4Chips,
> = Transpose<Board> extends infer H extends Connect4Board
  ? FourInARow<H, Chip>
  : never;

type Every<T extends unknown[], C> = T extends [infer H, ...infer R]
  ? H extends C
    ? Every<R, C>
    : false
  : true;

type FourInDiagonal<
  Board extends Connect4Board,
  Chip extends Connect4Chips,
  Diagonals = [
    [Board[1][3], Board[2][2], Board[3][1], Board[4][0]],
    [Board[5][0], Board[4][1], Board[3][2], Board[2][3]],
  ],
> = Diagonals extends [infer H extends unknown[], ...infer R]
  ? Every<H, Chip> extends true
    ? true
    : FourInDiagonal<Board, Chip, R>
  : Diagonals;

type HasEmptyCell<T extends Connect4Board> = T extends [
  infer H extends unknown[],
  ...infer R extends Connect4Board,
]
  ? '  ' extends H[number]
    ? true
    : HasEmptyCell<R>
  : false;

type WinnerOrNext<
  Board extends Connect4Board,
  Chip extends Connect4Chips,
> = HasEmptyCell<Board> extends false
  ? 'Draw'
  : FourInARow<Board, Chip> extends true
    ? `${Chip} Won`
    : FourInColumn<Board, Chip> extends true
      ? `${Chip} Won`
      : FourInDiagonal<Board, Chip> extends true
        ? `${Chip} Won`
        : Chip extends '🔴'
          ? '🟡'
          : '🔴';

type NextState<
  Board extends Connect4Board,
  State extends Connect4State,
> = State extends Connect4Chips
  ? WinnerOrNext<Board, State> extends infer _Next
    ? _Next
    : State
  : State;

type Turn<Game extends Connect4Turn, N extends number> = UpdatedBoard4<
  Game['board'],
  Game['state'],
  N
> extends infer Board extends Connect4Board
  ? {
      board: Board;
      state: NextState<Board, Game['state']>;
    }
  : Game;

type Connect4<
  Game extends Connect4Game,
  N extends number,
> = Game['state'] extends Connect4Chips
  ? Turn<
      {
        board: Game['board'];
        state: Game['state'];
      },
      N
    >
  : Game;

/**
 * TESTS
 */

type test_move1_actual = Connect4<NewGame, 0>;
//   ^?
type test_move1_expected = {
  board: [
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['🟡', '  ', '  ', '  ', '  ', '  ', '  '],
  ];
  state: '🔴';
};
type test_move1 = Expect<Equal<test_move1_actual, test_move1_expected>>;

type test_move2_actual = Connect4<test_move1_actual, 0>;
//   ^?
type test_move2_expected = {
  board: [
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['🔴', '  ', '  ', '  ', '  ', '  ', '  '],
    ['🟡', '  ', '  ', '  ', '  ', '  ', '  '],
  ];
  state: '🟡';
};
type test_move2 = Expect<Equal<test_move2_actual, test_move2_expected>>;

type test_move3_actual = Connect4<test_move2_actual, 0>;
//   ^?
type test_move3_expected = {
  board: [
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['🟡', '  ', '  ', '  ', '  ', '  ', '  '],
    ['🔴', '  ', '  ', '  ', '  ', '  ', '  '],
    ['🟡', '  ', '  ', '  ', '  ', '  ', '  '],
  ];
  state: '🔴';
};
type test_move3 = Expect<Equal<test_move3_actual, test_move3_expected>>;

type test_move4_actual = Connect4<test_move3_actual, 1>;
//   ^?
type test_move4_expected = {
  board: [
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['🟡', '  ', '  ', '  ', '  ', '  ', '  '],
    ['🔴', '  ', '  ', '  ', '  ', '  ', '  '],
    ['🟡', '🔴', '  ', '  ', '  ', '  ', '  '],
  ];
  state: '🟡';
};
type test_move4 = Expect<Equal<test_move4_actual, test_move4_expected>>;

type test_move5_actual = Connect4<test_move4_actual, 2>;
//   ^?
type test_move5_expected = {
  board: [
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['🟡', '  ', '  ', '  ', '  ', '  ', '  '],
    ['🔴', '  ', '  ', '  ', '  ', '  ', '  '],
    ['🟡', '🔴', '🟡', '  ', '  ', '  ', '  '],
  ];
  state: '🔴';
};
type test_move5 = Expect<Equal<test_move5_actual, test_move5_expected>>;

type test_move6_actual = Connect4<test_move5_actual, 1>;
//   ^?
type test_move6_expected = {
  board: [
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['🟡', '  ', '  ', '  ', '  ', '  ', '  '],
    ['🔴', '🔴', '  ', '  ', '  ', '  ', '  '],
    ['🟡', '🔴', '🟡', '  ', '  ', '  ', '  '],
  ];
  state: '🟡';
};
type test_move6 = Expect<Equal<test_move6_actual, test_move6_expected>>;

type test_red_win_actual = Connect4<
  {
    board: [
      ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
      ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
      ['🟡', '  ', '  ', '  ', '  ', '  ', '  '],
      ['🟡', '  ', '  ', '  ', '  ', '  ', '  '],
      ['🔴', '🔴', '🔴', '  ', '  ', '  ', '  '],
      ['🟡', '🔴', '🟡', '🟡', '  ', '  ', '  '],
    ];
    state: '🔴';
  },
  3
>;

type test_red_win_expected = {
  board: [
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['🟡', '  ', '  ', '  ', '  ', '  ', '  '],
    ['🟡', '  ', '  ', '  ', '  ', '  ', '  '],
    ['🔴', '🔴', '🔴', '🔴', '  ', '  ', '  '],
    ['🟡', '🔴', '🟡', '🟡', '  ', '  ', '  '],
  ];
  state: '🔴 Won';
};

type test_red_win = Expect<Equal<test_red_win_actual, test_red_win_expected>>;

type test_yellow_win_actual = Connect4<
  {
    board: [
      ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
      ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
      ['🔴', '  ', '  ', '  ', '  ', '  ', '  '],
      ['🟡', '  ', '  ', '  ', '  ', '  ', '  '],
      ['🔴', '  ', '🔴', '🔴', '  ', '  ', '  '],
      ['🟡', '  ', '🟡', '🟡', '  ', '  ', '  '],
    ];
    state: '🟡';
  },
  1
>;

type test_yellow_win_expected = {
  board: [
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['🔴', '  ', '  ', '  ', '  ', '  ', '  '],
    ['🟡', '  ', '  ', '  ', '  ', '  ', '  '],
    ['🔴', '  ', '🔴', '🔴', '  ', '  ', '  '],
    ['🟡', '🟡', '🟡', '🟡', '  ', '  ', '  '],
  ];
  state: '🟡 Won';
};

type test_yellow_win = Expect<
  Equal<test_yellow_win_actual, test_yellow_win_expected>
>;

type test_diagonal_yellow_win_actual = Connect4<
  {
    board: [
      ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
      ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
      ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
      ['  ', '  ', '🟡', '🔴', '  ', '  ', '  '],
      ['🔴', '🟡', '🔴', '🔴', '  ', '  ', '  '],
      ['🟡', '🔴', '🟡', '🟡', '  ', '  ', '  '],
    ];
    state: '🟡';
  },
  3
>;

type test_diagonal_yellow_win_expected = {
  board: [
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '🟡', '  ', '  ', '  '],
    ['  ', '  ', '🟡', '🔴', '  ', '  ', '  '],
    ['🔴', '🟡', '🔴', '🔴', '  ', '  ', '  '],
    ['🟡', '🔴', '🟡', '🟡', '  ', '  ', '  '],
  ];
  state: '🟡 Won';
};

type test_diagonal_yellow_win = Expect<
  Equal<test_diagonal_yellow_win_actual, test_diagonal_yellow_win_expected>
>;

type test_draw_actual = Connect4<
  {
    board: [
      ['🟡', '🔴', '🔴', '🟡', '🟡', '🔴', '  '],
      ['🔴', '🟡', '🟡', '🔴', '🔴', '🟡', '🔴'],
      ['🟡', '🔴', '🔴', '🟡', '🟡', '🔴', '🟡'],
      ['🔴', '🟡', '🟡', '🔴', '🔴', '🟡', '🔴'],
      ['🟡', '🔴', '🔴', '🟡', '🟡', '🔴', '🟡'],
      ['🔴', '🟡', '🟡', '🔴', '🔴', '🟡', '🔴'],
    ];
    state: '🟡';
  },
  6
>;

type test_draw_expected = {
  board: [
    ['🟡', '🔴', '🔴', '🟡', '🟡', '🔴', '🟡'],
    ['🔴', '🟡', '🟡', '🔴', '🔴', '🟡', '🔴'],
    ['🟡', '🔴', '🔴', '🟡', '🟡', '🔴', '🟡'],
    ['🔴', '🟡', '🟡', '🔴', '🔴', '🟡', '🔴'],
    ['🟡', '🔴', '🔴', '🟡', '🟡', '🔴', '🟡'],
    ['🔴', '🟡', '🟡', '🔴', '🔴', '🟡', '🔴'],
  ];
  state: 'Draw';
};

type test_draw = Expect<Equal<test_draw_actual, test_draw_expected>>;
