<template>
  <div class="home">
    <!-- Hero Jumbotron Section -->
    <section class="hero-jumbotron">
      <div class="hero-overlay">
        <div class="container">
          <div class="hero-content">
            <h1 class="hero-title">ZIFA Portal</h1>
            <p class="hero-subtitle">For Players, Coaches & Referees</p>
            <p class="hero-description">
              Official database for tracking and managing football players, coaches, and referees across Zimbabwe. 
              Clubs can register members, national team staff can scout talent, and administrators can manage eligibility and compliance.
            </p>
            <div class="hero-btns">
              <button class="btn btn-primary" @click="goToRegistration">
                <span class="hover-underline-animation">Get Started</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="10" viewBox="0 0 46 16">
                  <path d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z" transform="translate(30)"></path>
                </svg>
              </button>
              <button class="btn btn-secondary" @click="goToPlayers">
                <span class="hover-underline-animation">Learn More</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="10" viewBox="0 0 46 16">
                  <path d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z" transform="translate(30)"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div class="scroll-indicator" @click="scrollToContent">
          <i class="fas fa-chevron-down"></i>
        </div>
      </div>
    </section>

    <!-- Admin Section Preview -->
    <section class="admin-section">
      <div class="container">
        <h2 class="section-title">Registration Portal</h2>
        <div class="admin-grid">
          <div class="admin-card">
            <i class="fas fa-user-plus"></i>
            <h3>Register Player</h3>
            <p>Add new players to the ZIFA database. Upload contracts, documents, and assign player IDs.</p>
            <button class="btn btn-secondary action-btn" @click="goToRegistration">
              <span class="hover-underline-animation">Register Player</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="10" viewBox="0 0 46 16">
                <path d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z" transform="translate(30)"></path>
              </svg>
            </button>
          </div>
          
          <div class="admin-card">
            <i class="fas fa-user-tie"></i>
            <h3>Register Coach</h3>
            <p>Register coaches with their license levels, experience, and certifications.</p>
            <button class="btn btn-secondary action-btn" @click="goToRegistration">
              <span class="hover-underline-animation">Register Coach</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="10" viewBox="0 0 46 16">
                <path d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z" transform="translate(30)"></path>
              </svg>
            </button>
          </div>
          
          <div class="admin-card">
            <i class="fas fa-whistle"></i>
            <h3>Register Referee</h3>
            <p>Register referees with their license levels, experience, and availability status.</p>
            <button class="btn btn-secondary action-btn" @click="goToRegistration">
              <span class="hover-underline-animation">Register Referee</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="10" viewBox="0 0 46 16">
                <path d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z" transform="translate(30)"></path>
              </svg>
            </button>
          </div>
          
          <div class="admin-card">
            <i class="fas fa-chart-bar"></i>
            <h3>View Statistics</h3>
            <p>Access player statistics, availability, and performance metrics.</p>
            <button class="btn btn-secondary action-btn" @click="goToDashboard">
              <span class="hover-underline-animation">View Dashboard</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="10" viewBox="0 0 46 16">
                <path d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z" transform="translate(30)"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const goToPlayers = () => {
  router.push('/players')
}

const goToRegistration = () => {
  router.push('/registration')
}

const goToDashboard = () => {
  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  } else {
    showLogin()
  }
}

const showLogin = () => {
  window.dispatchEvent(new CustomEvent('show-login-modal'))
}

