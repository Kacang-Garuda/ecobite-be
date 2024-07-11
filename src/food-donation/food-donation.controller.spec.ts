import { Test, TestingModule } from '@nestjs/testing';
import { FoodDonationController } from './food-donation.controller';
import { FoodDonationService } from './food-donation.service';

describe('FoodDonationController', () => {
  let controller: FoodDonationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoodDonationController],
      providers: [FoodDonationService],
    }).compile();

    controller = module.get<FoodDonationController>(FoodDonationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
