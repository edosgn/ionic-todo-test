/**
 * Environment configuration for production
 * This file contains the Firebase configuration for the production environment
 * 
 * Security Note: In a real production environment, these values should come from 
 * secure environment variables or a secure configuration service
 */
export const environment = {
  production: true,
  firebase: {
    apiKey: "AIzaSyCE9-0tePJWSqlqV71OflKMB-55YiyxFb0",
    authDomain: "ionic-test-1a876.firebaseapp.com", 
    projectId: "ionic-test-1a876",
    storageBucket: "ionic-test-1a876.firebasestorage.app",
    messagingSenderId: "680054199044",
    appId: "1:680054199044:web:7c5f484a35abdfb87b7651",
    measurementId: "G-4YMGDC0H2M"
  },
  remoteConfig: {
    minimumFetchIntervalMillis: 43200000, // 12 hours in production
    fetchTimeoutMillis: 60000, // 1 minute
  }
};