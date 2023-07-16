import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from '../schemas/user.schemas';

export class ReadOnlyUserDto extends PickType(User, [
  'email',
  'name',
] as const) {
  @ApiProperty({
    example: '3280199',
    description: 'id',
  })
  id: string;
}
