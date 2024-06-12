<template>
    <v-container>
        <v-row>
            <v-col>
                <v-carousel height="auto" v-model="selectedCarouselIndex">
                        <v-carousel-item v-for="(image, index) in getAllImages(product.variants)" 
                                        :key="`${image.variantId}-${index}`" 
                                        :src="`/assets/product-images${image.imageSrc}`">
                        </v-carousel-item>
                </v-carousel>
            </v-col>
            <v-col cols="1"></v-col>
            <v-col>
                <h1>{{ product.product_title }}</h1>
                <h5>Description:</h5>
                <p>{{ product.product_description }}</p>
                <!-- <v-chip-group>
                    <v-chip v-for="variant in product.variants" :key="variant.variant_id" @click="selectVariant(variant)">{{ variant.variant_name }}</v-chip>
                </v-chip-group> -->
                <v-btn-toggle
                    v-model="toggle"
                    divided
                    mandatory
                    class="my-4"
                >
                    <v-btn v-for="variant in product.variants" @click="selectVariant(variant)">{{ variant.variant_name }}</v-btn>
                </v-btn-toggle>
                <h6>Additional Info:</h6>
                <p v-if="selectedVariant">{{  selectedVariant.variant_description  }}</p>
                <v-divider class="my-8"></v-divider>
                <v-container>
                    <v-row>
                        <v-col>
                            <h3>Price:</h3>
                        </v-col>
                        <v-col>
                            <h2 v-if="selectedVariant">${{ this.selectedVariant.variant_price }}</h2>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <h3>Quantity:</h3>
                        </v-col>
                        <v-col>
                            <v-btn-group>
                                <v-btn icon="mdi-minus" @click="decrementQty()"></v-btn>
                                <v-text-field
                                    type="number" 
                                    hide-spin-buttons 
                                    variant="solo" 
                                    v-model="qtyToAdd" 
                                    min="0"
                                    flat
                                    style="width: 6ch;"></v-text-field>
                                <v-btn icon="mdi-plus" @click="qtyToAdd++"></v-btn>
                            </v-btn-group>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-spacer></v-spacer>
                        <v-col>
                            <v-btn :disabled="!selectedVariant" @click="addProductToCart(selectedVariant, qtyToAdd)">Add to Cart</v-btn>
                        </v-col>
                        <v-spacer></v-spacer>
                    </v-row>
                </v-container>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { useCartStore } from '@/stores/cartStore';
import { mapActions } from 'pinia';

export default {
    props: {
        product: {
            type: Object,
            required: true
        }
    },

    methods: {
        ...mapActions(useCartStore, ['addToCart', 'removeFromCart']),

        getAllImages(variants) {
            return variants.reduce((acc, variant) => {
                // Check if there are images and they are not empty
                if (variant.variant_image_src && variant.variant_image_src.length > 0) {
                    const variantImages = variant.variant_image_src.map(imageSrc => ({
                        variantId: variant.variant_id,
                        imageSrc: imageSrc // Assuming this is a relative path or a complete URL
                    }));
                    acc.push(...variantImages); // Use spread operator for efficiency
                } else {
                    console.log("Assigning fallback image for variant: ", variant.variant_id)
                    // Push a default/fallback image object for variants without images
                    acc.push({
                        variantId: variant.variant_id,
                        imageSrc: '/fallback.webp' // Specify your fallback image path
                    });
                }
                return acc;
            }, []);
        },
        selectVariant(variant) {
            const allImages = this.getAllImages(this.product.variants);
            const firstImageIndex = allImages.findIndex(image => image.variantId === variant.variant_id);
            this.selectedCarouselIndex = firstImageIndex >= 0 ? firstImageIndex : 0;
            this.selectedVariant = variant;

        },
        addProductToCart(variant, quantity) {
            const item = {
                variant: variant,
                quantity: parseInt(quantity, 10) || 1,
            }
            this.addToCart(item);
        },
        decrementQty() {
            if (this.qtyToAdd > 1) {
                this.qtyToAdd--;
            }
        }
    },
    data() {
        return {
            selectedCarouselIndex: 0,
            toggle: null,
            selectedVariant: null,
            qtyToAdd: 1,
        }
    }
}
</script>

<style>
h1 {
    text-align: center;
    font-size: 3rem;
}
h2 {
    font-size: 2.6rem;
}
h3 {
    font-size: 2.5rem;
}
h5 {
    font-size: 2rem;
}
h6 {
    font-size: 1.5rem;
}
p {
    font-size: 1rem;
}
</style>