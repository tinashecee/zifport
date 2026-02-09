<template>
  <div class="modal" v-if="isOpen" @click.self="close">
    <div class="modal-content">
      <span class="close-modal" @click="close">&times;</span>
      <div class="modal-header">
        <h2>{{ isLoginMode ? 'Login' : 'Register' }}</h2>
        <p>{{ isLoginMode ? 'Access your account' : 'Create a new account' }}</p>
      </div>
      
      <form class="modal-form" @submit.prevent="handleSubmit">
        <div v-if="!isLoginMode" class="form-group">
          <label class="form-label" for="registerName">Full Name</label>
          <input 
            type="text" 
            id="registerName" 
            class="form-input" 
            v-model="registerForm.name"
            placeholder="Enter your full name" 
            required
          >
        </div>

        <div class="form-group">
          <label class="form-label" for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            class="form-input" 
            v-model="email"
            placeholder="Enter your email" 
            required
          >
        </div>
        
        <div class="form-group">
          <label class="form-label" for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            class="form-input" 
            v-model="password"
            placeholder="Enter your password" 
            required
            :minlength="isLoginMode ? 0 : 6"
          >
        </div>
        
        <div v-if="!isLoginMode" class="form-group">
          <label class="form-label" for="role">Role</label>
          <select id="role" class="form-select" v-model="registerForm.role" required>
            <option value="">Select your role</option>
            <option value="user">User</option>
            <option value="club">Club Administrator</option>
            <option value="admin">Administrator</option>
          </select>
        </div>
        
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        
        <div class="modal-btns">
          <button type="submit" class="btn btn-primary" style="flex: 1;" :disabled="submitting">
            <span class="hover-underline-animation">{{ submitting ? 'Please wait...' : (isLoginMode ? 'Login' : 'Register') }}</span>
            <svg v-if="!submitting" xmlns="http://www.w3.org/2000/svg" width="30" height="10" viewBox="0 0 46 16">
              <path d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z" transform="translate(30)"></path>
            </svg>
          </button>
          <button type="button" class="btn btn-secondary" style="flex: 1;" @click="close" :disabled="submitting">
            <span class="hover-underline-animation">Cancel</span>
            <svg v-if="!submitting" xmlns="http://www.w3.org/2000/svg" width="30" height="10" viewBox="0 0 46 16">
              <path d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z" transform="translate(30)"></path>
            </svg>
          </button>
        </div>

        <div class="toggle-mode">
          <a href="#" @click.prevent="toggleMode">
            {{ isLoginMode ? 'Need an account? Register here' : 'Already have an account? Login here' }}
          </a>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'success'])

const authStore = useAuthStore()
const router = useRouter()

const isLoginMode = ref(true)
const error = ref('')
const submitting = ref(false)

const form = reactive({
  email: '',
  password: ''
})

const registerForm = reactive({
  name: '',
  email: '',
  password: '',
  role: ''
})

// Computed properties for email and password to handle both login and registration modes
const email = computed({
  get: () => isLoginMode.value ? form.email : registerForm.email,
  set: (value) => {
    if (isLoginMode.value) {
      form.email = value
    } else {
      registerForm.email = value
    }
  }
})

const password = computed({
  get: () => isLoginMode.value ? form.password : registerForm.password,
  set: (value) => {
    if (isLoginMode.value) {
      form.password = value
    } else {
      registerForm.password = value
    }
  }
})

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    error.value = ''
    form.email = ''
    form.password = ''
    registerForm.name = ''
    registerForm.email = ''
    registerForm.password = ''
    registerForm.role = ''
  }
})

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value
  error.value = ''
}

const handleSubmit = async () => {
  error.value = ''
  submitting.value = true

  try {
    if (isLoginMode.value) {
      const result = await authStore.login(form.email, form.password)
      if (result.success) {
        emit('success')
        close()
        // Redirect to intended route or dashboard
        const redirect = router.currentRoute.value.query.redirect || '/dashboard'
        router.push(redirect)
      } else {
        error.value = result.error
      }
    } else {
      // Validate form before submission
      if (!registerForm.name || !registerForm.email || !registerForm.password || !registerForm.role) {
        error.value = 'Please fill in all fields'
        submitting.value = false
        return
      }

      const result = await authStore.register({
        name: registerForm.name.trim(),
        email: registerForm.email.trim(),
        password: registerForm.password,
        role: registerForm.role
      })
      if (result.success) {
        emit('success')
        close()
        // Redirect to intended route or dashboard
        const redirect = router.currentRoute.value.query.redirect || '/dashboard'
        router.push(redirect)
      } else {
        error.value = result.error
      }
    }
  } catch (err) {
    if (err.message.includes('Cannot connect to server')) {
      error.value = 'Backend server is not running. Please start the backend server first. See QUICK_START.md for instructions.'
    } else {
      error.value = err.message || 'An error occurred'
    }
  } finally {
    submitting.value = false
  }
}

const close = () => {
  emit('close')
}
</script>

<style scoped>
.modal {
  position: fixed;
  z-index: 2000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background-color: white;
  padding: 40px;
  border-radius: var(--border-radius);
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  position: relative;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  margin-bottom: 30px;
  text-align: center;
}

.modal-header h2 {
  color: var(--text-dark);
  font-size: 2rem;
  font-weight: 700;
}

.modal-form .form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--dark-gray);
}

.form-input,
.form-select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
}

.form-input:focus,
.form-select:focus {
  border-color: var(--primary-green);
  outline: none;
  box-shadow: 0 0 0 3px rgba(30, 126, 52, 0.1);
}

.error-message {
  color: #dc3545;
  background-color: #fef2f2;
  padding: 12px 16px;
  border-radius: var(--border-radius);
  margin-bottom: 20px;
  font-size: 0.9rem;
  border: 1px solid #fecaca;
}

.modal-btns {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.toggle-mode {
  text-align: center;
  margin-top: 20px;
}

.toggle-mode a {
  color: var(--primary-green);
  text-decoration: none;
  font-weight: 600;
}

.toggle-mode a:hover {
  text-decoration: underline;
}

.close-modal {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--medium-gray);
  transition: all 0.3s ease;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-modal:hover {
  color: var(--text-dark);
  background: var(--light-gray);
  transform: rotate(90deg);
}
</style>
