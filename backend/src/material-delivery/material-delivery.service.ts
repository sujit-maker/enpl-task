import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMaterialDeliveryDto } from './dto/create-material-delivery.dto';
import { UpdateMaterialDeliveryDto } from './dto/update-material-delivery.dto';

@Injectable()
export class MaterialDeliveryService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateMaterialDeliveryDto) { 
    // Auto-generate deliveryChallan number
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
  
    // Create delivery for each item
    const created = await Promise.all(
      data.items.map((item) =>
        this.prisma.materialDelivery.create({
          data: {
            deliveryType: data.deliveryType,
            deliveryChallan: deliveryChallan, 
            refNumber: data.refNumber || "0000",
            customerId: data.customerId ? Number(data.customerId) : null,
            vendorId: data.vendorId ? Number(data.vendorId) : null,
            inventoryId: item.inventoryId,
            productId: item.productId,
          },
        }),
      ),
    );
  
    return created;
  }

  async update(id: number, data: UpdateMaterialDeliveryDto) {
    const delivery = await this.prisma.materialDelivery.findUnique({ where: { id } });
    if (!delivery) throw new NotFoundException('Material Delivery not found');

    return this.prisma.materialDelivery.update({
      where: { id },
      data: {
        deliveryType: data.deliveryType,
        refNumber: data.refNumber,
        deliveryChallan: data.deliveryChallan ?? undefined,

        customer: data.customerId
          ? { connect: { id: data.customerId } }
          : { disconnect: true },

        vendor: data.vendorId
          ? { connect: { id: data.vendorId } }
          : { disconnect: true },

        inventory: data.inventoryId
          ? { connect: { id: data.inventoryId } }
          : { disconnect: true },

        product: data.productId
          ? { connect: { id: data.productId } }
          : undefined, // optional in update, make sure to only connect if provided

        updatedAt: new Date(),
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
  


  async remove(id: number) {
    const delivery = await this.prisma.materialDelivery.findUnique({ where: { id } });
    if (!delivery) throw new NotFoundException('Material Delivery not found');

    return this.prisma.materialDelivery.delete({ where: { id } });
  }
}
