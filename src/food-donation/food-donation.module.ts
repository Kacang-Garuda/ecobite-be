import { Module } from '@nestjs/common';
import { FoodDonationService } from './food-donation.service';
import { FoodDonationController } from './food-donation.controller';

@Module({
  controllers: [FoodDonationController],
  providers: [FoodDonationService],
})
export class FoodDonationModule {}
