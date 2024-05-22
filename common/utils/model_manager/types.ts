import { Col, Fn, Literal } from 'sequelize/types/utils';

type Keyof<T> = Extract<keyof T, string>;
type AscDesc = 'ASC' | 'DESC';
type ProjectionAlias<T> = readonly [Keyof<T> | Literal | Fn | Col, string];
type KeyofProjectionAlias<T> = Keyof<T> | string | ProjectionAlias<T>;

export type AscDescType<T> =
  | [Keyof<T>, AscDesc]
  | [Keyof<T>, Keyof<T>, AscDesc]
  | [Keyof<T>, Keyof<T>, Keyof<T>, AscDesc]
  | [Keyof<T>, Keyof<T>, Keyof<T>, Keyof<T>, AscDesc]
  | [Keyof<T>, Keyof<T>, Keyof<T>, Keyof<T>, Keyof<T>, AscDesc];

export type ManagerAttributes<T> =
  | KeyofProjectionAlias<T>[]
  | {
      exclude: Keyof<T>[];
      include?: KeyofProjectionAlias<T>[];
    }
  | {
      exclude?: Keyof<T>[];
      include: KeyofProjectionAlias<T>[];
    };
