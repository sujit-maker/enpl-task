import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMaterialDeliveryDto } from './dto/create-material-delivery.dto';
import { UpdateMaterialDeliveryDto } from './dto/update-material-delivery.dto';

@Injectable()
export class MaterialDeliveryService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateMaterialDeliveryDto) {
    // Find the latest deliveryChallan
    const lastEntry = await this.prisma.materialDelivery.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { deliveryChallan: true },
      where: {
        deliveryChallan: {
          startsWith: 'EN-MDN-',
        },
      },
    });

    let nextNumber = 1;

    if (lastEntry?.deliveryChallan) {
      const lastNumber = parseInt(lastEntry.deliveryChallan.split('EN-MDN-')[1]);
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }

    const paddedNumber = String(nextNumber).padStart(3, '0');
    const deliveryChallan = `EN-MDN-${paddedNumber}`;

    return this.prisma.materialDelivery.create({
      data: {
        ...data,
        deliveryChallan,
      },
    });
  }

  async findAll() {
    return this.prisma.materialDelivery.findMany({
      include: {
        inventory: {
          include: {
            product: true,
          },
        },
        customer: true,
        vendor: true,
      },
    });
  }

  async findOne(id: number) {
    const delivery = await this.prisma.materialDelivery.findUnique({
      where: { id },
      include: {
        inventory: {
          include: {
            product: true,
          },
        },
        customer: true,
        vendor: true,
      },
    });

    if (!delivery) throw new NotFoundException('Material Delivery not found');
    return delivery;
  }

  async update(id: number, data: UpdateMaterialDeliveryDto) {
    const delivery = await this.prisma.materialDelivery.findUnique({ where: { id } });
    if (!delivery) throw new NotFoundException('Material Delivery not found');

    return this.prisma.materialDelivery.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    const delivery = await this.prisma.materialDelivery.findUnique({ where: { id } });
    if (!delivery) throw new NotFoundException('Material Delivery not found');

    return this.prisma.materialDelivery.delete({ where: { id } });
  }
}
