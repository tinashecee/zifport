<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-column">
          <h3>Zimbabwe Football Association</h3>
          <p>The official governing body for football in Zimbabwe. Managing player registration, national teams, and competitions.</p>
        </div>
        
        <div class="footer-column">
          <h3>Quick Links</h3>
          <ul class="footer-links">
            <li><router-link to="/registration">Player Registration Guide</router-link></li>
            <li><router-link to="/players">Player Database</router-link></li>
            <li><a href="#">Eligibility Regulations</a></li>
            <li><a href="#">Transfer Rules</a></li>
            <li><a href="#">Contact ZIFA</a></li>
          </ul>
        </div>
        
        <div class="footer-column">
          <h3>Systems</h3>
          <ul class="footer-links">
            <li><router-link to="/dashboard">User Dashboard</router-link></li>
            <li><router-link to="/players">Player Database</router-link></li>
            <li><router-link to="/registration">Registration Portal</router-link></li>
            <li><a href="#">Competition Management</a></li>
            <li><a href="#">Referee System</a></li>
          </ul>
        </div>
        
        <div class="footer-column">
          <h3>Contact</h3>
          <ul class="footer-links">
            <li><i class="fas fa-phone"></i> ZIFA Hotline: +263-4-XXX-XXXX</li>
            <li><i class="fas fa-envelope"></i> Email: registration@zifa.org.zw</li>
            <li><i class="fas fa-map-marker-alt"></i> Address: ZIFA House, Harare</li>
          </ul>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} Zimbabwe Football Association. All rights reserved. | Player Registration System v1.0</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.footer {
  background: var(--primary-green);
  color: var(--white);
  padding: 80px 0 30px;
  border-top: 3px solid var(--gold);
  margin-top: 100px;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 50px;
  margin-bottom: 50px;
}

.footer-column h3 {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 25px;
  color: var(--white);
  position: relative;
  padding-bottom: 15px;
  letter-spacing: 0.5px;
}

.footer-column h3::after {
  content: '';
  position: absolute;
  width: 50px;
  height: 4px;
  background: linear-gradient(90deg, var(--gold) 0%, var(--gold-dark) 100%);
  bottom: 0;
  left: 0;
  border-radius: 2px;
}

.footer-column p {
  color: var(--white);
  line-height: 1.7;
  font-size: 0.95rem;
  opacity: 0.9;
}

.footer-links {
  list-style: none;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-links a {
  color: var(--white);
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  font-size: 0.95rem;
  opacity: 0.9;
}

.footer-links a:hover {
  color: var(--gold);
  transform: translateX(5px);
}

.footer-links i {
  margin-right: 10px;
  color: var(--gold);
  width: 20px;
}

.footer-bottom {
  text-align: center;
  padding-top: 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--white);
  font-size: 0.9rem;
  opacity: 0.9;
}
</style>
