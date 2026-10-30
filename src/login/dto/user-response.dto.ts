import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../../generated/prisma/client';

// password, refreshTokenHash 등 민감 필드는 의도적으로 제외
export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ type: String, nullable: true, example: 'hong' })
  username!: string | null;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;

  static from(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.username = user.username;
    dto.createdAt = user.createdAt;
    return dto;
  }
}
