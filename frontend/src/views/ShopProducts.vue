<template>
    <v-container fluid class="pa-12">
        <v-row v-if="$vuetify.display.mdAndDown">
            <v-col>
                <v-container class="mx-auto my-0" fluid>
                    <v-row align="end">
                        <v-col>
                            <v-btn>
                                <v-icon>mdi-filter</v-icon>
                                <template v-if="$vuetify.display.smAndUp">Filters</template>
                            </v-btn>
                        </v-col>
                        <v-col>
                            <v-select
                                v-model="itemsPerPage"
                                :items="[8,12,24,48]"
                                hide-details
                                label="Items Per Page"
                            ></v-select>
                        </v-col>
                        <v-col>
                            <v-btn-toggle
                                v-model="viewMode"
                                divided
                            >
                                <v-btn icon="mdi-view-grid"></v-btn>
                                <v-btn icon="mdi-view-list"></v-btn>
                            </v-btn-toggle>
                        </v-col>
                    </v-row>
                </v-container>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="2" v-if="$vuetify.display.lgAndUp">
                <v-card
                    title="Refine Results">
                    <v-expansion-panels accordion multiple>
                        <v-expansion-panel title="Price Range">
                            <v-expansion-panel-text>
                                <v-range-slider
                                    v-model="filters.priceRange"
                                    :min="0"
                                    :max="2600"
                                    :step="100"
                                    v-if="$vuetify.display.xlAndUp"
                                >
                                </v-range-slider>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" xl="5">
                                            <v-text-field
                                                v-model="filters.priceRange[0]"
                                                density="compact"
                                                type="number"
                                                label="Min Price"
                                                hide-details></v-text-field>
                                        </v-col>
                                        <v-col cols="1" v-if="$vuetify.display.xlAndUp">-</v-col>
                                        <v-col cols="12" xl="5">
                                            <v-text-field
                                                v-model="filters.priceRange[1]"
                                                density="compact"
                                                type="number"
                                                label="Max Price"
                                                hide-details></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                        <v-expansion-panel title="Product Type">
                            <v-expansion-panel-text>
                                <v-checkbox
                                    v-for="category in categories"
                                    :key="category"
                                    v-model="filters.types"
                                    :label="category"
                                    :value="category"
                                    density="compact"
                                    class="filter-checkbox"
                                ></v-checkbox>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                        <v-expansion-panel title="Materials">
                            <v-expansion-panel-text>
                                <v-checkbox
                                    v-for="material in materials"
                                    :key="material.value"
                                    v-model="filters.tags"
                                    :label="material.label"
                                    :value="`filter-material_${material.value}`"
                                    density="compact"
                                    class="filter-checkbox"
                                ></v-checkbox>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-card>
            </v-col>
            <v-col>
                <v-container class="mx-auto" fluid v-if="this.totalItems > 0">
                    <v-row>
                        <v-col v-for="(product, index) in products" :key="index" cols="12" md="6" lg="6" xl="3">
                            <ProductCard :product="product" class="mx-auto"/>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-pagination v-model="currentPage" :length="Math.ceil(totalItems / itemsPerPage)" @update:model-value="fetchProducts"></v-pagination>
                        </v-col>
                    </v-row>
                </v-container>
                <v-container class="mx-auto" fluid v-else>
                    <v-alert 
                        title="No Matching Products" 
                        text="No products were found matching your filter parameters. Please try a different combination."
                        color="warning"
                        ></v-alert>
                </v-container>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios';
export default {
    async mounted() {
        await this.fetchProducts();
        await this.fetchMaterials();
        await this.fetchCategories();
    },

    data() {
        return {
            products: [],
            currentPage: 1,
            itemsPerPage: 24,
            totalItems: 0,
            filters: {
                priceRange: [0, 2600],
                tags: [],
                types: [],
            },
            materials: [],
            categories: [],
        };
    },

    watch: {
        'filters.priceRange': {
            deep: true,
            handler() {
                this.fetchProducts();
            }
        },
        'filters.tags': {
            deep: true,
            handler() {
                this.fetchProducts();
            }
        },
        'filters.types': {
            deep: true,
            handler() {
                this.fetchProducts();
            }
        },
        'itemsPerPage': {
            deep: true,
            handler() {
                this.fetchProducts();
            }
        }
    },

    methods: {
        async fetchProducts() {
            const params = new URLSearchParams({
                page: this.currentPage,
                itemsPerPage: this.itemsPerPage,
                priceRange: this.filters.priceRange,
                tags: this.filters.tags,
                types: this.filters.types,
            })
            const response = await axios.get(`/api/products?${params}`);
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
        },
        async fetchMaterials() {
            const response = await axios.get('/api/filter-materials');
            this.materials = response.data;
        }, async fetchCategories() {
            const response = await axios.get('/api/filter-categories');
            this.categories = response.data;
        }
    }
    
}
</script>

<style scoped>
:deep(.v-label) {
    font-size: 0.8rem;
}
</style>