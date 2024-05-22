import { Model } from 'sequelize-typescript';
import { Attributes, FindAndCountOptions } from 'sequelize/types/model';
import { WhereOptions } from 'sequelize';
import { ManagerAttributes } from './types';

export interface FilterParams<T extends Model>
  extends Omit<FindAndCountOptions<Attributes<T>>, 'where' | 'attributes' | 'subQuery' | 'offset' | 'limit'> {
  where?: WhereOptions<T>;
  attributes?: ManagerAttributes<T>;
  ascKeys?: string[];
  descKeys?: string[];
  perPage: number;
  page: number;
}

export interface PaginatedModel<T> {
  currentPage: number;
  totalPages: number;
  rows: T[];
}

export interface CountArgs {
  id: number;
  count: number;
}

export interface ThenArgs<T> {
  count: CountArgs[] | number;
  rows: T[];
}
