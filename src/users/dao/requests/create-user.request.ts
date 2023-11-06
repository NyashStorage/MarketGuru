import { PickType } from '@nestjs/swagger';
import { User } from '../../models/user.model';

export class CreateUserRequest extends PickType(User, [
  'email',
  'phone',
  'password',
]) {}
