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
        component: SiteHome,
        meta: {
          title: 'Home'
        }
    },
    {
        path: '/shop-all',
        name: 'products',
        component: ShopProducts,
        meta: {
          title: 'Products'
        }
    },
    {
        path: '/care-instructions',
        name: 'care',
        component: CareInstructions,
        meta: {
          title: 'Product Care'
        }
    },
    {
        path: '/custom-orders',
        name: 'custom',
        component: CustomOrder,
        meta: {
          title: 'Custom Orders'
        }
    },
    {
        path: '/contact-us',
        name: 'contact',
        component: ContactPage,
        meta: {
          title: 'Contact Us'
        }
    },
    {
        path: '/about-us',
        name: 'about',
        component: AboutUs,
        meta: {
          title: 'About Us'
        }
    },
    {
        path: '/products/:productId',
        name: 'productDetails',
        component: ProductDetails,
        meta: {
          title: 'Product Details'
        }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;