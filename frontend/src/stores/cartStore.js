import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
    state: () => ({
        cart: [],
    }),
    actions: {
        addToCart(product) {
            const existingItem = this.cart.find(cartItem => cartItem.variant.variant_sku === product.variant.variant_sku);
            if (existingItem) {
                existingItem.quantity += product.quantity;
            } else {
                this.cart.push(product);
            }
        },
        removeFromCart(product) {
            // Remove from cart function
        },
        clearCart() {
            this.cart = [];
        }
    },
});