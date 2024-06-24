import { Injectable } from '@nestjs/common';
import { excludeAttrs, includeAttrs, UserModel } from './user.model';
import { CreateUserDto } from './dto/create.user.dto';
import { ConflictResponse } from '../../common/responses/conflict.response';
import { hash } from 'bcrypt';
import { NotFoundResponse } from '../../common/responses/not-found.response';
import { InjectModel } from '@nestjs/sequelize';
import { UpdateUserDto } from './dto/update.user.dto';
import { AccessPayloadInterface } from '../auth/interfaces/access.payload.interface';
import { UserDeletedResponse } from './responses/deleted.response';
import { UserBaseResponse } from './responses/base.response';
import { PaginationUserDto } from './dto/pagination.user.dto';
import { ModelManager } from '../../common/utils/model_manager/model.manager';
import { PaginatedUserResponse } from './responses/pagination.response';

@Injectable()
export class UserService {
  private modelManager: ModelManager<UserModel>;
  constructor(
    @InjectModel(UserModel)
    private userModel: typeof UserModel,
  ) {
    this.modelManager = new ModelManager(UserModel);
  }

  async getByIdFull(id: number, raiseException: boolean = true): Promise<UserModel> {
    const user: UserModel = await this.userModel.findByPk(id);
    if (!user && raiseException) throw new NotFoundResponse(`User with id ${id} not found.`);
    return user;
  }

  async getByEmailFull(email: string, raiseException: boolean = true): Promise<UserModel> {
    const user: UserModel = await this.userModel.findOne({
      where: { email: email },
    });
    if (!user && raiseException) throw new NotFoundResponse(`User with email ${email} not found.`);
    return user;
  }

  async getById(id: number, raiseException: boolean = true): Promise<UserBaseResponse> {
    const user: UserModel = await this.userModel.findByPk(id, { attributes: excludeAttrs });
    if (!user && raiseException) throw new NotFoundResponse(`User with id ${id} not found.`);
    return user;
  }

  async getSelf(tokenPayload: AccessPayloadInterface): Promise<UserBaseResponse> {
    return this.getById(tokenPayload.id);
  }

  async getPagination(page: number, perPage: number, dto: PaginationUserDto): Promise<PaginatedUserResponse> {
    console.log(page);
    console.log(perPage);
    console.log(dto);
    return this.modelManager.paginateFindAll({
      attributes: includeAttrs,
      page: page,
      perPage: perPage,
      ascKeys: dto.ascFields,
      descKeys: dto.descFields,
    });
  }

  async create(dto: CreateUserDto): Promise<UserBaseResponse> {
    const userExists: UserModel = await this.userModel.findOne({
      where: { email: dto.email },
    });
    if (userExists) throw new ConflictResponse('User already exists');
    const passwordHash: string = await hash(dto.password, 5);
    return await this.userModel.create({ ...dto, password: passwordHash }, { returning: includeAttrs });
  }

  async updateSelf(dto: UpdateUserDto, tokenPayload: AccessPayloadInterface): Promise<UserBaseResponse> {
    const userExists: UserModel = await this.getByIdFull(tokenPayload.id, true);
    if (dto.password !== undefined) dto.password = await this.hashPassword(dto.password);
    return await this.userModel
      .update(dto, { where: { id: userExists.id }, returning: includeAttrs })
      .then(([, users]: [number, UserModel[]]) => users[0]);
  }

  async deleteSelf(tokenPayload: AccessPayloadInterface): Promise<UserDeletedResponse> {
    const userExists: UserModel = await this.getByIdFull(tokenPayload.id, true);
    await this.userModel.destroy({ where: { id: userExists.id } });
    return new UserDeletedResponse(userExists.id);
  }

  async upsertRefresh(id: number, refreshToken: string | null): Promise<UserModel> {
    const userExists: UserModel = await this.getByIdFull(id, true);
    let processedRefreshToken: string | null;
    if (typeof refreshToken === 'string') processedRefreshToken = await hash(refreshToken, 5);
    return await userExists.update({ refreshToken: processedRefreshToken });
  }

  private async hashPassword(password: string): Promise<string> {
    return hash(password, 5);
  }
}
