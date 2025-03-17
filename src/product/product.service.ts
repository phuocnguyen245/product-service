import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Product } from '@prisma/client';
import { PrismaService } from 'src/config/prisma';
import { slugify } from 'src/utils/slugify';
import { BaseParams, IProductWithVariant } from './product';
import ProductRepository from './product.repository';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private productRepo: ProductRepository,
  ) {}

  async createProduct(productPayload: IProductWithVariant) {
    const { productVariant, ...rest } = productPayload;
    const newProductWithVariant = await this.prisma.$transaction(async (tx) => {
      const slug = slugify(productPayload.name);

      const existingProduct = await tx.product.findUnique({ where: { slug } });

      if (existingProduct) {
        throw new BadRequestException('Product with same name already exists');
      }

      const newProduct = await tx.product.create({
        data: { ...rest },
      });

      const variants = await Promise.all(
        productVariant.map((item) =>
          tx.productVariant.create({
            data: { ...item, productId: newProduct.id },
          }),
        ),
      );
      return { ...newProduct, productVariant: variants };
    });
    return newProductWithVariant;
  }

  async getProducts({ page, limit, search, from, to }: BaseParams) {
    const whereCondition: Prisma.ProductWhereInput = {
      isDeleted: false,
      name: { contains: search },
      OR: [
        {
          updatedAt: { gte: new Date(from), lte: new Date(to) },
        },
      ],
    };

    const selectProductPromise = this.prisma.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        productVariant: {
          select: {
            id: true,
            name: true,
            sku: true,
            value: true,
            status: true,
          },
          where: { isDeleted: false },
        },
      },
      where: whereCondition,
      skip: page * limit,
      take: limit,
    });
    const countProductPromise = this.prisma.product.count({
      where: whereCondition,
    });

    const [products, count] = await Promise.all([
      selectProductPromise,
      countProductPromise,
    ]);

    return {
      data: products,
      total: count,
      page,
      limit,
    };
  }

  async updateProduct(product: Product) {
    const existingProduct = await this.productRepo.getProductById(product.id);

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
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
        productVariant: {
          select: {
            id: true,
            name: true,
            sku: true,
            value: true,
            status: true,
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

  async deleteProduct(slug: string) {
    const existingProduct = await this.productRepo.getProductBySlug(slug);

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    return await this.productRepo.deleteProductBySlug(slug);
  }
}
