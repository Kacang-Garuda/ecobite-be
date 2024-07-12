import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { FoodDonationService } from './food-donation.service'
import { ResponseUtil } from 'src/common/utils/response.util'
import { CreateFoodDonationDto } from './dto/create-food-donation.dto'
import { GetUser } from 'src/common/decorators/getUser.decorator'
import { User } from '@prisma/client'
import { UpdateFoodDonationDto } from './dto/update-food-donation.dto'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'

@Controller('food-donation')
export class FoodDonationController {
  constructor(
    private readonly foodDonationService: FoodDonationService,
    private readonly responseUtil: ResponseUtil
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createFoodDonation(
    @Body() createFoodDonationDto: CreateFoodDonationDto,
    @GetUser() user: User
  ) {
    await this.foodDonationService.createFoodDonation(
      createFoodDonationDto,
      user
    )

    return this.responseUtil.response({
      code: 201,
      message: 'Success create food donation!',
    })
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllFoodDonations() {
    const result = await this.foodDonationService.getAllFoodDonations()

    return this.responseUtil.response({
      code: 200,
      data: result,
    })
  }

  @HttpCode(HttpStatus.OK)
  @Get('my-donation')
  async getAllMyFoodDonations(@GetUser() user: User) {
    const result = await this.foodDonationService.getAllMyFoodDonations(user)

    return this.responseUtil.response({
      code: 200,
      data: result,
    })
  }

  @HttpCode(HttpStatus.OK)
  @Get('my-received')
  async getAllMyFoodReceived(@GetUser() user: User) {
    const result = await this.foodDonationService.getAllMyFoodReceived(user)

    return this.responseUtil.response({
      code: 200,
      data: result,
    })
  }

  @HttpCode(HttpStatus.OK)
  @Get('institution')
  async getAllInstitution() {
    const result = await this.foodDonationService.getAllInstitution()

    return this.responseUtil.response({
      code: 200,
      data: result,
    })
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getFoodDonation(@Param('id') id: string) {
    const result = await this.foodDonationService.getFoodDonation(id)

    return this.responseUtil.response({
      code: 200,
      data: result,
    })
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async updateFoodDonation(
    @Param('id') id: string,
    @Body() updateFoodDonationDto: UpdateFoodDonationDto
  ) {
    await this.foodDonationService.updateFoodDonation(id, updateFoodDonationDto)

    return this.responseUtil.response({
      code: 200,
      message: 'Success update food donation!',
    })
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteFoodDonation(@Param('id') id: string) {
    await this.foodDonationService.deleteFoodDonation(id)

    return this.responseUtil.response({
      code: 200,
      message: 'Success delete food donation!',
    })
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('book/:foodDonationId')
  async bookFoodDonation(
    @Param('foodDonationId') foodDonationId: string,
    @Body() createTransactionDto: CreateTransactionDto,
    @GetUser() user: User
  ) {
    await this.foodDonationService.bookFoodDonation(
      foodDonationId,
      createTransactionDto,
      user
    )

    return this.responseUtil.response({
      code: 201,
      message: 'Success book food donation!',
    })
  }

  @HttpCode(HttpStatus.OK)
  @Get('book/:id')
  async getBookedFoodDonation(@Param('id') id: string) {
    const result = await this.foodDonationService.getBookedFoodDonation(id)

    return this.responseUtil.response({
      code: 200,
      data: result,
    })
  }

  @HttpCode(HttpStatus.OK)
  @Patch('book/:id')
  async updateBookedFoodDonation(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto
  ) {
    await this.foodDonationService.updateBookedFoodDonation(
      id,
      updateTransactionDto
    )

    return this.responseUtil.response({
      code: 200,
      message: 'Success update booked food donation!',
    })
  }

  @HttpCode(HttpStatus.OK)
  @Delete('book/:id')
  async deleteBookedFoodDonation(@Param('id') id: string) {
    await this.foodDonationService.deleteBookedFoodDonation(id)

    return this.responseUtil.response({
      code: 200,
      message: 'Success delete booked food donation!',
    })
  }

  @HttpCode(HttpStatus.OK)
  @Patch('picked-up/:foodDonationId')
  async pickedUpFoodDonationProgress(
    @Param('foodDonationId') foodDonationId: string,
    @GetUser() user: User
  ) {
    await this.foodDonationService.pickedUpFoodDonationProgress(
      foodDonationId,
      user
    )

    return this.responseUtil.response({
      code: 200,
      message: 'Success update booked food donation!',
    })
  }
}