const scrollToContent = () => {
  const adminSection = document.querySelector('.admin-section')
  if (adminSection) {
    adminSection.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
.hero-jumbotron {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 600px;
  background-image: url('https://images.unsplash.com/photo-1556056504-5c7696c4c28d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(30, 126, 52, 0.75) 0%,
    rgba(21, 87, 36, 0.7) 50%,
    rgba(0, 0, 0, 0.6) 100%
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.hero-content {
  text-align: center;
  color: var(--white);
  max-width: 900px;
  padding: 2rem;
  animation: fadeInUp 1s ease-out;
  position: relative;
  z-index: 1;
}

.hero-title {
  font-family: 'Poppins', sans-serif;
  font-size: clamp(32px, 5vw, 56px);
  font-weight: normal;
  font-style: italic;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  text-shadow: 2px 4px 8px rgba(0, 0, 0, 0.5);
  color: var(--white);
}

.hero-subtitle {
  font-family: 'Poppins', sans-serif;
  font-size: clamp(20px, 3vw, 32px);
  font-weight: 800;
  font-style: italic;
  text-transform: uppercase;
  letter-spacing: -0.01em;
  margin-bottom: 1.5rem;
  color: var(--gold);
  text-shadow: 1px 2px 4px rgba(0, 0, 0, 0.5);
  line-height: 1.2;
}

.hero-description {
  font-family: 'Inter', sans-serif;
  font-size: clamp(16px, 2vw, 20px);
  font-weight: 400;
  margin-bottom: 2.5rem;
  line-height: 1.65;
  color: var(--text-light);
  letter-spacing: 0.01em;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  opacity: 0.95;
}

.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--white);
  font-size: 2rem;
  cursor: pointer;
  animation: bounce 2s infinite;
  transition: all 0.3s ease;
  z-index: 10;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.scroll-indicator:hover {
  background: rgba(255, 215, 0, 0.2);
  border-color: var(--gold);
  color: var(--gold);
  transform: translateX(-50%) scale(1.1);
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  40% {
    transform: translateX(-50%) translateY(-10px);
  }
  60% {
    transform: translateX(-50%) translateY(-5px);
  }
}

.hero-btns {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
}

.hero-btns .btn-primary,
.hero-btns .btn-secondary {
  color: white;
}

.hero-btns .btn-primary .hover-underline-animation:after,
.hero-btns .btn-secondary .hover-underline-animation:after {
  background: linear-gradient(90deg, white 0%, rgba(255, 255, 255, 0.8) 100%);
}

.hero-btns .btn-primary svg path,
.hero-btns .btn-secondary svg path {
  fill: white;
}

.admin-section {
  background: var(--light-gray);
  padding: 80px 0;
  position: relative;
}

.section-title {
  font-family: 'Poppins', sans-serif;
  text-align: center;
  margin-bottom: 48px;
  color: #1a2b4f;
  font-size: clamp(28px, 4vw, 48px);
  font-weight: normal;
  font-style: italic;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 1.1;
  position: relative;
  display: inline-block;
  width: 100%;
}

.section-title::after {
  content: '';
  position: absolute;
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-green) 0%, var(--gold) 100%);
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 2px;
}

.admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 60px;
}

.admin-card {
  background: var(--white);
  border-radius: var(--border-radius);
  padding: 32px 24px;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  position: relative;
  overflow: hidden;
  box-shadow: var(--card-shadow);
}

.admin-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--card-shadow-hover);
}

.admin-card i {
  font-size: 3rem;
  color: var(--primary-green);
  margin-bottom: 20px;
  display: block;
  transition: transform 0.3s ease;
}

.admin-card:hover i {
  transform: scale(1.1);
  color: var(--gold);
}

.admin-card h3 {
  font-family: 'Poppins', sans-serif;
  margin-bottom: 12px;
  color: #1a2b4f;
  font-size: clamp(20px, 3vw, 32px);
  font-weight: normal;
  font-style: italic;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.admin-card p {
  font-family: 'Inter', sans-serif;
  color: #4a5568;
  margin-bottom: 24px;
  line-height: 1.65;
  font-size: clamp(16px, 2vw, 18px);
  letter-spacing: 0.01em;
  font-weight: 400;
}

.action-btn {
  /* Inherits from .btn and .btn-secondary */
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 992px) {
  .hero-jumbotron {
    background-attachment: scroll;
  }
}

@media (max-width: 768px) {
  .hero-jumbotron {
    min-height: 500px;
  }

  .scroll-indicator {
    bottom: 30px;
    font-size: 1.5rem;
    width: 45px;
    height: 45px;
  }

  .hero-title {
    font-size: clamp(32px, 5vw, 40px);
    letter-spacing: -0.01em;
  }

  .hero-subtitle {
    font-size: clamp(18px, 3vw, 24px);
  }

  .hero-description {
    font-size: clamp(14px, 2vw, 18px);
  }
  
  .hero-btns {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
  
  .btn {
    width: 100%;
    max-width: 300px;
  }

  .section-title {
    font-size: 2rem;
  }

  .admin-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .hero-jumbotron {
    height: 450px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }

  .hero-description {
    font-size: 0.95rem;
  }
}
</style>
