import { Equal, Expect } from 'type-testing';

/**
 * SOLUTION
 */
type TicTacToeChip = '❌' | '⭕';
type TicTacToeEndState = '❌ Won' | '⭕ Won' | 'Draw';
type TicTacToeState = TicTacToeChip | TicTacToeEndState;
type TicTacToeEmptyCell = '  ';
type TicTacToeCell = TicTacToeChip | TicTacToeEmptyCell;
type TicTacToeYPositions = 'top' | 'middle' | 'bottom';
type TicTacToeXPositions = 'left' | 'center' | 'right';
type TicTacToePositions = `${TicTacToeYPositions}-${TicTacToeXPositions}`;
type TicTactToeBoard = TicTacToeCell[][];
type TicTacToeGame = {
  board: TicTactToeBoard;
  state: TicTacToeState;
};

type EmptyBoard = [['  ', '  ', '  '], ['  ', '  ', '  '], ['  ', '  ', '  ']];

type NewGame = {
  board: EmptyBoard;
  state: '❌';
};

type UpdateRow<
  T extends unknown[],
  X extends number,
  V,
  Output extends unknown[] = [],
> = T extends [infer H, ...infer R]
  ? X extends Output['length']
    ? H extends TicTacToeEmptyCell
      ? [...Output, V, ...R]
      : never
    : UpdateRow<R, X, V, [...Output, H]>
  : Output;

type UpdateColumns<
  T extends unknown[][],
  Y extends number,
  X extends number,
  V,
  Output extends unknown[][] = [],
> = T extends [infer H extends unknown[], ...infer R extends unknown[][]]
  ? Y extends Output['length']
    ? UpdateRow<H, X, V> extends infer Row
      ? Row extends never
        ? never
        : [...Output, Row, ...R]
      : never
    : UpdateColumns<R, Y, X, V, [...Output, H]>
  : Output;

type YPositionToIndex = {
  top: 0;
  middle: 1;
  bottom: 2;
};

type XPositionToIndex = {
  left: 0;
  center: 1;
  right: 2;
};

type UpdatedBoard<
  Board extends TicTactToeBoard,
  Move extends TicTacToePositions,
  Chip,
> = Move extends `${infer Y extends TicTacToeYPositions}-${infer X extends
  TicTacToeXPositions}`
  ? UpdateColumns<Board, YPositionToIndex[Y], XPositionToIndex[X], Chip>
  : never;

type WinnerCombination = [
  'top-left' | 'top-center' | 'top-right',
  'middle-left' | 'middle-center' | 'middle-right',
  'bottom-left' | 'bottom-center' | 'bottom-right',
  'top-left' | 'middle-left' | 'bottom-left',
  'top-center' | 'middle-center' | 'bottom-center',
  'top-right' | 'middle-right' | 'bottom-right',
  'top-left' | 'middle-center' | 'bottom-right',
  'top-right' | 'middle-center' | 'bottom-left',
];

type Position<
  T,
  Chip extends TicTacToeChip,
  Result extends TicTacToeYPositions | TicTacToeXPositions,
> = T extends Chip ? Result : never;

type ChipXPositions<
  T extends TicTacToeCell[],
  Chip extends TicTacToeChip,
> = T extends [infer Left, infer Center, infer Right]
  ?
      | Position<Left, Chip, 'left'>
      | Position<Center, Chip, 'center'>
      | Position<Right, Chip, 'right'>
  : never;

type ChipPositions<
  Board extends TicTactToeBoard,
  Chip extends TicTacToeChip,
> = Board extends [
  infer Top extends TicTacToeCell[],
  infer Middle extends TicTacToeCell[],
  infer Bottom extends TicTacToeCell[],
]
  ?
      | `top-${ChipXPositions<Top, Chip>}`
      | `middle-${ChipXPositions<Middle, Chip>}`
      | `bottom-${ChipXPositions<Bottom, Chip>}`
  : never;

type Some<T extends unknown[], C> = T extends [infer H, ...infer R]
  ? H extends C
    ? true
    : Some<R, C>
  : false;

type HasEmptyCell<T extends TicTactToeBoard> = T extends [
  infer H extends unknown[],
  ...infer R extends TicTactToeBoard,
]
  ? TicTacToeEmptyCell extends H[number]
    ? true
    : HasEmptyCell<R>
  : false;

