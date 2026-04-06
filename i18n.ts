import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        welcomeBack: "Welcome Back",
        login: "Login",
        signIn: "Sign in to your Danu Booking account",
        phoneNumber: "Phone Number or Email",
        password: "Password",
        rememberMe: "Remember Me",
        forgotPassword: "Forgot your password?",
        or: "OR",
        continueAsGuest: "Continue as Guest",
        dontHaveAccount: "Don't have an account?",
      },
    },
    am: {
      translation: {
        welcomeBack: "እንኳን ደህና መጡ",
        signIn: "ወደ ዳኑ ቡኪንግ አካውንት ይግቡ",
        phoneNumber: "ስልክ ቁጥር",
        password: "የሚስጥር ቁጥር",
        rememberMe: "አስታውሰኝ",
        forgotPassword: "የሚስጥር ቁጥር ረሳዎት?",
        login: "ግቡ",
        or: "ወይም",
        continueAsGuest: "እንደ እንግዳ ይቀጥሉ",
        dontHaveAccount: "አካውንት የለህም?",
      },
    },
  },
  lng: "am",
  fallbackLng: "am",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
