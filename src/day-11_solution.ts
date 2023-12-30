import { Expect, Equal } from 'type-testing';

type SantaListProtector2<T> = T extends Function
  ? T
  : T extends object
    ? { readonly [P in keyof T]: SantaListProtector2<T[P]> }
    : T;

type SantaListProtector3<T> = T extends Function
  ? T
  : T extends [infer Head, infer Rest]
    ? readonly [SantaListProtector3<Head>, SantaListProtector3<Rest>]
    : T extends object
      ? { readonly [K in keyof T]: SantaListProtector3<T[K]> }
      : T;

type SantaListProtector<T> = T extends (...args: unknown[]) => unknown
  ? T
  : T extends []
    ? ReadonlyArray<SantaListProtector<[...T]>>
    : T extends object
      ? { readonly [Key in keyof T]: SantaListProtector<T[Key]> }
      : T;

type SantaListProtector4<X> = {
  readonly [K in keyof X]: X[K] extends Function
    ? X[K]
    : SantaListProtector4<X[K]>;
};

type DeepReadonly5<T> = {
  readonly [P in keyof T]: T[P] extends Record<number, unknown>
    ? DeepReadonly5<T[P]>
    : T[P];
};

type test_0_actual = SantaListProtector<{
  hacksore: () => 'naughty';
  trash: string;
  elliot: {
    penny: boolean;
    candace: {
      address: {
        street: {
          name: 'candy cane way';
          num: number;
        };
        k: 'hello';
      };
      children: [
        'harry',
        {
          saying: ['hey'];
        },
      ];
    };
  };
}>;
type test_0_expected = {
  readonly hacksore: () => 'naughty';
  readonly trash: string;
  readonly elliot: {
    readonly penny: boolean;
    readonly candace: {
      readonly address: {
        readonly street: {
          readonly name: 'candy cane way';
          readonly num: number;
        };
        readonly k: 'hello';
      };
      readonly children: readonly [
        'harry',
        {
          readonly saying: readonly ['hey'];
        },
      ];
    };
  };
};
type test_0 = Expect<Equal<test_0_expected, test_0_actual>>;

type test_1_actual = SantaListProtector<{
  theo: () => 'naughty';
  prime: string;
  netflix: {
    isChill: boolean;
  };
}>;
type test_1_expected = {
  readonly theo: () => 'naughty';
  readonly prime: string;
  readonly netflix: {
    readonly isChill: boolean;
  };
};
type test_1 = Expect<Equal<test_1_expected, test_1_actual>>;
