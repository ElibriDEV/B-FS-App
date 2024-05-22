import { ApiProperty } from '@nestjs/swagger';
import { PaginatedModelResponseBase } from '../../../common/utils/model_manager/model.manager';
import { BaseTaskResponse } from './base.response';

export class PaginatedTaskResponse extends PaginatedModelResponseBase {
  @ApiProperty({ type: [BaseTaskResponse] })
  rows: BaseTaskResponse[];
}
