import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from '../user.schema';

export class ReadOnlyUserDto extends PickType(User, ['email', 'name']) {
  @ApiProperty({
    example: '3280199',
    description: 'id',
  })
  id: string;
}
