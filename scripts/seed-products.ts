import sequelize from "@/lib/db";
import Product from "@/models/Product";
import { products } from "@/lib/products";

async function main() {
  console.log("Starting product seeding...");
  try {
    // Authenticate and sync the Product table specifically
    await sequelize.authenticate();
    console.log("Database connected successfully.");
    
    // Sync Product model specifically
    await Product.sync();
    console.log("Product table synced.");

    let createdCount = 0;
    let updatedCount = 0;

    for (const prod of products) {
      const [dbProd, created] = await Product.findOrCreate({
        where: { id: prod.id },
        defaults: {
          id: prod.id,
          title: prod.title,
          price: prod.price,
          oldPrice: prod.oldPrice || null,
          discount: prod.discount || null,
          image: prod.image,
          gallery: prod.gallery || null,
          description: prod.description,
          features: prod.features || null,
          category: prod.category,
          options: prod.options || null,
          specs: prod.specs || null,
        },
      });

      if (created) {
        createdCount++;
      } else {
        await dbProd.update({
          title: prod.title,
          price: prod.price,
          oldPrice: prod.oldPrice || null,
          discount: prod.discount || null,
          image: prod.image,
          gallery: prod.gallery || null,
          description: prod.description,
          features: prod.features || null,
          category: prod.category,
          options: prod.options || null,
          specs: prod.specs || null,
        });
        updatedCount++;
      }
    }

    console.log(`Seeding complete: Created ${createdCount} products, Updated ${updatedCount} products.`);
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await sequelize.close();
    console.log("Database connection closed.");
  }
}

main();
