import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateFoodDonationDto } from './dto/create-food-donation.dto'
import { User } from '@prisma/client'
import { UpdateFoodDonationDto } from './dto/update-food-donation.dto'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'

@Injectable()
export class FoodDonationService {
  constructor(private readonly prismaService: PrismaService) {}

  async createFoodDonation(
    createFoodDonationDto: CreateFoodDonationDto,
    user: User
  ) {
    const { recipientEmail, ...createDto } = createFoodDonationDto

    return await this.prismaService.$transaction(async (prisma) => {
      const foodDonation = await prisma.foodDonation.create({
        data: {
          userEmail: user.email,
          remainingQuantity: createDto.quantity,
          ...createDto,
        },
      })

      await prisma.foodDonationProgress.create({
        data: { status: 'POSTED', foodDonationId: foodDonation.id },
      })

      if (recipientEmail !== 'ALL') {
        await prisma.transaction.create({
          data: {
            quantity: createDto.quantity,
            notes: '',
            donorEmail: user.email,
            recipientEmail,
            foodDonationId: foodDonation.id,
          },
        })

        await prisma.foodDonation.update({
          where: { id: foodDonation.id },
          data: { remainingQuantity: 0 },
        })

        await prisma.foodDonationProgress.create({
          data: {
            status: 'BOOKED',
            quantity: createDto.quantity,
            userEmail: recipientEmail,
            foodDonationId: foodDonation.id,
          },
        })
      }
    })
  }

  async getAllFoodDonations() {
    return await this.prismaService.foodDonation.findMany({
      where: { remainingQuantity: { not: 0 } },
    })
  }

  async getAllMyFoodDonations(user: User) {
    return await this.prismaService.foodDonation.findMany({
      where: { userEmail: user.email },
      include: { progress: { include: { user: true } } },
    })
  }

  async getAllMyFoodReceived(user: User) {
    return await this.prismaService.transaction.findMany({
      where: { recipientEmail: user.email },
      include: { foodDonation: { include: { progress: true } }, donor: true },
    })
  }

  async getFoodDonation(id: string) {
    return await this.prismaService.foodDonation.findUnique({
      where: { id },
      include: { progress: { include: { user: true } } },
    })
  }

  async updateFoodDonation(
    id: string,
    updateFoodDonationDto: UpdateFoodDonationDto
  ) {
    const foodDonation = await this.prismaService.foodDonation.findUnique({
      where: { id },
    })

    if (!foodDonation) {
      throw new BadRequestException('Oops, donasi tidak ditemukan')
    }

    const bookedFoodDonation =
      foodDonation.quantity - foodDonation.remainingQuantity

    if (
      updateFoodDonationDto.quantity &&
      updateFoodDonationDto.quantity < bookedFoodDonation
    ) {
      throw new ConflictException(
        `Donasimu sudah dipesan ${bookedFoodDonation} buah. Tidak dapat mengubah data.`
      )
    }

    await this.prismaService.foodDonation.update({
      where: { id },
      data: {
        remainingQuantity: updateFoodDonationDto.quantity - bookedFoodDonation,
        ...updateFoodDonationDto,
      },
    })
  }

  async deleteFoodDonation(id: string) {
    const bookedFoodDonation = await this.prismaService.transaction.findFirst({
      where: { foodDonationId: id },
    })

    if (bookedFoodDonation) {
      throw new ConflictException(
        'Tidak bisa menghapus. Donasimu sudah ada yang pesan.'
      )
    }

    return await this.prismaService.foodDonation.delete({ where: { id } })
  }

