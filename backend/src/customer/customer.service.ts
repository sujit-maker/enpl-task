import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  // Create a Customer with contacts and bankDetails
  async create(createCustomerDto: CreateCustomerDto) {
    const {
      contacts,
      bankDetails,
      products,
      ...customerData
    } = createCustomerDto as any;

    return this.prisma.customer.create({
      data: {
        ...customerData,
        products: Array.isArray(products) ? products : [],
        contacts: {
          create: contacts || [],
        },
        bankDetails: {
          create: bankDetails || [],
        },
      },
      include: {
        contacts: true,
        bankDetails: true,
      },
    });
  }

  // Get all Customers
  async findAll() {
    return this.prisma.customer.findMany({
      include: {
        contacts: true,
        bankDetails: true,
        Sites: true,
      },
    });
  }

  // Get a specific Customer by ID
  async findOne(id: number) {
    return this.prisma.customer.findUnique({
      where: { id },
      include: {
        contacts: true,
        bankDetails: true,
        Sites: true,
      },
    });
  }

  // Update Customer details
  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const {
      contacts,
      bankDetails,
      products,
      Sites, 
      ...rest
    } = updateCustomerDto as any;
  
    return this.prisma.customer.update({
      where: { id },
      data: {
        ...rest,
        products: Array.isArray(products) ? products : [],
        // optionally handle contacts / bankDetails if needed
      },
      include: {
        contacts: true,
        bankDetails: true,
      },
    });
  }
  

  // Delete a Customer
  async remove(id: number) {
    return this.prisma.customer.delete({
      where: { id },
    });
  }
}
