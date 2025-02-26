<template>
  <v-card width="100%" :style="{ minWidth: '280px' }" class="px-4 pt-4 pb-1 mx-0 mb-2">
    <v-container>
      <v-row>
        <v-col cols="3">
          <v-carousel :show-arrows="false" hide-delimiters v-model="selectedCarouselIndex" height="auto">
            <v-carousel-item
              v-for="(image, index) in getAllVariantImages(product.variants)"
              :key="index"
              :src="getImageSrc(image.imageSrc)"
              :aspect-ratio="1"
              cover>
            </v-carousel-item>
          </v-carousel>
        </v-col>
        <v-col cols="6" class="d-flex align-center">
          <v-card-item>
            <v-card-title>{{ product.product_title }}</v-card-title>
            <v-card-subtitle v-if="product.variants.length > 1">Available in multiple styles</v-card-subtitle>
          </v-card-item>
        </v-col>
        <v-col cols="3">
          <v-card-item>
            <v-card-title>From ${{ getLowestPrice(product.variants) }}</v-card-title>
          </v-card-item>
          <v-card-actions>
            <v-btn @click="productRedirect">Shop Now</v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
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
   getLowestPrice(variants) {
    if(!variants || variants.length === 0) {
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
   },
   productRedirect() {
    this.$router.push(`/products/${this.product.product_id}`)
   }
  },
  data() {
    return {
      selectedCarouselIndex: 0
    }
  }
}
</script>