  async bookFoodDonation(
    foodDonationId: string,
    createTransactionDto: CreateTransactionDto,
    user: User
  ) {
    await this.prismaService.$transaction(async (prisma) => {
      const foodDonation = await prisma.foodDonation.findUnique({
        where: { id: foodDonationId },
      })

      if (!foodDonation) {
        throw new BadRequestException('Oops, donasi tidak ditemukan')
      }

      if (user.email === foodDonation.userEmail) {
        throw new BadRequestException('Tidak dapat memesan donasi sendiri!')
      }

      if (createTransactionDto.quantity > foodDonation.remainingQuantity) {
        throw new BadRequestException(
          `Tidak dapat memesan. Donasi tersisa ${foodDonation.remainingQuantity}.`
        )
      }

      const transaction = await prisma.transaction.findFirst({
        where: { recipientEmail: user.email, foodDonationId: foodDonation.id },
      })

      if (transaction) {
        throw new ConflictException(
          'Anda tidak dapat memesan donasi yang sama!'
        )
      }

      await prisma.transaction.create({
        data: {
          recipientEmail: user.email,
          donorEmail: foodDonation.userEmail,
          foodDonationId: foodDonation.id,
          ...createTransactionDto,
        },
      })

      await prisma.foodDonation.update({
        where: { id: foodDonationId },
        data: {
          remainingQuantity: { decrement: createTransactionDto.quantity },
        },
      })

      await prisma.foodDonationProgress.create({
        data: {
          status: 'BOOKED',
          quantity: createTransactionDto.quantity,
          userEmail: user.email,
          foodDonationId: foodDonation.id,
        },
      })
    })
  }

  async getBookedFoodDonation(id: string) {
    return await this.prismaService.transaction.findUnique({ where: { id } })
  }

  async updateBookedFoodDonation(
    id: string,
    updateTransactionDto: UpdateTransactionDto
  ) {
    await this.prismaService.$transaction(async (prisma) => {
      const bookedFoodDonation = await prisma.transaction.findUnique({
        where: { id },
      })

      if (!bookedFoodDonation) {
        throw new BadRequestException('Oops, pesanan tidak ditemukan')
      }

      const foodDonation = await prisma.foodDonation.findUnique({
        where: { id: bookedFoodDonation.foodDonationId },
      })

      if (!foodDonation) {
        throw new BadRequestException('Oops, donasi tidak ditemukan')
      }

      if (
        updateTransactionDto.quantity &&
        updateTransactionDto.quantity >
          foodDonation.remainingQuantity + bookedFoodDonation.quantity
      ) {
        throw new BadRequestException(
          `Tidak dapat mengubah pesanan. Donasi tersisa ${foodDonation.remainingQuantity}.`
        )
      }

      await prisma.transaction.update({
        where: { id },
        data: { ...updateTransactionDto },
      })

      if (updateTransactionDto.quantity) {
        const differentQuantity =
          bookedFoodDonation.quantity - updateTransactionDto.quantity

        await prisma.foodDonation.update({
          where: { id: foodDonation.id },
          data: {
            remainingQuantity:
              foodDonation.remainingQuantity + differentQuantity,
          },
        })
      }
    })
  }

  async deleteBookedFoodDonation(id: string) {
    await this.prismaService.$transaction(async (prisma) => {
      const bookedFoodDonation = await prisma.transaction.findUnique({
        where: { id },
      })

      if (!bookedFoodDonation) {
        throw new BadRequestException('Oops, pesanan tidak ditemukan')
      }

      await prisma.foodDonation.update({
        where: { id: bookedFoodDonation.foodDonationId },
        data: { remainingQuantity: { increment: bookedFoodDonation.quantity } },
      })

      await prisma.transaction.delete({ where: { id } })
    })
  }

  async pickedUpFoodDonationProgress(foodDonationId: string, user: User) {
    const foodDonation = await this.prismaService.foodDonation.findUnique({
      where: { id: foodDonationId },
    })

    if (!foodDonation) {
      throw new BadRequestException('Oops, donasi tidak ditemukan')
    }

    const previousPickedUpProgress =
      await this.prismaService.foodDonationProgress.findFirst({
        where: { status: 'PICKED_UP', foodDonationId },
      })

    if (previousPickedUpProgress) {
      throw new BadRequestException('Pesanan sudah dipickup')
    }

    await this.prismaService.$transaction(async (prisma) => {
      await prisma.foodDonationProgress.create({
        data: {
          status: 'PICKED_UP',
          userEmail: user.email,
          foodDonationId: foodDonation.id,
        },
      })

      const transaction = await prisma.transaction.findFirst({
        where: { recipientEmail: user.email, foodDonationId },
      })

      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { isPickedUp: true },
      })
    })
  }

  async getAllInstitution() {
    return await this.prismaService.user.findMany({
      where: { isInstitution: true },
    })
  }
}
