import { PaginatedModelResponseBase } from '../../../common/utils/model_manager/model.manager';
import { ApiProperty } from '@nestjs/swagger';
import { UserBaseResponse } from './base.response';

export class PaginatedUserResponse extends PaginatedModelResponseBase {
  @ApiProperty({ type: [UserBaseResponse] })
  rows: UserBaseResponse[];
}
