import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  // ✅ Create Product
  async createProduct(createProductDto: CreateProductDto) {
    const {
      productId,
      productName,
      productDescription,
      HSN,
      categoryId,
      subCategoryId,
    } = createProductDto;

    return this.prisma.product.create({
      data: {
        productId,
        productName,
        productDescription,
        HSN,
        categoryId: Number(categoryId),
        subCategoryId: subCategoryId ? Number(subCategoryId) : null,
      },
    });
  }

  // ✅ Get All Products
  async getProducts() {
    return this.prisma.product.findMany({
      include: {
        category: true,
        subCategory: true,
      },
    });
  }

  // ✅ Get Product By ID
  async getProductById(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: Number(id) }, // Ensure ID is converted to number
      include: {
        category: true,
        subCategory: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  // ✅ Update Product (Fixed)
  async updateProduct(id: number, updateProductDto: UpdateProductDto) {
    try {
      const {
        productId,
        productName,
        productDescription,
        HSN,
        categoryId,
        subCategoryId,
      } = updateProductDto;

      // Convert ID & categoryId to numbers
      const productIdNumber = Number(id);
      const categoryNumber = Number(categoryId);
      const subCategoryNumber = subCategoryId ? Number(subCategoryId) : null;

      if (isNaN(productIdNumber)) {
        throw new BadRequestException('Invalid product ID');
      }

      return await this.prisma.product.update({
        where: { id: productIdNumber },
        data: {
          productId,
          productName,
          productDescription,
          HSN,
          categoryId: categoryNumber,
          subCategoryId: subCategoryNumber,
        },
      });
    } catch (error) {
      console.error('Error updating product:', error);
      throw new BadRequestException(`Failed to update product: ${error.message}`);
    }
  }

  // ✅ Delete Product
  async deleteProduct(id: number) {
    return this.prisma.product.delete({
      where: {
        id: Number(id),
      },
    });
  }
}