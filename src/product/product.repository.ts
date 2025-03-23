import { PrismaService } from '../config/prisma';

class ProductRepository {
  constructor(private prisma: PrismaService) {}

  async getProductBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug, isDeleted: false },
    });
    return product;
  }

  async getProductById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id, isDeleted: false },
    });
    return product;
  }

  async deleteProductBySlug(slug: string) {
    return await this.prisma.product.update({
      where: { slug },
      data: {
        isDeleted: true,
      },
    });
  }
}

export default ProductRepository;
