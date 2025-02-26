<template>
  <v-breadcrumbs :items="items"></v-breadcrumbs>
</template>

<script>
export default {
  computed: {
    items() {
      const routePath = this.$route.path;

      let breadcrumbItems = [
        {
          title: 'Home',
          disabled: routePath === '/',
          href: '/'
        }
      ];

      if (routePath !== '/') {
        breadcrumbItems.push({
          title: 'Products',
          disabled: routePath === '/shop-all',
          href: '/shop-all'
        });
      };

      if (routePath !== '/' && routePath !== '/shop-all') {
        breadcrumbItems.push({
          title: this.$route.meta.title,
          disabled: true,
          to: this.$route.path
        });
      };

      return breadcrumbItems
    }
  }
}
</script>