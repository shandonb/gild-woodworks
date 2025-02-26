<template> 
    <v-card
        title="Refine Results">
        <v-expansion-panels accordion multiple>
            <v-expansion-panel title="Price Range">
                <v-expansion-panel-text>
                    <v-range-slider
                        v-model="searchStore.filters.priceRange"
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
                                    v-model="searchStore.filters.priceRange[0]"
                                    density="compact"
                                    type="number"
                                    label="Min Price"
                                    hide-details></v-text-field>
                            </v-col>
                            <v-col cols="1" v-if="$vuetify.display.xlAndUp">-</v-col>
                            <v-col cols="12" xl="5">
                                <v-text-field
                                    v-model="searchStore.filters.priceRange[1]"
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
                        v-for="category in searchStore.categories"
                        :key="category"
                        v-model="searchStore.filters.types"
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
                        v-for="material in searchStore.materials"
                        :key="material.value"
                        v-model="searchStore.filters.tags"
                        :label="material.label"
                        :value="`filter-material_${material.value}`"
                        density="compact"
                        class="filter-checkbox"
                    ></v-checkbox>
                </v-expansion-panel-text>
            </v-expansion-panel>
        </v-expansion-panels>
        <v-row class="justify-center">
          <v-btn @click="searchStore.resetFilters" class="my-8">Clear Filters</v-btn>
        </v-row>
    </v-card>
</template>

<script>
import { useSearchStore } from '@/stores/searchStore';

export default {
  data() {
    return {
      searchStore: useSearchStore(),
      grid: true
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
}
</script>