<template>
  <v-app>
    <v-container class="pa-0 ma-0 gy-0" fluid>
      <v-row no-gutters>
        <v-col cols="12">
          <SiteHeader />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12">
          <BreadCrumbs />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col cols="12">
          <router-view></router-view>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <!-- Eventual Footer Area -->
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
  //
</script>

<style>
html {
  background-color: rgb(var(--v-theme-background));
}

a {
  text-decoration: none;
  font-weight: 500;
  transition: color 0.5s;
  color: rgb(var(--v-theme-info));
}

a:visited {
  color: rgb(var(--v-theme-info));
  transition: color 0.5s;
}

a:hover, a:active {
  color: rgb(var(--v-theme-accent));
  transition: color 0.5s;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Cormorant Garamond';
}

p {
  font-family: 'Raleway';
}
</style>