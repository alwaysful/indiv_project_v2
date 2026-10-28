import { User } from "@prisma/client";

// password, sub 등 민감 필드는 의도적으로 제외
export class UserResponseDto {
  id!: string;

  email!: string;

  username!: string | null;

  provider!: string | null;

  createdAt!: Date;

  static from(user: User): UserResponseDto {
    const dto = new UserResponseDto();
    dto.id = user.id;
    dto.email = user.email;
    dto.username = user.username;
    dto.provider = user.provider;
    dto.createdAt = user.createdAt;
    return dto;
  }
}
