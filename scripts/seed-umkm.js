const { Client } = require('pg');
require('dotenv').config();

const connectionString = process.env.DIRECT_URL;
if (!connectionString) {
  console.error('DIRECT_URL tidak ditemukan di .env');
  process.exit(1);
}

const umkmList = [
  {
    slug: 'toko-terang-jaya',
    name: 'Toko Terang Jaya',
    mapCode: 'T7',
    products: ['Aneka Minuman', 'Aneka Ice Cream', 'Aneka Mainan'],
    price: 'Rp 3.000 - Rp 30.000',
    discountCoupon: 5000,
    imageUrl: '/images/TerangJaya_Toko_1.jpeg',
    sortOrder: 1,
  },
  {
    slug: 'toko-99ceria',
    name: 'Toko 99Ceria',
    mapCode: 'T8',
    products: ['Kebab Medium', 'Kebab Jumbo', 'Es Teh'],
    price: 'Rp 5.000 - Rp 13.000',
    discountCoupon: 5000,
    imageUrl: '/images/99Ceria_Toko_2.jpeg',
    sortOrder: 2,
  },
  {
    slug: 'toko-batik-adis',
    name: 'Toko Batik Adis',
    mapCode: 'T3',
    products: ['Baju Batik'],
    price: 'Rp 150.000 - Rp 260.000',
    discountCoupon: 30000,
    imageUrl: '/images/toko_batik_adis.jpeg',
    sortOrder: 3,
  },
  {
    slug: 'toko-amir-jaya',
    name: 'Toko Amir Jaya',
    mapCode: 'T4',
    products: ['Baju Batik', 'Sarung', 'Kain Batik'],
    price: 'Rp 150.000',
    discountCoupon: 30000,
    imageUrl: '/images/AmirJaya_Toko_3.jpeg',
    sortOrder: 4,
  },
  {
    slug: 'toko-sakinah-batik',
    name: 'Toko Sakinah Batik',
    mapCode: 'T6',
    products: ['Baju Batik', 'Sarung', 'Kain Batik'],
    price: 'Rp 150.000',
    discountCoupon: 30000,
    imageUrl: '/images/BatikSakinah_Produk_5.jpeg',
    sortOrder: 5,
  },
  {
    slug: 'toko-rimanda',
    name: 'Toko Rimanda',
    mapCode: 'T5',
    products: ['Baju Batik'],
    price: 'Rp 150.000',
    discountCoupon: 30000,
    imageUrl: '/images/toko-batik-rimanda.jpeg',
    sortOrder: 6,
  },
];

async function seed() {
  const client = new Client({ connectionString });
  await client.connect();
  console.log('Terhubung ke database Supabase.');

  for (const u of umkmList) {
    const id = 'umkm_' + u.slug.replace(/-/g, '_');
    const query = `
      INSERT INTO "Umkm" (
        "id", "slug", "name", "mapCode", "products", "price", "discountCoupon", "imageUrl", "isActive", "sortOrder", "createdAt", "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, true, $9, NOW(), NOW()
      )
      ON CONFLICT ("slug") DO UPDATE SET
        "name" = EXCLUDED."name",
        "mapCode" = EXCLUDED."mapCode",
        "products" = EXCLUDED."products",
        "price" = EXCLUDED."price",
        "discountCoupon" = EXCLUDED."discountCoupon",
        "imageUrl" = EXCLUDED."imageUrl",
        "sortOrder" = EXCLUDED."sortOrder",
        "updatedAt" = NOW();
    `;
    await client.query(query, [
      id,
      u.slug,
      u.name,
      u.mapCode,
      u.products,
      u.price,
      u.discountCoupon,
      u.imageUrl,
      u.sortOrder,
    ]);
    console.log('Upsert berhasil:', u.name);
  }

  const res = await client.query('SELECT count(*) FROM "Umkm"');
  console.log('Total baris di tabel Umkm:', res.rows[0].count);

  await client.end();
}

seed().catch(err => {
  console.error('Seed gagal:', err);
  process.exit(1);
});
