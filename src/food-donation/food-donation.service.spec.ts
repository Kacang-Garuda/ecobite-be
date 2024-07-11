import { Test, TestingModule } from '@nestjs/testing';
import { FoodDonationService } from './food-donation.service';

describe('FoodDonationService', () => {
  let service: FoodDonationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FoodDonationService],
    }).compile();

    service = module.get<FoodDonationService>(FoodDonationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
