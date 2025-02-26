<template>
    <v-container>
        <v-row>
            <v-col>
                <h1>Newest Items:</h1>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-infinite-scroll direction="horizontal" mode="manual">
                    <template v-for="product in products" :key="product.id" :product="product" >
                        <ProductCard :product="product" />
                    </template>
                    <template #load-more>
                        <v-btn @click="storePageRedirect">See More</v-btn>
                    </template>
                </v-infinite-scroll>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios';
export default {
    async mounted() {
        await this.fetchProducts();
    },
    data() {
        return {
            products: [],
            currentPage: 1,
            itemsPerPage: 5,
            totalItems: 0,
            API_BASE: import.meta.env.VITE_API_BASE
        };
    },
    methods: {
        storePageRedirect() {
            this.$router.push('/shop-all')
        },
        async fetchProducts() {
            const params = new URLSearchParams({
                page: this.currentPage,
                itemsPerPage: this.itemsPerPage,
                
            })
            const response = await axios.get(`${this.API_BASE}/api/products?${params}`);
            const rawData = response.data.products;
            this.totalItems = response.data.totalProducts;

            const productsMap = new Map();
            rawData.forEach(row => {
                if (!productsMap.has(row.product_id)) {
                    productsMap.set(row.product_id, {
                        ...row,
                        variants: []
                    });
                }
                productsMap.get(row.product_id).variants.push({
                    variant_id: row.variant_id,
                    variant_name: row.variant_name,
                    variant_price: row.variant_price,
                    variant_image_src: row.variant_image_src
                });
            });

            this.products = Array.from(productsMap.values());
        },
        applyFilters(newFilters) {
            this.filters = { ...this.filters, ...newFilters };
            this.fetchProducts();
        }
    }
}
</script>