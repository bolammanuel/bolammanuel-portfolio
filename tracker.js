import { firebaseConfig } from './firebase-config.js';

// DOM Elements
const activeCountEl = document.getElementById('active-viewers-count');
const totalCountEl = document.getElementById('total-visitors-count');
const statusDotEl = document.getElementById('active-status-dot');
const trackerCardEl = document.getElementById('visitor-tracker-card');
const trackerToggleEl = document.getElementById('tracker-toggle');
const fallbackBadgeEl = document.getElementById('tracker-fallback-badge');

// Check if credentials are placeholders
const isConfigPlaceholder = 
  !firebaseConfig || 
  firebaseConfig.apiKey === 'YOUR_API_KEY' || 
  firebaseConfig.databaseURL === 'YOUR_DATABASE_URL';

// Generate session ID for local sessionStorage (helps avoid multiple counts from the same browser tab)
const sessionToken = sessionStorage.getItem('tracker_session_token') || Math.random().toString(36).substring(2, 15);
sessionStorage.setItem('tracker_session_token', sessionToken);

// Handle expand/collapse toggle
if (trackerToggleEl && trackerCardEl) {
  trackerToggleEl.addEventListener('click', () => {
    trackerCardEl.classList.toggle('collapsed');
    const isCollapsed = trackerCardEl.classList.contains('collapsed');
    localStorage.setItem('tracker_collapsed', isCollapsed);
    trackerToggleEl.setAttribute('aria-expanded', !isCollapsed);
  });

  // Restore collapsed state from user preference
  if (localStorage.getItem('tracker_collapsed') === 'true') {
    trackerCardEl.classList.add('collapsed');
    trackerToggleEl.setAttribute('aria-expanded', 'false');
  }
}

// Fallback logic (Simulation Mode)
function runSimulation() {
  if (fallbackBadgeEl) {
    fallbackBadgeEl.style.display = 'inline-block';
  }
  
  // Total Visits (saved in localStorage to accumulate local tests)
  let localViews = parseInt(localStorage.getItem('portfolio_local_views') || '0', 10);
  if (!sessionStorage.getItem('portfolio_local_visited')) {
    localViews += 1;
    localStorage.setItem('portfolio_local_views', localViews);
    sessionStorage.setItem('portfolio_local_visited', 'true');
  }
  if (totalCountEl) {
    totalCountEl.textContent = localViews.toLocaleString();
  }

  // Active Viewers (realistic micro-simulation)
  function updateSimulatedActive() {
    const currentHour = new Date().getHours();
    let min = 1;
    let max = 3;
    
    // Busy hours simulation (9:00 AM to 10:00 PM)
    if (currentHour >= 9 && currentHour <= 22) {
      min = 2;
      max = 6;
    }
    
    const simulatedCount = Math.floor(Math.random() * (max - min + 1)) + min;
    
    if (activeCountEl) {
      activeCountEl.textContent = simulatedCount;
    }
    if (statusDotEl) {
      statusDotEl.classList.add('online');
    }
  }

  updateSimulatedActive();
  
  // Randomly vary the active viewer count every 10 to 18 seconds
  setInterval(updateSimulatedActive, 10000 + Math.random() * 8000);
}

// Real Firebase initialization & logic
async function initFirebase() {
  try {
    if (isConfigPlaceholder) {
      console.log('Firebase config is using placeholder credentials. Running in simulated fallback mode.');
      runSimulation();
      return;
    }

    // Load Firebase modules dynamically from ES Modules CDN
    const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js");
    const { getDatabase, ref, onValue, push, onDisconnect, set, runTransaction } = await import("https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js");

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    // Hide fallback badge if running in real Firebase mode
    if (fallbackBadgeEl) {
      fallbackBadgeEl.style.display = 'none';
    }

    // --- 1. Real-time Active Viewers (Presence Management) ---
    const connectedRef = ref(db, ".info/connected");
    let myPresenceRef = null;

    onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        // Connected! Register our presence
        const presenceListRef = ref(db, "presence");
        myPresenceRef = push(presenceListRef);

        // Remove node when client disconnects (tab closes, reload, network loss)
        onDisconnect(myPresenceRef).remove().catch(err => {
          console.error("onDisconnect setup failed:", err);
        });

        // Set presence node value
        set(myPresenceRef, {
          timestamp: Date.now(),
          session: sessionToken
        }).catch(err => {
          console.error("Failed to write presence:", err);
        });
      }
    });

    // Listen to changes in the presence list to update live count
    const presenceRef = ref(db, "presence");
    onValue(presenceRef, (snapshot) => {
      const data = snapshot.val();
      const count = data ? Object.keys(data).length : 0;
      if (activeCountEl) {
        activeCountEl.textContent = count;
      }
      if (statusDotEl) {
        statusDotEl.classList.add('online');
      }
    }, (error) => {
      console.warn("Reading presence failed (using fallback rules):", error);
    });

    // --- 2. Total Visitors Counter (Transaction-Safe) ---
    const totalViewsRef = ref(db, "stats/totalViews");

    // Increment count if not yet visited in this session
    if (!sessionStorage.getItem('portfolio_visited_global')) {
      runTransaction(totalViewsRef, (currentValue) => {
        return (currentValue || 0) + 1;
      }).then((result) => {
        if (result.committed) {
          sessionStorage.setItem('portfolio_visited_global', 'true');
        }
      }).catch((err) => {
        console.warn("Transaction failed to increment views count:", err);
      });
    }

    // Listen to changes in total views to update UI
    onValue(totalViewsRef, (snapshot) => {
      const count = snapshot.val() || 0;
      if (totalCountEl) {
        totalCountEl.textContent = count.toLocaleString();
      }
    }, (error) => {
      console.warn("Reading total views failed:", error);
    });

  } catch (error) {
    console.error("Failed to connect to Firebase. Falling back to simulation.", error);
    runSimulation();
  }
}

// Start tracking immediately
initFirebase();
