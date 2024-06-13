<template>
    <v-menu
        :close-on-content-click="false"
        location="bottom"
        width="20%"   
    >
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" prepend-icon="mdi-cart-variant" variant="text" >{{ cartItemsCount }}</v-btn>
        </template>
        <v-list
            v-if="cartItems.length > 0"
            lines="3">
            <v-list-item
                v-for="item in cartItems"
                :key="item.sku"
            >
                <v-row align="center">
                    <v-col cols="1">
                        <v-avatar rounded="0">
                            <v-img :src="item.variant.variant_image_src ? `/assets/product-images${item.variant.variant_image_src[0]}` : `/assets/product-images/fallback.webp`"></v-img>
                        </v-avatar>
                    </v-col>
                    <v-col>
                        <v-list-item-title>{{ item.variant.product_title }}</v-list-item-title>
                        <v-list-item-subtitle>{{ item.variant.variant_name }}</v-list-item-subtitle>
                        <v-list-item-subtitle>Qty: {{ item.quantity }}</v-list-item-subtitle>
                    </v-col>
                    <v-col cols="2">
                        <span>${{ item.variant.variant_price }}</span>
                    </v-col>
                    <v-col>
                        <v-btn-group>
                            <v-btn icon="mdi-minus" @click="decrementItemQty(item)"></v-btn>
                            <v-text-field
                                type="number"
                                hide-spin-buttons
                                variant="solo"
                                v-model="item.quantity"
                                min="0"
                                flat
                                style="width: 6ch;"></v-text-field>
                            <v-btn icon="mdi-plus" @click="item.quantity++"></v-btn>
                            <v-btn icon="mdi-delete" @click="removeFromCart(item)"></v-btn>
                        </v-btn-group>
                    </v-col>
                </v-row>
            </v-list-item>
            <v-list-item class="d-flex justify-end my-2">
                <v-btn class="ml-4 my-2" @click="clearCart()">Clear Cart</v-btn>
                <v-btn class="mx-4">View Cart</v-btn>
            </v-list-item>
        </v-list>
        <v-list v-else>
            <v-empty-state
                headline=""
                title="Empty Cart"
                text="Looks like you haven't added anything to the cart (yet)"></v-empty-state>
        </v-list>
    </v-menu>
</template>

<script>
import { useCartStore } from '@/stores/cartStore';
import { mapActions } from 'pinia';

export default {
    data() {
        return {
            menu: false,
        };
    },
    computed: {
        cartItemsCount() {
            const cartStore = useCartStore();
            return cartStore.cart.reduce((total, item) => total + item.quantity, 0);
        },
        cartItems() {
            const cartStore = useCartStore();
            return cartStore.cart;
        }
    },
    methods: {
        ...mapActions(useCartStore, ['removeFromCart', 'clearCart', 'decrementItemQty'])
    },
    watch: {
        cartItems: {
            handler(newItems) {
                newItems.forEach(item => {
                    if (item.quantity <= 0) {
                        this.removeFromCart(item);
                    }
                });
            },
            deep: true
        }
    }
}
</script>

<style>
</style>