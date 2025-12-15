"use server";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function generateTxRef() {
  return `TX-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, items, cartId } = body;

    if (!userId || !items?.length) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    /* ------------------------------------------------------------------ */
    /* 🔒 Calculate total server-side                                     */
    /* ------------------------------------------------------------------ */
    const products = await prisma.product.findMany({
      where: {
        id: { in: items.map((i: any) => i.productId) },
      },
    });

    const total = items.reduce((sum: number, item: any) => {
      const product = products.find((p) => p.id === item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);

    let cart;

    /* ------------------------------------------------------------------ */
    /* 🛒 UPDATE EXISTING CART                                             */
    /* ------------------------------------------------------------------ */
    if (cartId) {
      const existingCart = await prisma.cart.findFirst({
        where: {
          id: cartId,
          userId,
          status: "pending",
        },
      });

      if (!existingCart) {
        return NextResponse.json(
          { error: "Cart not found or already processed" },
          { status: 404 }
        );
      }

      // Remove old cart items
      await prisma.cartItem.deleteMany({
        where: { cartId },
      });

      // Update cart total + items
      cart = await prisma.cart.update({
        where: { id: cartId },
        data: {
          total,
          products: {
            create: items.map((i: any) => ({
              productId: i.productId,
              quantity: i.quantity,
            })),
          },
        },
      });
    }
    /* ------------------------------------------------------------------ */
    /* 🆕 CREATE NEW CART                                                  */
    /* ------------------------------------------------------------------ */
    else {
      cart = await prisma.cart.create({
        data: {
          userId,
          total,
          status: "pending",
          products: {
            create: items.map((i: any) => ({
              productId: i.productId,
              quantity: i.quantity,
            })),
          },
        },
      });
    }

    /* ------------------------------------------------------------------ */
    /* 💳 ALWAYS CREATE NEW PAYMENT (unique tx_ref)                       */
    /* ------------------------------------------------------------------ */
    const tx_ref = generateTxRef();

    await prisma.payment.create({
      data: {
        cartId: cart.id,
        tx_ref,
        method: "flutterwave",
        amount: total,
      },
    });

    return NextResponse.json({
      cartId: cart.id,
      tx_ref,
      amount: total,
      currency: "NGN",
    });
  } catch (error) {
    console.error("Payment init failed:", error);
    return NextResponse.json(
      { error: "Checkout failed" },
      { status: 500 }
    );
  }
}
