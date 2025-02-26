import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
    state: () => ({
        cart: [],
    }),
    persist: true,
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
            const index = this.cart.findIndex(item => item.variant.variant_sku === product.variant.variant_sku);
            if (index !== -1) {
                this.cart.splice(index, 1);
            }
        },
        clearCart() {
            this.cart = [];
        },
        decrementItemQty(product){
            product.quantity--;
            if (product.quantity <= 0) {
                const index = this.cart.findIndex(item => item.variant.variant_sku === product.variant.variant_sku);
                if (index !== -1) {
                    this.cart.splice(index, 1);
                }
            }
        }
    },
});