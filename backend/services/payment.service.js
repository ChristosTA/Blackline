import * as coupons from "../repositories/coupon.repo.js";
import * as orders from "../repositories/order.repo.js";
import { stripe } from "../lib/stripe.js";

async function createStripeCoupon(percentage) {
    const c = await stripe.coupons.create({ percent_off: percentage, duration: "once" });
    return c.id;
}

export async function createCheckoutSession(user, body, clientUrl) {
    const { products, couponCode } = body;
    if (!Array.isArray(products) || products.length === 0) {
        const e = new Error("Invalid or empty products array"); e.status = 400; throw e;
    }

    let totalAmount = 0;
    const lineItems = products.map((p) => {
        const amount = Math.round(p.price * 100);
        totalAmount += amount * (p.quantity || 1);
        return {
            price_data: {
                currency: "usd",
                product_data: { name: p.name, images: [p.image] },
                unit_amount: amount,
            },
            quantity: p.quantity || 1,
        };
    });

    let coupon = null;
    if (couponCode) {
        coupon = await coupons.findByCodeForUser(couponCode, user._id);
        if (!coupon) { const e = new Error("Coupon not found"); e.status = 404; throw e; }
        const now = new Date();
        if (coupon.expirationDate <= now) {
            coupon.isActive = false;
            await coupon.save();
            const e = new Error("Coupon expired"); e.status = 404; throw e;
        }
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: lineItems,
        success_url: `${clientUrl}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${clientUrl}/purchase-cancel`,
        discounts: coupon ? [{ coupon: await createStripeCoupon(coupon.discountPercentage) }] : [],
        metadata: {
            userId: user._id.toString(),
            couponCode: couponCode || "",
            products: JSON.stringify(products.map(p => ({ id: p._id || p.id, quantity: p.quantity, price: p.price }))),
        },
    });

    // bonus coupon για μεγάλες παραγγελίες
    if (totalAmount >= 20000) {
        await coupons.deleteByUser(user._id);
        await coupons.create({
            code: "GIFT" + Math.random().toString(36).substring(2,8).toUpperCase(),
            discountPercentage: 10,
            expirationDate: new Date(Date.now() + 30*24*60*60*1000),
            userId: user._id,
        });
    }

    return { id: session.id, totalAmount: totalAmount / 100 };
}

export async function finalizeCheckout(sessionId) {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
        const e = new Error("Payment not completed");
        e.status = 400;
        throw e;
    }

    if (session.metadata.couponCode) {
        await coupons.findByCodeForUser(session.metadata.couponCode, session.metadata.userId)
            .then(async c => {
                if (c) {
                    c.isActive = false;
                    await c.save();
                }
            });
    }

    const products = JSON.parse(session.metadata.products);
    const order = await orders.create({
        user: session.metadata.userId,
        products: products.map(p => ({product: p.id, quantity: p.quantity, price: p.price})),
        totalAmount: session.amount_total / 100,
        stripeSessionId: sessionId,
    });

    return {success: true, orderId: order._id}
}
