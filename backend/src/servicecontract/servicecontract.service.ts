import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateServiceContractDto } from './dto/create-contract-inventory.dto';
import { UpdateServiceContractDto } from './dto/update-service-contract.dto';

@Injectable()
export class ServicecontractService {
      constructor(private readonly prisma: PrismaService) {}
    
      async create(dto: CreateServiceContractDto) {
        const { contractInventories, ...contractData } = dto;
      
        // Auto-generate contractNo
        const lastEntry = await this.prisma.serviceContracts.findFirst({
          orderBy: { createdAt: 'desc' },
          select: { contractNo: true },
          where: {
            contractNo: {
              startsWith: 'EN-CONT-', // Ensure it starts with 'EN-CONT-'
            },
          },
        });
      
        let nextNumber = 1;
        let baseNumber = new Date().getFullYear(); // The year part (2526)
      
        if (lastEntry?.contractNo) {
          const lastNumber = parseInt(lastEntry.contractNo.split('-')[3]); // Split to get the last incremented number
          if (!isNaN(lastNumber)) {
            nextNumber = lastNumber + 1; // Increment the number
          }
        }
      
        const paddedNumber = String(nextNumber).padStart(2, '0'); // Ensure 2-digit padding
        const contractNo = `EN-CONT-${baseNumber}-${paddedNumber}`;
      
        // Create service contract with contractInventories
        return this.prisma.serviceContracts.create({
          data: {
            ...contractData,
            startDate: new Date(contractData.startDate),
            endDate: new Date(contractData.endDate),
            contractNo,
            contractInventories: {
              create: contractInventories.map((inv) => ({
                ...inv,
                dateOfPurchase: new Date(inv.dateOfPurchase), // ✅ convert here
              })),
            },
          },
          include: {
            contractInventories: true,
          },
        });
        
        
      }
      
    
      async findAll() {
        return this.prisma.serviceContracts.findMany({
          include: {
             contractInventories: true, 
             Site: true,
             Customer: true,
            },
        });
      }
    
      async findOne(id: number) {
        return this.prisma.serviceContracts.findUnique({
          where: { id },
          include: { contractInventories: true,
            Site: true,
            Customer: true,
           },
        });
      }
    
      async update(id: number, updateDto: UpdateServiceContractDto) {
        const { contractInventories, ...contractData } = updateDto;
      
        // Step 1: Update Service Contract
        const updatedContract = await this.prisma.serviceContracts.update({
          where: { id },
          data: contractData,
        });
      
        // Step 2: Remove old inventories
        await this.prisma.contractInventory.deleteMany({
          where: { contractId: id },
        });
      
        // Step 3: Insert new inventories
        if (contractInventories && contractInventories.length > 0) {
          await this.prisma.contractInventory.createMany({
            data: contractInventories.map((item) => ({
              ...item,
              contractId: id,
              dateOfPurchase: new Date(item.dateOfPurchase),
            })),
          });
        }
      
        return updatedContract;
      }
      
    
      async remove(id: number) {
        return this.prisma.serviceContracts.delete({
          where: { id },
        });
      }
}
