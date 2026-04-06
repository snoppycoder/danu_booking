import i18n from "i18next";
import { initReactI18next } from "react-i18next";
const defaultLang =
  typeof window !== "undefined"
    ? localStorage.getItem("userLang") || "am"
    : "am";
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
        bookYourTickets: "BOOK YOUR BUS TICKET",
        continueAsGuest: "Continue as Guest",
        dontHaveAccount: "Don't have an account?",
        chooseYourDestinationsAndDatesToReserveATicket:
          "Choose Your Destinations And Dates To Reserve A Ticket",
        home: "Home",
        about: "About Us",
        contact: "Contact Us",
        profile: "My Profile",
        myBookings: "My Bookings",
        manageSessions: "Manage Sessions",
        logout: "Logout",
        from: "From",
        to: "To",
        departureDate: "Departure Date",
        returnDate: "Return Date",
        findTickets: "Find Tickets",
        departureCity: "Departure City",
        destinationCity: "Destination City",
        popularRoutes: "Popular Routes",
        availableTrips: "Available Trips",
        selectYourPreferedBus: "Select Your Preferred Bus",
        selectYourSeat: "Select Your Seat",
        reviewAndConfirm: "Review and Confirm",
        showing: "Showing",
      },
    },

    om: {
      translation: {
        welcomeBack: "Baga Nagaan Deebite",
        login: "Seeni",
        signIn: "Eenyummeessaa Danu Booking keetiin seeni",
        phoneNumber: "Lakkoofsa Bilbilaa yokiin Teessoo Iimeelii",
        password: "Jecha Icchitii",
        rememberMe: "Na Yaadadhu",
        forgotPassword: "Jecha iccitii dagattee?",
        or: "YOKIIN",
        continueAsGuest: "Akka Keessummaatti Itti Fufi",
        dontHaveAccount: "Hingaree hin qabduu?",
        bookYourTickets: "BOOK YOUR BUS TICKET", //
      },
    },
    ti: {
      translation: {
        welcomeBack: "እንቋዕ ብደሓን መጻእኩም",
        login: "እቶ",
        signIn: "ናብ Danu Booking ኣካውንትኩም እተዉ",
        phoneNumber: "ቁጽሪ ቴሌፎን ወይ ኢሜይል",
        password: "መሕለፊ ቃል",
        rememberMe: "ዘክረኒ",
        forgotPassword: "መሕለፊ ቃል ረሲዕካ?",
        or: "ወይ",
        continueAsGuest: "ከም ጋሻ ቀጽል",
        dontHaveAccount: "ኣካውንት የብልኩምን?",
        chooseYourDestinationsAndDatesToReserveATicket:
          "Choose Your Destinations And Dates To Reserve A Ticket",
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
        bookYourTickets: "የአውቶቡስ ትኬትዎን ይቁረጡ",
        chooseYourDestinationsAndDatesToReserveATicket:
          "የመድረሻዎን እና ቀናት ይምረጡ እና ትኬት ይያዙ",
        home: "መነሻ",
        about: "ስለ እኛ",
        contact: "ያግኙን",
        profile: "የእኔ መገለጫ",
        myBookings: "የእኔ ቲኬቶች",
        manageSessions: "አካውንት አስተዳደር",
        logout: "ውጣ",
        from: "ከ",
        to: "ወደ",
        departureDate: "የመነሻ ቀን",
        returnDate: "የመመለሻ ቀን",
        findTickets: "ትኬቶችን ይፈልጉ",
        departureCity: "የመነሻ ከተማ",
        destinationCity: "የመድረሻ ከተማ",
        popularRoutes: "ታዋቂ ጉዞዎች",
        availableTrips: "ጉዞዎቹ እነኚሁና",
      },
    },
  },
  lng: defaultLang,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
