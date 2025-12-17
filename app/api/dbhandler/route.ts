"use server";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();

// Centralized model mapping
const modelMap: Record<string, any> = {
  cart: prisma.cart,
  cartItem: prisma.cartItem,
  category: prisma.category,
  coupon: prisma.coupon,
  featuredProduct: prisma.featuredProduct,
  notification: prisma.notification,
  payment: prisma.payment,
  post: prisma.post,
  product: prisma.product,
  refund: prisma.refund,
  review: prisma.review,
  shippingAddress: prisma.shippingAddress,
  stock: prisma.stock,
  user: prisma.user,
};

// =====================
// Utilities
// =====================
async function parseJson(req: NextRequest) {
  try {
    const json = await req.json();
    return typeof json === "object" && json !== null ? json : {};
  } catch {
    return {};
  }
}

async function handleUpload(file: File | string) {
  let dataURI = typeof file === "string" ? file : "";

  if (typeof file !== "string") {
    const buffer = await file.arrayBuffer();
    const b64 = Buffer.from(buffer).toString("base64");
    dataURI = `data:${file.type};base64,${b64}`;
  }

  const res = await cloudinary.v2.uploader.upload(dataURI, { resource_type: "auto" });
  return res;
}

function parseId(id: string | null, model: string) {
  if (!id) return null;
  return ["user", "category", "product"].includes(model) ? id : Number(id);
}

// ==================== GET ====================
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const model = searchParams.get("model") || null;
  const id = parseId(searchParams.get("id"), model || "");
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";
  const categoryFilter = searchParams.get("category")?.toLowerCase() || "";

  if (!model || !modelMap[model]) {
    return NextResponse.json({ error: "Invalid model" }, { status: 400 });
  }

  const prismaModel = modelMap[model];

  // Define valid includes per model
  const includeMap: Record<string, any> = {
    product: { category: true, stock: true, reviews: true },
    featuredProduct: { product: { include: { category: true, stock: true, reviews: true } } },
    review: { user: { select: { id: true, name: true, email: true, image: true } }, product: true },
    post: { author: true },
    cart: { products: { include: { product: true } }, user: true },
    user: { cart: true, reviews: true, addresses: true, post: true, notification: true },
    category: { products: true },
    stock: { product: true },
    payment: { cart: true },
    refund: { cart: true },
  };

  try {
    // Single item fetch
    if (id) {
      if (model === "review") {
        const items = await prismaModel.findMany({ where: { productId: id } });
        return NextResponse.json(items);
      } else {
        const item = await prismaModel.findUnique({
          where: { id },
          include: includeMap[model] || undefined,
        });
        if (!item) return NextResponse.json({ error: "Document not found" }, { status: 404 });
        return NextResponse.json(item);
      }
    }

    // Prioritized product search
   if (model === "product") {
      const where: any = {};

      if (id) {
        where.id = id; // only works if id is string (your schema should match)
      } else if (searchQuery || categoryFilter) {
        where.OR = [];

        if (searchQuery) {
          where.OR.push({ name: { contains: searchQuery, mode: "insensitive" } });
        }

        if (categoryFilter) {
          where.OR.push({ category: { name: { contains: categoryFilter, mode: "insensitive" } } });
        }
      }

      const products = await prisma.product.findMany({
        where,
        include: includeMap[model],
        take: 50,
      });

      return NextResponse.json(products);
    }

    // Fallback: search for products by previous syntax
    if (model === "productss" && searchQuery.length >= 3) {
      const items = await prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: searchQuery, mode: "insensitive" } },
            { category: { name: { contains: searchQuery, mode: "insensitive" } } },
          ],
        },
        take: 10,
      });
      return NextResponse.json(items);
    }

    // Default fetch all
    const items = await prismaModel.findMany({ include: includeMap[model] || undefined });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Database GET error:", error);
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}

