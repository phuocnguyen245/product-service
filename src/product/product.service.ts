import { IProductWithVariant } from './product.d';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';
import { PrismaService } from '../config/prisma';
import { slugify } from '../utils/slugify';
import { BaseParams } from './product';
import ProductRepository from './product.repository';
import constants from '../constants';
@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private productRepo: ProductRepository,
  ) {}

  async createProduct(productPayload: IProductWithVariant) {
    const newProductWithVariant = await this.prisma.$transaction(async (tx) => {
      const slug = slugify(productPayload.name);

      const existingProduct = await tx.product.findUnique({ where: { slug } });

      if (existingProduct) {
        throw new BadRequestException('Product with same name already exists');
      }

      const newProduct = await tx.product.create({
        data: productPayload,
      });

      return newProduct;
    });
    return newProductWithVariant;
  }

  async getProducts({ userId, page, limit, search, from, to }: BaseParams) {
    try {
      const whereCondition: Prisma.ProductWhereInput = {
        userId,
        isDeleted: false,
        ...(search ? { name: { contains: search } } : {}),
      };

      if (from || to) {
        whereCondition.createdAt = {
          gte: new Date(from || constants.FROM),
          lte: new Date(to || constants.TO),
        };
      }

      const [products, total] = await Promise.all([
        this.prisma.product.findMany({
          select: {
            id: true,
            name: true,
            description: true,
            slug: true,
            productVariants: {
              select: {
                id: true,
                name: true,
                sku: true,
                status: true,
                attributes: true,
              },
              where: { isDeleted: false },
            },
          },
          where: whereCondition,
          skip: page * limit,
          take: limit,
        }),
        this.prisma.product.count({ where: whereCondition }),
      ]);

      // Đảm bảo rằng mảng sản phẩm và mảng productVariants của từng sản phẩm không null
      const safeProducts = (products || []).map((product) => ({
        ...product,
        productVariants: product.productVariants || [],
      }));

      return { data: safeProducts, total, page, limit };
    } catch (error) {
      console.error('Service error:', error);
      return { data: [], total: 0, page, limit };
    }
  }

  async updateProduct(product: Product) {
    const existingProduct = await this.productRepo.getProductById(product.id);

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    if (existingProduct.userId !== product.userId) {
      throw new BadRequestException(
        'You are not authorized to update this product',
      );
    }

    let slug = existingProduct.slug;
    if (product?.name && product.name !== existingProduct.name) {
      slug = slugify(product.name);
      const productWithSameName = await this.productRepo.getProductBySlug(slug);

      if (productWithSameName) {
        throw new BadRequestException('Product with same name already exists');
      }
    }

    return await this.prisma.product.update({
      where: { id: product.id },
      data: { ...product, slug },
    });
  }

  async getProductFromSlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug, isDeleted: false },
      select: {
        id: true,
        name: true,
        description: true,
        slug: true,
        productVariants: {
          select: {
            id: true,
            name: true,
            sku: true,
            status: true,
            attributes: true,
          },
          where: { isDeleted: false },
        },
      },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async deleteProduct({ slug, userId }: { slug: string; userId: string }) {
    const existingProduct = await this.productRepo.getProductBySlug(slug);

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    if (existingProduct.userId !== userId) {
      throw new BadRequestException(
        'You are not authorized to delete this product',
      );
    }

    return await this.productRepo.deleteProductBySlug(slug);
  }
}
