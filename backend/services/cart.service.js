// backend/services/cart.service.js
import * as users from "../repositories/user.repo.js";
import * as products from "../repositories/product.repo.js";

// Βοηθός: ασφαλής άντληση productId (δέχεται string ή object)
function asProductId(productOrId) {
    if (!productOrId) return undefined;
    if (typeof productOrId === "string") return productOrId;
    return productOrId._id?.toString?.() ?? productOrId.id?.toString?.() ?? String(productOrId);
}

// Προσθήκη στο καλάθι (συμβατό με schema: user.cartItems[])
export async function addToCart(userId, productOrId, quantity = 1) {
    const productId = asProductId(productOrId);
    if (!productId) {
        throw Object.assign(new Error("Missing productId"), { status: 400 });
    }

    const user = await users.findById(userId);
    if (!user) throw Object.assign(new Error("User not found"), { status: 404 });

    // σιγουρεύουμε πως υπάρχει ο πίνακας
    if (!Array.isArray(user.cartItems)) user.cartItems = [];

    // (προαιρετικός) έλεγχος ύπαρξης προϊόντος
    const exists = await products.findById(productId);
    if (!exists) throw Object.assign(new Error("Product not found"), { status: 404 });

    const existing = user.cartItems.find(i => i.id.toString() === productId.toString());
    if (existing) existing.quantity += quantity;
    else user.cartItems.push({ id: productId, quantity });

    await user.save();

    // Επιστρέφουμε «εμπλουτισμένα» items για το UI (product + quantity)
    return getCartProducts(userId);
}

// Επιστροφή καλαθιού με στοιχεία προϊόντος (για CartPage)
export async function getCartProducts(userId) {
    const user = await users.findById(userId);
    if (!user) throw Object.assign(new Error("User not found"), { status: 404 });

    const ids = (user.cartItems ?? []).map(i => i.id);
    if (!ids.length) return [];

    const list = await products.findByIds(ids);              // υπάρχει στο repo
    const map = new Map(list.map(p => [p._id.toString(), p]));

    // [{ product, quantity, _id }] για το UI
    return user.cartItems
        .map(i => ({
            _id: i.id,
            quantity: i.quantity,
            product: map.get(i.id.toString())
        }))
        .filter(x => x.product); // αγνόησε ορφανά ids
}

// Αφαίρεση / ενημέρωση ποσοτητας – προαιρετικά αν τα χρησιμοποιείς
export async function updateQuantity(userId, productId, quantity) {
    const user = await users.findById(userId);
    if (!user) throw Object.assign(new Error("User not found"), { status: 404 });
    if (!Array.isArray(user.cartItems)) user.cartItems = [];

    const idx = user.cartItems.findIndex(i => i.id.toString() === productId.toString());
    if (idx === -1) throw Object.assign(new Error("Item not in cart"), { status: 404 });

    if (quantity <= 0) user.cartItems.splice(idx, 1);
    else user.cartItems[idx].quantity = quantity;

    await user.save();
    return getCartProducts(userId);
}

export async function removeAll(userId) {
    const user = await users.findById(userId);
    if (!user) throw Object.assign(new Error("User not found"), { status: 404 });
    user.cartItems = [];
    await user.save();
    return [];
}
