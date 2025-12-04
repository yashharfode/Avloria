import { auth } from './firebase-config.js';
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const authLinks = document.getElementById('authLinks');
const signOutBtn = document.getElementById('signOutBtn');

onAuthStateChanged(auth, user => {
    if (user) {
        // Hide Sign In / Sign Up when logged in
        authLinks.style.display = 'none';
        signOutBtn.style.display = 'inline-block';
    } else {
        authLinks.style.display = 'flex';
        signOutBtn.style.display = 'none';
    }
});

signOutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
        alert('Signed out successfully!');
        window.location.reload();  // Refresh to reflect auth state
    } catch (error) {
        console.error('Sign Out Error:', error);
    }
});
