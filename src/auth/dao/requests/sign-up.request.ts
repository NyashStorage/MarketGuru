import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from '../../../users/models/user.model';

export class SignUpRequest extends PickType(User, [
  'email',
  'phone',
  'password',
]) {
  @ApiProperty({
    nullable: false,
  })
  email: string;

  @ApiProperty({
    nullable: false,
  })
  phone: string;
}
