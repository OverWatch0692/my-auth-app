<template>
    <div class="monitoring-dashboard">
      <h2>Honeypot Monitoring Dashboard</h2>
      
      <div class="stats-container">
        <div class="stat-card">
          <h3>Login Attempts</h3>
          <div class="stat-value">{{ stats.loginAttempts }}</div>
        </div>
        
        <div class="stat-card">
          <h3>Attack Attempts</h3>
          <div class="stat-value alert">{{ stats.attackAttempts }}</div>
        </div>
        
        <div class="stat-card">
          <h3>SQL Injection Attempts</h3>
          <div class="stat-value alert">{{ stats.sqliAttempts }}</div>
        </div>
        
        <div class="stat-card">
          <h3>XSS Attempts</h3>
          <div class="stat-value alert">{{ stats.xssAttempts }}</div>
        </div>
      </div>
      
      <div class="recent-events">
        <h3>Recent Security Events</h3>
        <div v-if="events.length === 0" class="no-events">
          No events recorded yet.
        </div>
        <div v-else class="events-list">
          <div v-for="(event, index) in events" :key="index" class="event-item">
            <div class="event-time">{{ formatTime(event.timestamp) }}</div>
            <div class="event-type" :class="{ alert: isAttackEvent(event.event) }">
              {{ event.event }}
            </div>
            <div class="event-details">
              <pre>{{ JSON.stringify(event.payload, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import { inject } from 'vue';
  
  const authService = inject('auth');
  const events = ref([]);
  const stats = ref({
    loginAttempts: 0,
    attackAttempts: 0,
    sqliAttempts: 0,
    xssAttempts: 0
  });
  
  // In a real app, you would fetch these from CloudWatch
  // For demo purposes, we'll simulate events
  const simulateEvents = () => {
    // This would be replaced with actual CloudWatch log fetching
    // For honeypot demo purposes only
    
    stats.value.loginAttempts = Math.floor(Math.random() * 20) + 10;
    stats.value.attackAttempts = Math.floor(Math.random() * 10);
    stats.value.sqliAttempts = Math.floor(Math.random() * 5);
    stats.value.xssAttempts = Math.floor(Math.random() * 5);
    
    const sampleEvents = [
      {
        event: 'LOGIN',
        timestamp: new Date(Date.now() - 25000).toISOString(),
        payload: {
          username: 'user123',
          success: true
        }
      },
      {
        event: 'SQL_INJECTION_ATTEMPT',
        timestamp: new Date(Date.now() - 120000).toISOString(),
        payload: {
          input: "' OR 1=1; --",
          target: 'login_username'
        }
      },
      {
        event: 'XSS_ATTEMPT',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        payload: {
          input: "<script>alert('XSS')</script>",
          target: 'signup_email'
        }
      }
    ];
    
    events.value = sampleEvents;
  };
  
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString();
  };
  
  const isAttackEvent = (eventType) => {
    return eventType.includes('ATTEMPT') || eventType.includes('ATTACK');
  };
  
  // Simulated monitoring data refresh
  let refreshInterval;
  onMounted(() => {
    simulateEvents();
    refreshInterval = setInterval(simulateEvents, 30000);
  });
  
  onUnmounted(() => {
    clearInterval(refreshInterval);
  });

    
  
  <style scoped>
  .monitoring-dashboard {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .stats-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
    margin-bottom: 30px;
  }
  
  .stat-card {
    background-color: #f5f5f5;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
  
  .stat-value {
    font-size: 2rem;
    font-weight: bold;
  }
  
  .alert {
    color: #d32f2f;
  }
  
  .events-list {
    border: 1px solid #ddd;
    border-radius: 8px;
    max-height: 400px;
    overflow-y: auto;
  }
  
  .event-item {
    padding: 15px;
    border-bottom: 1px solid #eee;
  }
  
  .event-item:last-child {
    border-bottom: none;
  }
  
  .event-time {
    font-size: 0.8rem;
    color: #666;
  }
  
  .event-type {
    font-weight: bold;
    margin: 5px 0;
  }
  
  .event-details {
    background-color: #f9f9f9;
    padding: 10px;
    border-radius: 4px;
    overflow-x: auto;
  }
  
  .no-events {
    padding: 20px;
    color: #666;
    text-align: center;
  }
  </style>
  