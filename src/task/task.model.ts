import { BelongsTo, Column, CreatedAt, DataType, ForeignKey, Model, Table, UpdatedAt } from 'sequelize-typescript';
import { UserModel } from '../user/user.model';

@Table({ tableName: 'task' })
export class TaskModel extends Model {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  description: string;

  @Column({ type: DataType.DATE, allowNull: true })
  deadline: Date;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  completed: boolean;

  @ForeignKey(() => UserModel)
  userId: number;

  @BelongsTo(() => UserModel)
  user: UserModel;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
