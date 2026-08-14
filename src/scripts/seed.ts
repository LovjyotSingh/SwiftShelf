import { PrismaClient } from '@prisma/client';
import { INITIAL_PRODUCTS } from '../lib/data/mockCatalog';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding SwiftShelf Database with indexed catalog & vector entities...');

  // Create Categories
  const categories = ['Audio', 'Wearables', 'Computing', 'Ergonomics', 'Smart Living'];
  const categoryMap = new Map<string, string>();

  for (const cat of categories) {
    const slug = cat.toLowerCase().replace(/\s+/g, '-');
    const created = await prisma.category.upsert({
      where: { slug },
      update: {},
      create: {
        name: cat,
        slug,
        description: `Premium hardware in ${cat}`,
      },
    });
    categoryMap.set(cat, created.id);
  }

  // Create Products & Variants
  for (const prod of INITIAL_PRODUCTS) {
    const categoryId = categoryMap.get(prod.category) || Array.from(categoryMap.values())[0];

    const createdProduct = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: {
        id: prod.id,
        title: prod.title,
        slug: prod.slug,
        subtitle: prod.subtitle,
        description: prod.description,
        price: prod.price,
        originalPrice: prod.originalPrice,
        categoryId,
        rating: prod.rating,
        reviewCount: prod.reviewCount,
        images: prod.images,
        model3dUrl: prod.model3dUrl,
        badge: prod.badge,
        isFlashSale: prod.isFlashSale || false,
        flashSaleEndsAt: prod.flashSaleEndsAt ? new Date(prod.flashSaleEndsAt) : null,
        stock: prod.stock,
        reservedStock: prod.reservedStock,
        tags: prod.tags,
        features: prod.features,
        specs: prod.specs,
      },
    });

    // Create Variants
    for (const v of prod.variants) {
      await prisma.productVariant.upsert({
        where: { sku: v.sku },
        update: {},
        create: {
          id: v.id,
          productId: createdProduct.id,
          name: v.name,
          sku: v.sku,
          colorName: v.colorName,
          colorHex: v.colorHex,
          priceDelta: v.priceDelta,
          stock: v.stock,
          reservedStock: v.reservedStock,
        },
      });
    }

    // Create Reviews
    for (const rev of prod.reviews) {
      await prisma.review.create({
        data: {
          productId: createdProduct.id,
          userName: rev.userName,
          rating: rev.rating,
          title: rev.title,
          comment: rev.comment,
          verifiedPurchase: rev.verifiedPurchase,
          helpfulCount: rev.helpfulCount,
          createdAt: new Date(rev.date),
        },
      });
    }
  }

  console.log('✅ SwiftShelf Database Seeded Successfully!');
}

main()
  .catch((e) => {
    console.error('Seed Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
