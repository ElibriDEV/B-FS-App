import { Column, CreatedAt, DataType, Model, Table, UpdatedAt } from 'sequelize-typescript';

export const excludeAttrs = { exclude: ['password', 'refreshToken'] };
export const includeAttrs = ['id', 'firstName', 'lastName', 'email', 'createdAt', 'updatedAt'];

@Table({ tableName: 'user' })
export class UserModel extends Model {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  firstName: string;

  @Column({ type: DataType.STRING, allowNull: true })
  lastName: string | null;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.STRING, allowNull: true })
  refreshToken: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
