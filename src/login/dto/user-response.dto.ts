import { User } from '../../../generated/prisma/client';

// password, sub 등 민감 필드는 의도적으로 제외
export class UserResponseDto {
  id!: number;
  email!: string;
  username!: string | null;
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
