<template>
  <header class="header" :class="{ 'header-hidden': isHidden, 'header-visible': !isHidden, 'nav-scrolled': isScrolled }">
    <div class="container header-container">
      <router-link to="/" class="logo">
        <img src="/images/zifa-full-crest.png" alt="ZIFA Logo" class="logo-image" />
        <div class="logo-text">ZIFA PORTAL</div>
      </router-link>
      
      <div class="mobile-menu-btn" @click="toggleMobileMenu">
        <i class="fas" :class="mobileMenuOpen ? 'fa-times' : 'fa-bars'"></i>
      </div>
      
      <ul class="nav-menu" :class="{ active: mobileMenuOpen }">
        <li class="nav-item">
          <router-link to="/" class="nav-link" @click="closeMobileMenu">
            <i class="fas fa-home"></i> Home
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/players" class="nav-link" @click="closeMobileMenu">
            <i class="fas fa-database"></i> Players
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/coaches" class="nav-link" @click="closeMobileMenu">
            <i class="fas fa-user-tie"></i> Coaches
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/referees" class="nav-link" @click="closeMobileMenu">
            <i class="fas fa-whistle"></i> Referees
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/registration" class="nav-link" @click="closeMobileMenu">
            <i class="fas fa-clipboard-list"></i> Registration
          </router-link>
        </li>
        <li class="nav-item" v-if="authStore.isAuthenticated">
          <router-link to="/dashboard" class="nav-link" @click="closeMobileMenu">
            <i class="fas fa-user"></i> Dashboard
          </router-link>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link" @click.prevent="showLoginModal">
            <i class="fas fa-sign-in-alt"></i> {{ authStore.isAuthenticated ? authStore.user.name : 'Login' }}
          </a>
        </li>
        <li class="nav-item" v-if="authStore.isAuthenticated">
          <a href="#" class="nav-link" @click.prevent="handleLogout">
            <i class="fas fa-sign-out-alt"></i> Logout
          </a>
        </li>
      </ul>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const mobileMenuOpen = ref(false)
const isHidden = ref(false)
const isScrolled = ref(false)
const lastScrollY = ref(0)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const showLoginModal = () => {
  if (!authStore.isAuthenticated) {
    // Emit event to show login modal
    window.dispatchEvent(new CustomEvent('show-login-modal'))
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/')
  closeMobileMenu()
}

const handleScroll = () => {
  const currentScrollY = window.scrollY
  
  // Update scrolled state for navbar styling
  isScrolled.value = currentScrollY > 50
  
  // Show header when scrolling up or at top
  if (currentScrollY < lastScrollY.value || currentScrollY < 100) {
    isHidden.value = false
  } 
  // Hide header when scrolling down past threshold
  else if (currentScrollY > lastScrollY.value && currentScrollY > 100) {
    isHidden.value = true
  }
  
  lastScrollY.value = currentScrollY
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border-bottom: 2px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
}

.nav-scrolled {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  border-bottom: 2px solid var(--gold);
}

.header-hidden {
  transform: translateY(-100%);
}

.header-visible {
  transform: translateY(0);
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: var(--header-height);
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.02);
}

.logo-image {
  height: 55px;
  width: auto;
  margin-right: 15px;
  object-fit: contain;
  filter: drop-shadow(0 2px 8px rgba(255, 215, 0, 0.3));
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-green);
  letter-spacing: 0.5px;
}

.nav-menu {
  display: flex;
  list-style: none;
  align-items: center;
}

.nav-item {
  margin-left: 30px;
}

.nav-link {
  color: var(--text-medium);
  font-weight: 500;
  font-size: 0.95rem;
  padding: 8px 12px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  text-decoration: none;
  position: relative;
  border-radius: 8px;
}

.nav-link:hover {
  color: var(--primary-green);
  background: rgba(30, 126, 52, 0.05);
}

.nav-link.router-link-active {
  color: var(--primary-green);
  background: rgba(30, 126, 52, 0.1);
  font-weight: 600;
}

.nav-link i {
  margin-right: 8px;
  font-size: 0.9rem;
}


.mobile-menu-btn {
  display: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-dark);
  transition: transform 0.3s ease;
}

.mobile-menu-btn:hover {
  transform: scale(1.1);
}

@media (max-width: 992px) {
  .nav-menu {
    display: none;
    position: absolute;
    top: var(--header-height);
    left: 0;
    width: 100%;
    background: var(--white);
    flex-direction: column;
    padding: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    border-top: 3px solid var(--gold);
  }
  
  .nav-menu.active {
    display: flex;
  }
  
  .nav-item {
    margin: 15px 0;
    width: 100%;
  }

  .nav-link {
    width: 100%;
    padding: 12px 0;
  }
  
  .mobile-menu-btn {
    display: block;
  }
}
</style>
