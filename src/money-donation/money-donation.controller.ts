import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  Patch,
  Param,
} from '@nestjs/common'
import { MoneyDonationService } from './money-donation.service'
import { CreateMoneyDonationDto } from './dto/create-money-donation.dto'
import { ResponseUtil } from 'src/common/utils/response.util'
import { GetUser } from 'src/common/decorators/getUser.decorator'
import { User } from '@prisma/client'
import { FilterGetMoneyDonationReceived } from './dto/filter.dto'
import { UpdateStatusMoneyDonationDto } from './dto/update-status.dto'

@Controller('money-donation')
export class MoneyDonationController {
  constructor(
    private readonly moneyDonationService: MoneyDonationService,
    private readonly responseUtil: ResponseUtil
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async donateMoney(
    @Body() createMoneyDonationDto: CreateMoneyDonationDto,
    @GetUser() user: User
  ) {
    await this.moneyDonationService.donateMoney(createMoneyDonationDto, user)

    return this.responseUtil.response({
      code: 201,
      message: 'Success donate money!',
    })
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getMyMoneyDonationReceived(
    @GetUser() user: User,
    @Query() filter: FilterGetMoneyDonationReceived
  ) {
    const result = await this.moneyDonationService.getMyMoneyDonationReceived(
      user,
      filter
    )

    return this.responseUtil.response({
      code: 200,
      data: result,
    })
  }

  @HttpCode(HttpStatus.OK)
  @Get(':email')
  async getInstituteDetail(@Param('email') email: string) {
    const result = await this.moneyDonationService.getInstituteDetail(email)

    return this.responseUtil.response({
      code: 200,
      data: result,
    })
  }

  @HttpCode(HttpStatus.OK)
  @Patch()
  async updateMoneyDonationProgress(
    @Body() updateStatusMoneyDonationDto: UpdateStatusMoneyDonationDto
  ) {
    await this.moneyDonationService.updateMoneyDonationProgress(
      updateStatusMoneyDonationDto
    )

    return this.responseUtil.response({
      code: 200,
      message: 'Success update data!',
    })
  }
}
