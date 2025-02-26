import { defineStore } from "pinia";

export const useSearchStore = defineStore('search', {
  state: () => ({
    products: [],
    totalItems: 0,
    currentPage: 1,
    itemsPerPage: 24,
    filters: {
      priceRange: [0, 2600],
      tags: [],
      types: [],
    },
    materials: [],
    categories: []
  }),

  actions: {
    async fetchProducts() {
      this.products = [];
      try{
        const params = new URLSearchParams({
          page: this.currentPage,
          itemsPerPage: this.itemsPerPage,
          priceRange: this.filters.priceRange.join(","),
          tags: this.filters.tags.join(","),
          types: this.filters.types.join(","),
        });

        const response = await fetch(`/api/products?${params}`, {
          method: 'GET',
        });
        const data = await response.json();
        this.totalItems = data.totalProducts;

        const productsMap = new Map();
        data.products.forEach(row => {
          if(!productsMap.has(row.product_id)) {
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
      } catch(error) {
        console.error(`Failed to fetch products: ${error}`);
      }
    },

    async fetchMaterials() {
      try {
        const response = await fetch('/api/filter-materials');
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        this.materials = await response.json();
      } catch (error) {
        console.error(`Failed to fetch materials: ${error}`);
      }
    },

    async fetchCategories() {
      try {
        const response = await fetch('/api/filter-categories');
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        this.categories = await response.json();
      } catch (error) {
        console.error(`Failed to fetch categories: ${error}`);
      }
    },

    async updateFilters(newFilters) {
      let filtersChanged = false;

      Object.keys(newFilters).forEach((key) => {
        console.log(`Original: ${JSON.stringify(this.filters[key])}`);
        console.log(`New: ${JSON.stringify(newFilters[key])}`);
        if (JSON.stringify(this.filters[key]) !== JSON.stringify(newFilters[key])) {
          filtersChanged = true;
          console.log("filters changed correctly!")
          if (Array.isArray(newFilters[key])) {
            this.filters[key] = [...newFilters[key]];
          } else {
            this.filters[key] = newFilters[key];
          }
        } else {
          console.log("Filters didn't change")
        }
      })
      
      if (filtersChanged) {
        await this.fetchProducts();
      }
    },

    resetFilters() {
      this.filters = {
        priceRange: [0, 2600],
        tags: [],
        types: []
      };
      this.fetchProducts();
    }
  },

  persist: {
    storage: sessionStorage,
  }
});