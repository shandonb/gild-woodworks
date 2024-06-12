/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  // Custom Color Theme
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#FAF0E6',
          background: '#FAF0E6',
          secondary: '#A0522D',
          accent: '#6B8E23',
          info: '#16141A'
        }
      }
    }
  }
})
