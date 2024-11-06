import { IsEnum, IsString } from 'class-validator';

export class UpdateFriendRequestDto {
  @IsString()
  friendRequestId: string;

  @IsEnum(['PENDING', 'ACCEPTED', 'DECLINED'])
  status: string;
}
