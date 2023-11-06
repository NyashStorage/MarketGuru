import { Column, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsPhoneNumber,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

@Table({
  timestamps: true,
})
export class User extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  @Expose()
  @ApiProperty({
    nullable: false,
  })
  id: number;

  @Column({
    unique: true,
  })
  @IsEmail(
    {},
    {
      message: 'Email should be in format "name@domain.com"',
    },
  )
  @ValidateIf((data) => !data.phone)
  @Expose()
  @ApiProperty({
    example: 'contact@nyashmyash99.ru',
    nullable: true,
  })
  email: string;

  @Column({
    unique: true,
  })
  @IsPhoneNumber()
  @ValidateIf((data) => !data.email)
  @Expose()
  @ApiProperty({
    example: '+78005553535',
    nullable: true,
  })
  phone: string;

  @Column({
    allowNull: false,
  })
  @MinLength(6)
  @MaxLength(64)
  @ApiProperty({
    example: 's7p3rp@$$w0rd',
    nullable: false,
  })
  password: string;

  @Expose()
  @ApiProperty({
    nullable: false,
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    nullable: false,
  })
  updatedAt: Date;
}