// ==================== POST ====================
export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const model = searchParams.get("model");

  if (!model || !modelMap[model]) {
    return NextResponse.json({ error: "Invalid model" }, { status: 400 });
  }

  const prismaModel = modelMap[model];
  const contentType = req.headers.get("content-type") || "";
  let body: any = {};

  // Handle FormData
  if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
    const formData = await req.formData();
    const files = formData.getAll("file") as File[];

    if (files?.length > 0) {
      const urls: string[] = [];
      for (const file of files) {
        const uploadRes = await handleUpload(file);
        urls.push(uploadRes.url);
      }
      if (model === "product") body.images = urls;
      if (model === "user" || model === "category") body.image = urls[0];
    }

    formData.forEach((value, key) => {
      if (key === "file") return;
      body[key] = value;
    });
  } else if (contentType.includes("application/json")) {
    body = await req.json();
  } else {
    return NextResponse.json({ error: "Unsupported Content-Type" }, { status: 415 });
  }

  try {
    if (model === "cart") {
      const { userId, products, status } = body;
      const productIds = products.map((p: any) => p.productId);
      const dbProducts = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, price: true },
      });

      let total = 0;
      products.forEach((item: any) => {
        const found = dbProducts.find((p) => p.id === item.productId);
        if (found) total += found.price * item.quantity;
      });

      const newCart = await prisma.cart.create({
        data: {
          userId,
          total,
          status: status || "pending",
          products: { create: products.map((p: any) => ({ productId: p.productId, quantity: p.quantity })) },
        },
        include: { products: true },
      });
      return NextResponse.json(newCart);
    }

    if (model === "user" && body.password) {
      const salt = await bcrypt.genSalt();
      body.password = await bcrypt.hash(body.password, salt);
    }

    if (body.price) body.price = parseFloat(body.price);

    const newItem = await prismaModel.create({ data: body });
    return NextResponse.json(newItem);
  } catch (error) {
    console.error("Database POST error:", error);
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}

// ==================== PUT ====================
export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const model = searchParams.get("model");
  if (!model || !modelMap[model]) return NextResponse.json({ error: "Invalid model" }, { status: 400 });

  const prismaModel = modelMap[model];
  const contentType = req.headers.get("content-type") || "";
  const body: any = {};

  let data: Record<string, any> = {};

  if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
    const formData = await req.formData();
    data = Object.fromEntries(formData.entries());
    const file = formData.get("file") as File | null;

    if (file) {
      const uploadRes = await handleUpload(file);
      if (model === "category" || model === "user") body.image = uploadRes.url;
      if (model === "product") body.images = [uploadRes.url];
    } else if (formData.get("image")) body.image = formData.get("image") as string;

    formData.forEach((value, key) => {
      if (key === "file" || key === "image") return;
      body[key] = value;
    });
  } else if (contentType.includes("application/json")) {
    data = await req.json();
    Object.assign(body, data);
    if (data.image && (model === "user" || model === "category")) body.image = data.image;
    if (data.images && model === "product") body.images = data.images;
  } else {
    return NextResponse.json({ error: "Unsupported Content-Type" }, { status: 415 });
  }

  const id = parseId(body.id || searchParams.get("id"), model);
if (!id) return NextResponse.json({ error: "Missing or invalid id" }, { status: 400 });
  if (!id) return NextResponse.json({ error: "Missing or invalid id" }, { status: 400 });

  const { id: _ignore, ...updatedData } = body;
  if (!updatedData || Object.keys(updatedData).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  try {
    const updatedItem = await prismaModel.update({ where: { id }, data: updatedData });
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Database PUT error:", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

// ==================== DELETE ====================
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const model = searchParams.get("model");
  const id = `${parseId(searchParams.get("id"), model || "")}`;

  if (!model || !modelMap[model]) return NextResponse.json({ error: "Invalid model" }, { status: 400 });
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const prismaModel = modelMap[model];

  try {
    await prismaModel.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Database DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
