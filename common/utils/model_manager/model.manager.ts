import { Model, ModelCtor } from 'sequelize-typescript';
import { Attributes, FindOptions, Order } from 'sequelize/types/model';
import { ApiProperty } from '@nestjs/swagger';
import { NotFoundResponse } from '../../responses/not-found.response';
import { CountArgs, FilterParams, PaginatedModel, ThenArgs } from './interfaces';

export abstract class PaginatedModelResponseBase {
  @ApiProperty({ example: 1, description: 'Текущая страница' })
  currentPage: number;
  @ApiProperty({ example: 10, description: 'Общее количество страниц' })
  totalPages: number;
}

export class ModelManager<T extends Model<T>> {
  private readonly _model: ModelCtor<T>;
  constructor(model: ModelCtor<T>) {
    this._model = model;
  }

  public async paginateFindAll(options?: FilterParams<T>): Promise<PaginatedModel<T>> {
    const offset: number = (options.page - 1) * options.perPage;
    const orderCondition: Order = [];
    if (options.ascKeys) options.ascKeys.forEach((key: string) => orderCondition.push([key, 'ASC']));
    if (options.descKeys) options.descKeys.forEach((key: string) => orderCondition.push([key, 'DESC']));
    orderCondition.concat(options.order);
    return await this._model
      .findAndCountAll({
        ...options,
        offset: offset,
        limit: options.perPage,
        order: orderCondition,
        subQuery: false,
      })
      .then(({ rows, count }: ThenArgs<T>): PaginatedModel<T> => {
        if (rows.length === 0) throw new NotFoundResponse(`Данные на странице ${options.page} не найдены.`);
        let countProcess: number | CountArgs[] = count;
        if (Array.isArray(count)) countProcess = count.length;
        return {
          currentPage: options.page,
          totalPages: Math.ceil((countProcess as number) / options.perPage),
          rows: rows,
        };
      });
  }

  public async multipleIdExistsCheck(
    ids: number[],
    options?: FindOptions<Attributes<T>>,
    errorMessage?: string,
  ): Promise<T[]> {
    const essences: T[] = await this._model.findAll(options);
    if (essences.length !== ids.length) {
      essences.forEach((essence: T): void => {
        const index: number = ids.indexOf(essence.id);
        ids.splice(index, 1);
      });
      throw new NotFoundResponse(errorMessage);
    }
    return essences;
  }
}
