<template>    
    <v-container v-if="product">
        <DetailCard :product="product" />
    </v-container>
</template>

<script>
import axios from 'axios';
import {ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export default {
    setup() {
        const product = ref(null);
        const loading = ref(false);
        const error = ref(false);

        const route = useRoute();

        async function fetchProductDetails() {
            loading.value = true;
            const productId = route.params.productId
            try {
                const response = await axios.get(`/api/products/${productId}`);
                product.value = response.data;
                loading.value = false;
            } catch (error) {
                console.error(error);
                error.value = true;
                loading.value = false;
            }
        }

        onMounted(fetchProductDetails);

        return { product, loading, error };
    }
};
</script>

<style scoped>
</style>