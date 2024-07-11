import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateMoneyDonationDto } from './dto/create-money-donation.dto'
import { PrismaService } from 'src/prisma/prisma.service'
import { User } from '@prisma/client'
import { FilterGetMoneyDonationReceived } from './dto/filter.dto'
import { UpdateStatusMoneyDonationDto } from './dto/update-status.dto'

@Injectable()
export class MoneyDonationService {
  constructor(private readonly prismaService: PrismaService) {}

  async donateMoney(
    createMoneyDonationDto: CreateMoneyDonationDto,
    user: User
  ) {
    const recipient = await this.prismaService.user.findUnique({
      where: { email: createMoneyDonationDto.recipientEmail },
    })

    if (!recipient.isInstitution) {
      throw new BadRequestException('Penerima bukan institusi!')
    }

    return await this.prismaService.$transaction(async (prisma) => {
      const moneyDonation = await prisma.moneyDonation.create({
        data: { donorEmail: user.email, ...createMoneyDonationDto },
      })

      await prisma.moneyDonationProgress.create({
        data: { status: 'PENDING', moneyDonationId: moneyDonation.id },
      })
    })
  }

  async getMyMoneyDonationReceived(
    user: User,
    filter: FilterGetMoneyDonationReceived
  ) {
    return await this.prismaService.moneyDonation.findMany({
      where: {
        recipientEmail: user.email,
        progress: filter.status
          ? {
              some: { status: filter.status },
            }
          : undefined,
        createdAt:
          filter.startDate && filter.endDate
            ? { gte: filter.startDate, lte: filter.endDate }
            : undefined,
      },
      orderBy: { createdAt: filter.sortBy ? filter.sortBy : 'asc' },
      include: { progress: true, donor: true },
    })
  }

  async updateMoneyDonationProgress(
    updateStatusMoneyDonationDto: UpdateStatusMoneyDonationDto
  ) {
    await this.prismaService.$transaction(async (prisma) => {
      updateStatusMoneyDonationDto.moneyDonationIds.forEach(async (value) => {
        await prisma.moneyDonationProgress.create({
          data: {
            status: updateStatusMoneyDonationDto.status,
            moneyDonationId: value,
          },
        })
      })
    })
  }
}