type Winner<Board extends TicTactToeBoard> = HasEmptyCell<Board> extends false
  ? 'Draw'
  : Some<WinnerCombination, ChipPositions<Board, '❌'>> extends true
    ? '❌ Won'
    : Some<WinnerCombination, ChipPositions<Board, '⭕'>> extends true
      ? '⭕ Won'
      : TicTacToeGame;

type NextState<
  State extends TicTacToeGame,
  Board extends TicTactToeBoard,
> = Winner<Board> extends infer _Winner extends TicTacToeEndState
  ? _Winner
  : State['state'] extends '❌'
    ? '⭕'
    : '❌';

type MakeTurn<
  Game extends TicTacToeGame,
  Move extends TicTacToePositions,
> = UpdatedBoard<Game['board'], Move, Game['state']> extends infer _Board
  ? {
      board: UpdatedBoard<Game['board'], Move, Game['state']>;
      state: NextState<Game, UpdatedBoard<Game['board'], Move, Game['state']>>;
    }
  : Game;

type TicTacToe<
  Game extends TicTacToeGame,
  Move extends TicTacToePositions,
> = UpdatedBoard<Game['board'], Move, Game['state']> extends never
  ? Game
  : MakeTurn<Game, Move>;

/**
 * TESTS
 */

type test_move1_actual = TicTacToe<NewGame, 'top-center'>;
//   ^?
type test_move1_expected = {
  board: [['  ', '❌', '  '], ['  ', '  ', '  '], ['  ', '  ', '  ']];
  state: '⭕';
};
type test_move1 = Expect<Equal<test_move1_actual, test_move1_expected>>;

type test_move2_actual = TicTacToe<test_move1_actual, 'top-left'>;
//   ^?
type test_move2_expected = {
  board: [['⭕', '❌', '  '], ['  ', '  ', '  '], ['  ', '  ', '  ']];
  state: '❌';
};
type test_move2 = Expect<Equal<test_move2_actual, test_move2_expected>>;

type test_move3_actual = TicTacToe<test_move2_actual, 'middle-center'>;
//   ^?
type test_move3_expected = {
  board: [['⭕', '❌', '  '], ['  ', '❌', '  '], ['  ', '  ', '  ']];
  state: '⭕';
};
type test_move3 = Expect<Equal<test_move3_actual, test_move3_expected>>;

type test_move4_actual = TicTacToe<test_move3_actual, 'bottom-left'>;
//   ^?
type test_move4_expected = {
  board: [['⭕', '❌', '  '], ['  ', '❌', '  '], ['⭕', '  ', '  ']];
  state: '❌';
};
type test_move4 = Expect<Equal<test_move4_actual, test_move4_expected>>;

type test_x_win_actual = TicTacToe<test_move4_actual, 'bottom-center'>;
//   ^?
type test_x_win_expected = {
  board: [['⭕', '❌', '  '], ['  ', '❌', '  '], ['⭕', '❌', '  ']];
  state: '❌ Won';
};
type test_x_win = Expect<Equal<test_x_win_actual, test_x_win_expected>>;

type type_move5_actual = TicTacToe<test_move4_actual, 'bottom-right'>;
//   ^?
type type_move5_expected = {
  board: [['⭕', '❌', '  '], ['  ', '❌', '  '], ['⭕', '  ', '❌']];
  state: '⭕';
};
type test_move5 = Expect<Equal<type_move5_actual, type_move5_expected>>;

type test_o_win_actual = TicTacToe<type_move5_actual, 'middle-left'>;
//   ^?
type test_o_win_expected = {
  board: [['⭕', '❌', '  '], ['⭕', '❌', '  '], ['⭕', '  ', '❌']];
  state: '⭕ Won';
};

// invalid move don't change the board and state
type test_invalid_actual = TicTacToe<test_move1_actual, 'top-center'>;
//   ^?
type test_invalid_expected = {
  board: [['  ', '❌', '  '], ['  ', '  ', '  '], ['  ', '  ', '  ']];
  state: '⭕';
};
type test_invalid = Expect<Equal<test_invalid_actual, test_invalid_expected>>;

type test_before_draw = {
  board: [['⭕', '❌', '⭕'], ['⭕', '❌', '❌'], ['❌', '⭕', '  ']];
  state: '⭕';
};
type test_draw_actual = TicTacToe<test_before_draw, 'bottom-right'>;
//   ^?
type test_draw_expected = {
  board: [['⭕', '❌', '⭕'], ['⭕', '❌', '❌'], ['❌', '⭕', '⭕']];
  state: 'Draw';
};
type test_draw = Expect<Equal<test_draw_actual, test_draw_expected>>;
