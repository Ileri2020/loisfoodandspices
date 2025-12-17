"use server";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

function generateTxRef() {
  return `TX-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
}

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action"); // ?action=confirm
    const body = await req.json();

    // ---------------- CONFIRM PAYMENT ----------------
    // CONFIRM PAYMENT
    if (action === "confirm") {
    const { tx_ref } = body;
    if (!tx_ref)
        return NextResponse.json({ error: "tx_ref is required" }, { status: 400 });

    const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;

    // Fetch transaction from FlutterWave
    const fwRes = await axios.get(
        `https://api.flutterwave.com/v3/transactions?tx_ref=${tx_ref}`,
        { headers: { Authorization: `Bearer ${FLW_SECRET_KEY}` } }
    );

    const data = fwRes.data?.data?.[0];

    if (!data)
        return NextResponse.json({ success: false, message: "Transaction not found" });

    if (data.status === "successful") {
        // Find payment by tx_ref
        const payment = await prisma.payment.findUnique({ where: { tx_ref } });

        if (payment) {
        // Mark cart as paid
        await prisma.cart.update({
            where: { id: payment.cartId },
            data: { status: "paid" },
        });
        }

        return NextResponse.json({ success: true, message: "Payment confirmed" });
    }

    return NextResponse.json({ success: false, message: "Payment not completed yet" });
    }


    // ---------------- INITIATE PAYMENT ----------------
    const { userId, items, cartId } = body;

    if (!userId || !items?.length) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Calculate total server-side
    const products = await prisma.product.findMany({
      where: { id: { in: items.map((i: any) => i.productId) } },
    });
    const total = items.reduce((sum: number, item: any) => {
      const product = products.find((p) => p.id === item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);

    let cart;
    if (cartId) {
      const existingCart = await prisma.cart.findFirst({ where: { id: cartId, userId, status: "pending" } });
      if (!existingCart) return NextResponse.json({ error: "Cart not found or already processed" }, { status: 404 });

      await prisma.cartItem.deleteMany({ where: { cartId } });

      cart = await prisma.cart.update({
        where: { id: cartId },
        data: {
          total,
          products: { create: items.map((i: any) => ({ productId: i.productId, quantity: i.quantity })) },
        },
      });
    } else {
      cart = await prisma.cart.create({
        data: {
          userId,
          total,
          status: "pending",
          products: { create: items.map((i: any) => ({ productId: i.productId, quantity: i.quantity })) },
        },
      });
    }

    // Create payment record
    const tx_ref = generateTxRef();
    await prisma.payment.create({
      data: { cartId: cart.id, tx_ref, method: "flutterwave", amount: total },
    });

    return NextResponse.json({ cartId: cart.id, tx_ref, amount: total, currency: "NGN" });
  } catch (error) {
    console.error("Payment failed:", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
