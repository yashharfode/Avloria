import { auth, googleProvider } from './firebase-config.js';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const googleSignInBtn = document.getElementById('googleSignInBtn');
const emailAuthForm = document.getElementById('emailAuthForm');
const signOutBtn = document.getElementById('signOutBtn');

googleSignInBtn.addEventListener('click', async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        alert(`Welcome ${result.user.displayName}`);
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Google Sign-In Error:', error);
        alert(error.message);
    }
});

emailAuthForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert('Account created successfully!');
        window.location.href = 'index.html';
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            try {
                await signInWithEmailAndPassword(auth, email, password);
                alert('Signed in successfully!');
                window.location.href = 'index.html';
            } catch (err) {
                console.error('Email Sign-In Error:', err);
                alert(err.message);
            }
        } else {
            console.error('Sign-Up Error:', error);
            alert(error.message);
        }
    }
});

signOutBtn.addEventListener('click', async () => {
    try {
        await signOut(auth);
        alert('Signed out successfully!');
    } catch (error) {
        console.error('Sign Out Error:', error);
    }
});

onAuthStateChanged(auth, user => {
    if (user) {
        googleSignInBtn.style.display = 'none';
        emailAuthForm.style.display = 'none';
        signOutBtn.style.display = 'block';
    } else {
        googleSignInBtn.style.display = 'block';
        emailAuthForm.style.display = 'block';
        signOutBtn.style.display = 'none';
    }
});



emailAuthForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert('Account created successfully!');
        window.location.href = 'index.html';
    } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
            try {
                await signInWithEmailAndPassword(auth, email, password);
                alert('Signed in successfully!');
                window.location.href = 'index.html';
            } catch (err) {
                if (err.code === 'auth/invalid-login-credentials') {
                    alert('This email is registered with another provider. Please sign in using Google.');
                } else {
                    console.error('Email Sign-In Error:', err);
                    alert(err.message);
                }
            }
        } else {
            console.error('Sign-Up Error:', error);
            alert(error.message);
        }
    }
});
