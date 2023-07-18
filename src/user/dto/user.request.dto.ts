import { PickType } from '@nestjs/swagger';
import { User } from '../user.schema';

export class UserRequestDto extends PickType(User, [
  'id',
  'password',
  'name',
  'email',
] as const) {}
