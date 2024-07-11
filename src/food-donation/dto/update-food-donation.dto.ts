import { PartialType } from '@nestjs/mapped-types';
import { CreateFoodDonationDto } from './create-food-donation.dto';

export class UpdateFoodDonationDto extends PartialType(CreateFoodDonationDto) {}
