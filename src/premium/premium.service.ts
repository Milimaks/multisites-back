import { Injectable } from '@nestjs/common';
import { UserService } from 'src/users/users.service';

@Injectable()
export class PremiumService {
  constructor(private readonly userService: UserService) {}

  async newTrial(userId: string) {
    // Logique pour attribuer un essai premium à l'utilisateur
    const user = await this.userService.getUserById({ userId });
    if (!user) {
      throw new Error('User not found');
    }
    if (user.firstFreePremium === false) {
      user.firstFreePremium = true;
    }
    user.isFreePremium = true;
    user.freePremiumExpiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.userService.updateUser(user);
    return { message: 'Premium trial granted', user };
  }
}
