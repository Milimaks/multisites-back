import { IsNotEmpty } from 'class-validator';

export class FriendRequestDto {
  @IsNotEmpty()
  senderUserId: string;

  @IsNotEmpty()
  receiverUserId: string;
}
