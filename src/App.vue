<template>
  <div id="app">
    <Header />
    <main>
      <router-view />
    </main>
    <Footer />
    <ScrollToTop />
    <LoginModal 
      :isOpen="showLoginModal" 
      @close="showLoginModal = false"
      @success="handleLoginSuccess"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'
import ScrollToTop from '@/components/common/ScrollToTop.vue'
import LoginModal from '@/components/common/LoginModal.vue'

const route = useRoute()
const showLoginModal = ref(false)

const handleShowLogin = () => {
  showLoginModal.value = true
}

const handleLoginSuccess = () => {
  showLoginModal.value = false
}

// Watch for login query parameter
watch(() => route.query.login, (newVal) => {
  if (newVal === 'true') {
    showLoginModal.value = true
  }
}, { immediate: true })

onMounted(() => {
  window.addEventListener('show-login-modal', handleShowLogin)
  // Check if login is requested via query
  if (route.query.login === 'true') {
    showLoginModal.value = true
  }
})

onUnmounted(() => {
  window.removeEventListener('show-login-modal', handleShowLogin)
})
</script>

<style>
/* Font Face Declaration for Kapra Neue Pro Regular Expanded */
@font-face {
  font-family: 'Kapra Neue Pro';
  src: url('/fonts/KapraNeuePro-RegularExpanded.woff2') format('woff2'),
       url('/fonts/KapraNeuePro-RegularExpanded.woff') format('woff'),
       url('/fonts/KapraNeuePro-RegularExpanded.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-stretch: expanded;
  font-display: swap;
}

/* Global CSS Variables - Modern Theme with Green & Gold Accents */
:root {
  --primary-green: #1E7E34;
  --dark-green: #155724;
  --darker-green: #0D4F1C;
  --light-green: #28A745;
  --green-light: #E8F5E9;
  --gold: #FFD700;
  --gold-dark: #D4AF37;
  --gold-light: #FFF9E6;
  --red-accent: #DC143C;
  --red-dark: #B71C1C;
  --white: #FFFFFF;
  --off-white: #F8F9FA;
  --light-gray: #F5F5F5;
  --medium-gray: #6C757D;
  --dark-gray: #343A40;
  --text-dark: #212529;
  --text-medium: #495057;
  --text-muted: #6C757D;
  --text-light: rgba(255, 255, 255, 0.9);
  --header-height: 80px;
  --border-radius: 16px;
  --card-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  --card-shadow-hover: 0 20px 40px rgba(30, 126, 52, 0.15);
}

/* Reset & Base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Kapra Neue Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  font-weight: normal;
  font-style: normal;
  font-stretch: expanded;
}

body {
  font-family: 'Kapra Neue Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  font-weight: normal;
  font-style: normal;
  font-stretch: expanded;
  background: var(--white);
  color: var(--text-dark);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  scroll-behavior: smooth;
}

a {
  text-decoration: none;
  color: inherit;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  padding-top: var(--header-height);
}

/* Utility Classes - Modern Button Style */
.btn {
  border: none;
  background: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  position: relative;
}

.btn span {
  padding-bottom: 7px;
  letter-spacing: 4px;
  font-size: 14px;
  padding-right: 15px;
  text-transform: uppercase;
  position: relative;
  transition: all 0.3s ease;
}

.btn svg {
  transform: translateX(-8px);
  transition: all 0.3s ease;
  width: 30px;
  height: 10px;
}

.btn:hover svg {
  transform: translateX(0);
}

.btn:active svg {
  transform: scale(0.9);
}

.btn .hover-underline-animation {
  position: relative;
  padding-bottom: 20px;
}

.btn .hover-underline-animation:after {
  content: "";
  position: absolute;
  width: 100%;
  transform: scaleX(0);
  height: 2px;
  bottom: 0;
  left: 0;
  transform-origin: bottom right;
  transition: transform 0.25s ease-out;
}

.btn:hover .hover-underline-animation:after {
  transform: scaleX(1);
  transform-origin: bottom left;
}

.btn-primary {
  color: var(--darker-green);
}

.btn-primary .hover-underline-animation:after {
  background: linear-gradient(90deg, var(--gold) 0%, var(--gold-dark) 100%);
}

.btn-primary svg path {
  fill: var(--darker-green);
}

.btn-secondary {
  color: var(--primary-green);
}

.btn-secondary .hover-underline-animation:after {
  background: linear-gradient(90deg, var(--primary-green) 0%, var(--gold) 100%);
}

.btn-secondary svg path {
  fill: var(--primary-green);
}

/* Modern Animations */
.fade-in {
  animation: fadeIn 0.8s ease-in;
}

@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-8px);
  box-shadow: var(--card-shadow-hover);
}

/* Section Titles */
.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 16px;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-green) 0%, var(--gold) 100%);
  bottom: -12px;
  left: 0;
  border-radius: 2px;
}

.section-title-centered {
  text-align: center;
}

.section-title-centered::after {
  left: 50%;
  transform: translateX(-50%);
}

/* Responsive */
@media (max-width: 992px) {
  .container {
    padding: 0 20px;
  }
  
  .section-title {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }
  
  .section-title {
    font-size: 1.75rem;
  }
}
</style>
