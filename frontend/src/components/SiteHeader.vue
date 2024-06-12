<template>
    <v-container class="pa-0 ma-0" fluid>
        <v-expand-transition>
            <v-row no-gutters v-if="showAnnouncement">
                <v-col>
                    <v-toolbar color="secondary" density="compact">
                        <v-spacer></v-spacer>
                        <router-link :to="{ name: 'products' }" style="color: rgb(var(--v-theme-background)); font-size: 0.75rem; text-align: center;"><span>New items available! | Limited time offer on custom orders! | Free local pickup</span></router-link>
                        <v-spacer></v-spacer>
                        
                    </v-toolbar>
                </v-col>
            </v-row>
        </v-expand-transition>
        <v-row no-gutters>
            <v-col>
                <v-toolbar color="primary" :elevation="2" class="py-2">
                    <v-container fluid>
                        <v-row no-gutters justify="space-between">
                            <v-col cols="auto" class="d-flex align-center">
                                <v-img src="/assets/logo.svg" aspect-ratio="1/1" width="60" contain></v-img>
                                <h1 class="mx-2" v-if="$vuetify.display.smAndUp">Gild Woodworks</h1>
                                <h2 class="mx-2" v-if="$vuetify.display.xs">Gild Woodworks</h2>
                            </v-col>
                            <v-col cols="auto" class="d-flex align-center nav-items" v-if="$vuetify.display.mdAndUp">
                                <router-link :to="{ name: 'home' }"><span class="mx-2">Home</span></router-link>
                                <router-link :to="{ name: 'products' }"><span class="mx-2">Store</span></router-link>
                                <router-link :to="{ name: 'custom' }"><span class="mx-2">Custom Orders</span></router-link>
                                <router-link :to="{ name: 'care' }"><span class="mx-2">Product Care</span></router-link>
                                <router-link :to="{ name: 'about' }"><span class="mx-2">About Us</span></router-link>
                                <router-link :to="{ name: 'contact' }"><span class="mx-2">Contact Us</span> </router-link>
                                <CartIcon />
                            </v-col>
                            <v-col cols="auto" class="d-flex align-center" v-if="$vuetify.display.smAndDown">
                                <v-btn icon @click.stop="drawer = !drawer">
                                    <v-icon>mdi-menu</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-toolbar>
            </v-col>
        </v-row>
  </v-container>
  <v-navigation-drawer v-model="drawer" temporary location="right">
        <v-list-item v-for="link in links" :key="link.text">
            <router-link :to="{ name: link.destination }">
                <v-list-item-title class="nav-items">{{ link.text }}</v-list-item-title>
            </router-link>
        </v-list-item>
    </v-navigation-drawer>
</template>
<script>
export default {
    data() {
        return {
            showAnnouncement: true,
            drawer: false,
            links: [
                {text: 'Home', destination: 'home'},
                {text: 'Store', destination: 'products'},
                {text: 'Custom Orders', destination: 'custom'},
                {text: 'Product Care', destination: 'care'},
                {text: 'About Us', destination: 'about'},
                {text: 'Contact Us', destination: 'contact'},
            ]
        };

    },
    methods: {
        hideAnnouncement() {
            this.showAnnouncement = false;
        }
    }
};
</script>

<style scoped>
    a {
        font-family: 'Raleway';
        text-transform: uppercase;
    }
</style>