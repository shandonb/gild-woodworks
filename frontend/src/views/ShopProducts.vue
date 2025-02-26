<template>
    <v-container fluid class="pa-12">
        <v-row v-if="$vuetify.display.mdAndDown">
            <v-col>
                <v-container class="mx-auto my-0" fluid>
                    <v-row align="end">
                        <v-col>
                            <v-btn @click="openFilters = true">
                                <v-icon>mdi-filter</v-icon>
                                <template v-if="$vuetify.display.smAndUp" >Filters</template>
                            </v-btn>
                        </v-col>
                        <v-col>
                            <v-select
                                v-model="searchStore.itemsPerPage"
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
                                <v-btn icon="mdi-view-grid" @click="grid = true"></v-btn>
                                <v-btn icon="mdi-view-list" @click="grid = false"></v-btn>
                            </v-btn-toggle>
                        </v-col>
                    </v-row>
                </v-container>
            </v-col>
        </v-row>
        <v-row>
          <v-col cols="2" v-if="$vuetify.display.lgAndUp">
            <SearchFilters />
          </v-col>
          <v-navigation-drawer v-else v-model="openFilters">
            <SearchFilters />
          </v-navigation-drawer>
            <v-col>
                <v-container class="mx-auto" fluid v-if="searchStore.totalItems > 0">
                    <v-row>
                        <v-col v-for="(product, index) in searchStore.products" :key="index" cols="12" md="6" lg="6" xl="3">
                          <router-link v-if="grid" :to="`/products/${product.product_id}`"><ProductCard :product="product" class="mx-auto"/></router-link>
                          <router-link v-else :to="`/products/${product.product_id}`"><DetailList :product="product" class="mx-auto" /></router-link>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-pagination v-model="searchStore.currentPage" :length="Math.ceil(searchStore.totalItems / searchStore.itemsPerPage)" @update:model-value="searchStore.fetchProducts"></v-pagination>
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
import { useSearchStore } from '@/stores/searchStore';

export default {
  data() {
    return {
      searchStore: useSearchStore(),
      grid: true,
      openFilters: false
    }
  },
  watch: {
    "searchStore.filters.priceRange": {
      handler(newValue, oldValue) {
        if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
          console.log("Price range changed:", newValue);
          this.searchStore.fetchProducts();
        }
      },
      deep: true
    },
    "searchStore.filters.tags": {
      handler(newValue, oldValue) {
        if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
          console.log("Tags changed:", newValue);
          this.searchStore.fetchProducts();
        }
      },
      deep: true
    },
    "searchStore.filters.types": {
      handler(newValue, oldValue) {
        if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
          console.log("Types changed:", newValue);
          this.searchStore.fetchProducts();
        }
      },
      deep: true
    }
  },

  mounted() {
    this.searchStore.fetchCategories();
    this.searchStore.fetchMaterials();
    this.searchStore.fetchProducts();
  }
};
</script>

<style scoped>
:deep(.v-label) {
    font-size: 0.8rem;
}
</style>