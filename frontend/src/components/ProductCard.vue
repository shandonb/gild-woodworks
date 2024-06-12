<template>
    <v-card width="100%" :style="{ minWidth: '280px' }" class="px-4 pt-4 pb-1 mx-0 mb-2">        
        <v-carousel :show-arrows="false" hide-delimiters v-model="selectedCarouselIndex" height="auto">
            <v-carousel-item
                v-for="(image, index) in getAllVariantImages(product.variants)"
                :key="index"
                :src="getImageSrc(image.imageSrc)"
                :aspect-ratio="3/2">
            </v-carousel-item>
        </v-carousel>      
        <v-card-item>
            <v-card-title>{{ product.product_title }}</v-card-title>
            <v-card-subtitle>From ${{ getLowestPrice(product.variants) }}</v-card-subtitle>
        </v-card-item>
        <v-card-subtitle>Choose from:</v-card-subtitle>
        <v-card-text>
            <v-chip-group>
                <v-chip size="x-large" v-for="variant in product.variants" 
                    :key="variant.variant_id" 
                    @click="selectVariant(variant)" 
                >{{ variant.variant_name }}</v-chip>
            </v-chip-group>
        </v-card-text>
        <v-card-actions>
            <v-btn @click="productRedirect">Shop Now</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>

export default {
    props: {
        product: {
            type: Object,
            required: true
        }
    },
    methods: {
        getLowestPrice(variants) {
            if (!variants || variants.length === 0) {
                return null
            }
            return Math.min(...variants.map(variant => variant.variant_price));
        },
        getImageSrc(src) {
            return `/assets/product-images${src}`;

        },
        getAllVariantImages(variants) {
            return variants.map(variant => {
                const imageSrc = variant.variant_image_src && variant.variant_image_src.length > 0
                    ? variant.variant_image_src[0]
                    : '/fallback.webp';
                return {
                    variantId: variant.variant_id,
                    imageSrc: imageSrc,
                }
            })
        },

        selectVariant(variant) {
            const index = this.product.variants.findIndex(v => v.variant_id === variant.variant_id);
            this.selectedCarouselIndex = index;
            console.log(this.selectedCarouselIndex) 
        },
        productRedirect() {
            this.$router.push(`/products/${this.product.product_id}`)
        }
    },
    data() {
        return {
            selectedCarouselIndex: 0
        }
    },
}
</script>