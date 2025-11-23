/**
 * Environment configuration for development
 * This file contains the Firebase configuration for the development environment
 * 
 * Security Note: In production, these values should come from environment variables
 * For development purposes, we include them here for easier setup
 */
export const environment = {
  production: false,
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
    minimumFetchIntervalMillis: 3600000, // 1 hour in dev
    fetchTimeoutMillis: 60000, // 1 minute
  }
};