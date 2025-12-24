import { NextRequest, NextResponse } from "next/server";
import { sendOrderNotification } from "@/lib/nodemailer";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, orderDetails } = body;

        if (!email || !orderDetails) {
            return NextResponse.json(
                { error: "Email and order details are required" },
                { status: 400 }
            );
        }

        await sendOrderNotification(email, orderDetails);

        return NextResponse.json({ success: true, message: "Notification sent" });
    } catch (error) {
        console.error("Failed to send notification:", error);
        return NextResponse.json(
            { error: "Failed to send notification" },
            { status: 500 }
        );
    }
}
