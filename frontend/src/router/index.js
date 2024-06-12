import {createRouter, createWebHistory} from 'vue-router';
import SiteHome from '@/views/SiteHome.vue';
import ShopProducts from '@/views/ShopProducts.vue';
import CareInstructions from '@/views/CareInstructions.vue';
import CustomOrder from '@/views/CustomOrder.vue';
import ContactPage from '@/views/ContactPage.vue';
import AboutUs from '@/views/AboutUs.vue';
import ProductDetails from '@/views/ProductDetails.vue';

const routes = [
    {
        path: '/',
        name: 'home',
        component: SiteHome
    },
    {
        path: '/shop-all',
        name: 'products',
        component: ShopProducts
    },
    {
        path: '/care-instructions',
        name: 'care',
        component: CareInstructions
    },
    {
        path: '/custom-orders',
        name: 'custom',
        component: CustomOrder,
    },
    {
        path: '/contact-us',
        name: 'contact',
        component: ContactPage
    },
    {
        path: '/about-us',
        name: 'about',
        component: AboutUs
    },
    {
        path: '/products/:productId',
        name: 'productDetails',
        component: ProductDetails
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;