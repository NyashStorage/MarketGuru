import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from '../../models/user.model';
import { IsOptional } from 'class-validator';

export class UpdateUserRequest extends PickType(User, [
  'email',
  'phone',
  'password',
]) {
  @IsOptional()
  @ApiProperty({
    nullable: false,
  })
  email: string;

  @IsOptional()
  @ApiProperty({
    nullable: false,
  })
  phone: string;

  @IsOptional()
  password: string;
}
