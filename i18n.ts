import { sign } from "crypto";
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
        viewDetails: "View Details",
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
        chooseYourSeat: "Choose Your Seat",
        reviewAndConfirm: "Review and Confirm",
        showing: "Showing",
        bookNow: "Book Now",
        noTripsFound: "No trips found.",
        enterPassengerInfo: "Enter Passenger Information",
        passenger: "Passenger",
        isPassengerChild: "Is this passenger a child?",
        nameBookingForm: "Full name",
        faydaId: "ID Number",
        email: "Email",
        phone: "Phone",
        companyInfo: "Company Info",
        weWouldLoveToHearFromYou: "We'd love to hear from you",
        haveAQuestionOrFeedback:
          "Have a question or suggestion? We’re here to help you navigate your journey with ease and confidence.",
        aboutHeroTitle1: "Transforming Ethiopia's",
        aboutHeroTitle2: "Intercity Travel",
        aboutHeroDesc:
          "DANU Booking is modernizing the way people travel across Ethiopia through smart, accessible digital solutions.",

        vision: "Our Vision",
        visionDesc:
          "To become Ethiopia's most trusted and leading digital platform for intercity bus booking.",
        visionPoint1: "Trusted by passengers and operators",
        visionPoint2: "Nationwide coverage and accessibility",

        mission: "Our Mission",
        missionDesc:
          "To simplify intercity travel with a reliable digital booking system.",
        missionPoint1: "Simple, reliable digital solutions",
        missionPoint2: "Benefits for all stakeholders",

        whyWeExist: "Why We Exist",
        whyWeExistDesc:
          "We saw real problems in Ethiopia's intercity transportation.",

        passengerChallenges: "Passenger Challenges",
        challenge1: "Long ticket office queues",
        challenge2: "Limited booking hours",
        challenge3: "Uncertainty about seat availability",
        challenge4: "Manual and inconvenient processes",

        operatorChallenges: "Operator Challenges",
        operator1: "Unsold seats and lost revenue",
        operator2: "Manual paperwork",
        operator3: "Limited market visibility",
        operator4: "Lack of reliable sales data",

        whatWeOffer: "What We Offer",
        whatWeOfferDesc: "Comprehensive solutions for passengers and operators",

        forPassengers: "For Passengers",
        p1: "Search routes across Ethiopia",
        p2: "Compare operators",
        p3: "Select seats",
        p4: "Secure payments",
        p5: "Digital tickets",
        p6: "SMS updates",

        forOperators: "For Operators",
        o1: "Increase seat occupancy",
        o2: "Reliable sales channel",
        o3: "Real-time management",
        o4: "Reduced workload",
        o5: "Wider customer base",
        o6: "Better data insights",

        joinDanu: "Join the DANU Network",
        joinDanuDesc:
          "DANU connects passengers, operators, and partners across Ethiopia.",

        quickSupport: "Quick Support",
        visitUs: "Visit Us",
        callUs: "Call Us",
        emailUs: "Email Us",

        getInTouch: "Get in touch",

        sendMessage: "Send Message",

        viewAllPast: "View all your past and upcoming trips",
        cancelled: "Cancelled",
        bookedOn: "Booked on",
        confirmed: "Confirmed",
        operator: "Operator",
        passengers: "Passengers",

        //
        create_account: "Create Account",
        join_danu_booking_and_start_booking_today:
          "Join Danu Booking and start booking today",
        first_name: "First Name",
        last_name: "Last Name",
        email_address_optional: "Email Address (Optional)",
        phone_number: "Phone Number",

        confirm_password: "Confirm Password",
        i_read_and_agree_to_the: "I read and agree to the",
        terms_and_conditions: "Terms & Conditions",
        already_have_an_account: "Already have an account?",

        passwords_do_not_match: "Passwords do not match",
        you_must_accept_the_terms_and_conditions: "You must accept the ",
        account_created_successfully_please_verify_your_account:
          "Account created successfully, please verify your account",
        failed_to_create_account: "Failed to create account",
        you_have_to_read_and_review_the_terms_and_conditions_to_proceed:
          "You have to read and review the terms and conditions to proceed",

        signUp: "Sign Up",
      },
    },

    om: {
      translation: {
        welcomeBack: "Baga Nagaan Deebite",
        login: "Seeni",
        total: "Kaffaltii Walii-galaa",
        operator: "Opreeterii",
        signIn: "Akkaawuntii Danu Booking keetti seeni",
        phoneNumber: "Lakkoofsa Bilbilaa ykn Imeelii",
        password: "Jecha Iccitii",
        rememberMe: "Na Yaadadhu",
        forgotPassword: "Jecha iccitii dagatte?",
        or: "YKN",
        bookYourTickets: "Tikeeta Awtoobisi Bitadhu",
        continueAsGuest: "Akka Keessummaatti Itti Fufi",
        dontHaveAccount: "Akkaawuntii hin qabduu?",
        chooseYourDestinationsAndDatesToReserveATicket:
          "Bakka deemtuu fi guyyaa filadhu, tikeeta kee qabsiifadhu",
        home: "Mana",
        about: "Waa'ee Keenya",
        contact: "Nu Quunnami",
        profile: "Profaayilii Koo",
        myBookings: "Baqannaa Koo",
        manageSessions: "Seeshinii Bulchi",
        logout: "Ba'i",
        from: "Irraa",
        to: "Gara",
        departureDate: "Guyyaa Ka'umsaa",
        returnDate: "Guyyaa Deebi'uu",
        findTickets: "Tikeetota Barbaadi",
        departureCity: "Magaalaa Ka'umsaa",
        destinationCity: "Magaalaa Itti Deemtuu",
        popularRoutes: "Karaa Beekamoo",
        availableTrips: "Imaltoonni Jiran",
        selectYourPreferedBus: "Awtoobisa Filatamaa Kee Filadhu",
        chooseYourSeat: "Teessoo Kee Filadhu",
        reviewAndConfirm: "Ilaali fi Mirkaneessi",
        showing: "Agarsiisaa",
        bookNow: "Amma Qabsiifadhu",
        noTripsFound: "Imala hin argamne.",
        enterPassengerInfo: "Odeeffannoo Imaltootaa Galchi",
        passenger: "Imaltuu",
        isPassengerChild: "Imaltuun kun daa'imaa dha?",
        nameBookingForm: "Maqaa guutuu",
        faydaId: "Lakkoofsa Eenyummaa",
        email: "Imeelii",
        phone: "Bilbila",
        companyInfo: "Odeeffannoo Dhaabbataa",
        weWouldLoveToHearFromYou: "Isin irraa dhaga'uuf gammanna",
        haveAQuestionOrFeedback:
          "Gaaffii ykn yaada qabduu? Imala keessan salphaa fi amanamaa taasisuuf isin gargaaruuf as jirra.",
        aboutHeroTitle1: "Jijjiiruu Imala",
        aboutHeroTitle2: "Gidduu Magaalota Itoophiyaa",
        aboutHeroDesc:
          "DANU Booking furmaata dijitaalaa ammayyaa fi salphaa ta'een akkaataa namoonni Itoophiyaa keessa itti imalan ammayyeessaa jira.",

        vision: "Mul'ata Keenya",
        visionDesc:
          "Itoophiyaa keessatti waltajjii dijitaalaa tikeetii awtoobisaa amansiisaa fi dursaa ta'uu.",
        visionPoint1: "Imaltoota fi abbootii qabeenyaatiin kan amaname",
        visionPoint2: "Biyya guutuutti argamuu fi salphaatti fayyadamuu",

        mission: "Ergaa Keenya",
        missionDesc:
          "Sirna tikeetii dijitaalaa amansiisaa ta'een imala gidduu magaalotaa salphisuu.",
        missionPoint1: "Furmaata dijitaalaa salphaa fi amansiisaa",
        missionPoint2: "Qaamolee dhimmamoo hundaaf faayidaa",

        whyWeExist: "Maaliif Akka Jirru",
        whyWeExistDesc:
          "Rakkoolee qabatamaa geejjiba gidduu magaalota Itoophiyaa keessa jiran agarreerra.",

        passengerChallenges: "Rakkoolee Imaltootaa",
        challenge1: "Hiriira dheeraa waajjira tikeetii",
        challenge2: "Sa'aatii tikeetii murtaa'aa",
        challenge3: "Teessoon jiraachuu isaa mirkaneeffachuu dhabuu",
        challenge4: "Adeemsa harkaatiifi rakkisaa ta'e",

        operatorChallenges: "Rakkoolee Abbootii Qabeenyaa",
        operator1: "Teessoo hin gurguramne fi galii dhabame",
        operator2: "Hojii waraqaa",
        operator3: "Mul'achuu gabaa murtaa'aa",
        operator4: "Ragaa gurgurtaa amansiisaa dhabuu",

        whatWeOffer: "Maal Akka Dhiyeessinu",
        whatWeOfferDesc: "Imaltoota fi abbootii qabeenyaaf furmaata guutuu",

        forPassengers: "Imaltootaaf",
        p1: "Itoophiyaa keessatti sararoota barbaadi",
        p2: "Awtoobisoota walbira qabi",
        p3: "Teessoo filadhu",
        p4: "Kaffaltii amansiisaa",
        p5: "Tikeetii dijitaalaa",
        p6: "Odeeffannoo SMS",

        forOperators: "Abbootii Qabeenyaaf",
        o1: "Gurgurtaa teessoo dabaluu",
        o2: "Sarara gurgurtaa amansiisaa",
        o3: "To'annoo yeroo dhugaa",
        o4: "Ba'aa hojii hir'isuu",
        o5: "Maamiltoota bal'aa argachuu",
        o6: "Hubannoo ragaa fooya'aa",

        joinDanu: "Dhaabbata DANUtti Makamaa",
        joinDanuDesc:
          "DANU'n imaltoota, abbootii qabeenyaa, fi michuuwwan Itoophiyaa guutuutti walitti fida.",

        quickSupport: "Deeggarsa Ariifachiisaa",
        visitUs: "Nu Daawwadhaa",
        callUs: "Nuuf Bilbilaa",
        emailUs: "Imeelii Nuuf Barreessaa",

        getInTouch: "Nu Quunnamaa",

        sendMessage: "Ergi",
        viewAllPast: "Imala kee kan darbeefi kan fuulduraa hunda ilaali",
        cancelled: "Haqameera",
        bookedOn: "Kan qabame",
        confirmed: "Mirkanaa'eera",
        passengers: "Imaltoota",

        create_account: "Akkaawuntii Uumi",
        join_danu_booking_and_start_booking_today:
          "Danu Booking keessatti hirmaadhu fi har’a booking jalqabi",
        first_name: "Maqaa Duraa",
        last_name: "Maqaa Abbaa",
        email_address_optional: "Teessoo Imeelii (Filannoo)",
        phone_number: "Lakkoofsa Bilbilaa",

        confirm_password: "Jecha Iccitii Mirkaneessi",
        i_read_and_agree_to_the: "Ani dubbisee walii galeera",
        terms_and_conditions: "Seerotaa fi Haalota",
        already_have_an_account: "Akkaawuntii qabdaa?",

        passwords_do_not_match: "Jechoonni iccitii wal hin siman",
        you_must_accept_the_terms_and_conditions:
          "Seerotaa fi haalota fudhachuu qabda",
        account_created_successfully_please_verify_your_account:
          "Akkaawuntiin milkaa’inaan uumameera, maaloo mirkaneessi",
        failed_to_create_account: "Akkaawuntii uumuu hin milkoofne",
        you_have_to_read_and_review_the_terms_and_conditions_to_proceed:
          "Itti fufuuf seerotaa fi haalota dubbisuu fi ilaaluu qabda",

        signUp: "Galmaa'i",
      },
    },
    ti: {
      translation: {
        welcomeBack: "እንቋዕ ብደሓን መጻእኩም",
        login: "እቶ",
        signIn: "ናብ ኣካውንት Danu Booking እተዉ",
        phoneNumber: "ቁጽሪ ቴሌፎን ወይ ኢመይል",
        password: "መሕለፊ ቃል",
        rememberMe: "ዘክረኒ",
        forgotPassword: "መሕለፊ ቃል ረሲዕካ?",
        or: "ወይ",
        bookYourTickets: "ቲኬት ኣውቶቡስ ይግዙ",
        continueAsGuest: "ከም ጋሻ ቀጽል",
        dontHaveAccount: "ኣካውንት የብልካን?",
        chooseYourDestinationsAndDatesToReserveATicket:
          "መዓልቲን መድረሻን ምረጽ እና ቲኬት ይሓዝ",
        home: "መነሻ",
        about: "ብዛዕባና",
        contact: "ርኸቡና",
        profile: "ፕሮፋይል ናይይ",
        myBookings: "ቦኪንግ ናይይ",
        manageSessions: "ሴሽን ኣስተዳድር",
        logout: "ውጻእ",
        from: "ካብ",
        to: "ናብ",
        departureDate: "መዓልቲ መጀመርታ",
        returnDate: "መዓልቲ ምምላስ",
        findTickets: "ቲኬታት ይፈልጡ",
        departureCity: "ከተማ መጀመርታ",
        destinationCity: "ከተማ መድረሻ",
        popularRoutes: "መንገዲ ዝተለመዱ",
        availableTrips: "ጉዕዞታት ዝርከቡ",
        selectYourPreferedBus: "ኣውቶቡስ ዝመረጽኩም ምረጹ",
        chooseYourSeat: "መቐመጢ ምረጽ",
        reviewAndConfirm: "መርምርን ኣረጋግጽን",
        showing: "ይረአ",
        bookNow: "ሕጂ ይሓዝ",
        noTripsFound: "ጉዕዞ ኣይተረኸበን",
        enterPassengerInfo: "ሓበሬታ ተጓዓዚ ኣእትው",
        passenger: "ተጓዓዚ",
        total: "ጠቕላላ ክፍሊት",
        isPassengerChild: "እዚ ተጓዓዚ ሕፃን ድዩ?",
        nameBookingForm: "ሙሉእ ስም",
        faydaId: "ቁጽሪ መለለዪ",
        operator: "ኦፕሬተር",
        email: "ኢመይል",
        phone: "ቴሌፎን",
        companyInfo: "ሓበሬታ ኩባንያ",
        weWouldLoveToHearFromYou: "ካብኩም ምስማዕ ንፈቱ",
        haveAQuestionOrFeedback:
          "ጥያቄ ወይ ርእይቶ ኣለኩም? ጉዕዞኹም ቀሊልን እምነት ዝበለ ንምግባር ኣብዚ ኣለና።",
        aboutHeroTitle1: "ምልዋጥ ጉዕዞ",
        aboutHeroTitle2: "መንጎ ከተማታት ኢትዮጵያ",
        aboutHeroDesc:
          "ዳኑ ቡኪንግ (DANU Booking) ብዘመናዊን ቀሊልን ዲጂታላዊ መፍትሒታት ኣገባብ ጉዕዞ ህዝቢ ኣብ መላእ ኢትዮጵያ የዘምኖ ኣሎ።",
        passengers: "ተሳፈርቲ",
        vision: "ራእይና",

        visionDesc: "ኣብ ኢትዮጵያ ዝተኣማመንን ቀዳማይን ዲጂታላዊ መድረኽ መሸጣ ቲኬት ኣውቶቡስ ምዃን።",
        visionPoint1: "ብተጓዓዝትን ዋንቲ ኣውቶቡስን ዝተኣማመን",
        visionPoint2: "ሃገር ለኸ ተበጻሕነት",

        mission: "ተልእኾና",
        missionDesc: "ብዘተኣማምን ዲጂታላዊ ስርዓት መሸጣ ቲኬት ጉዕዞ መንጎ ከተማታት ምቅላል።",
        missionPoint1: "ቀሊልን ዘተኣማምንን ዲጂታላዊ መፍትሒታት",
        missionPoint2: "ንኹሎም መዳርግቲ ኣካላት ዝጠቅም",

        whyWeExist: "ስለምንታይ ከም ዘለና",
        whyWeExistDesc: "ኣብ ትራንስፖርት መንጎ ከተማታት ኢትዮጵያ ዘሎ ጭቡጥ ጸገማት ርኢና ኢና።",

        passengerChallenges: "ጸገማት ተጓዓዝቲ",
        challenge1: "ነዊሕ መስርዕ መሸጣ ቲኬት",
        challenge2: "ድሩት ሰዓታት መሸጣ ቲኬት",
        challenge3: "ብዛዕባ መቐመጢ ርግጸኛ ዘይምዃን",
        challenge4: "ኣድካሚን ብኢድ ዝስራሕን ኣገባባት",

        operatorChallenges: "ጸገማት ዋንቲ ኣውቶቡስ",
        operator1: "ዘይተሸጠ መቐመጢን ክሳራ ኣታዊን",
        operator2: "ናይ ወረቐት ስራሕ",
        operator3: "ድሩት ናይ ዕዳጋ ተበጻሕነት",
        operator4: "ዘተኣማምን መረዳእታ መሸጣ ዘይምህላው",

        whatWeOffer: "እንታይ ነቕርብ",
        whatWeOfferDesc: "ንተጓዓዝትን ዋንቲ ኣውቶቡስን ምሉእ መፍትሒታት",

        forPassengers: "ንተጓዓዝቲ",
        p1: "ኣብ መላእ ኢትዮጵያ መንገድታት ድለ",
        p2: "ኣውቶቡሳት ኣወዳድር",
        p3: "መቐመጢ ምረጽ",
        p4: "ዘተኣማምን ክፍሊት",
        p5: "ዲጂታላዊ ቲኬታት",
        p6: "ሓበሬታ ብ SMS",

        forOperators: "ንዋንቲ ኣውቶቡስ",
        o1: "መሸጣ መቐመጢ ምውሳኽ",
        o2: "ዘተኣማምን መሸጣ መገዲ",
        o3: "ናይ ግዜ-ሓቂ (Real-time) ምምሕዳር",
        o4: "ጾር ስራሕ ምቕናስ",
        o5: "ሰፊሕ ተበጻሕነት ዓማዊል",
        o6: "ዝሓሸ ትንተና መረዳእታ",

        joinDanu: "ኣብ ዳኑ (DANU) ኔትወርክ ተጸንበሩ",
        joinDanuDesc: "ዳኑ ንተጓዓዝቲ፣ ዋንቲ ኣውቶቡስን መሻርኽትን ኣብ መላእ ኢትዮጵያ የራኽብ።",

        quickSupport: "ቅልጡፍ ደገፍ",
        visitUs: "በጽሑና",
        callUs: "ደውሉልና",
        emailUs: "ኢሜይል ጸሓፉልና",

        getInTouch: "ርክብ ግበሩልና",

        send: "ስደድ",
        viewAllPast: "ዝሓለፉን ዝመጹን ዑደታትካ ርአ",
        cancelled: "ተሰሪዙ",
        bookedOn: "ዝተታሕዘሉ ዕለት",
        confirmed: "ተረጋጊጹ",

        create_account: "ሕሳብ ፍጠር",
        join_danu_booking_and_start_booking_today:
          "ዳኑ ቡኪንግ ተቐላቐሉ እና ሎሚ ምዝገባ ጀምሩ",
        first_name: "ሽም ቀዳማይ",
        last_name: "ሽም ኣቦ",
        email_address_optional: "ኢሜይል ኣድራሻ (ኣማራጺ)",
        phone_number: "ቁጽሪ ስልኪ",

        confirm_password: "መሕለፊ ቃል ኣረጋግጽ",
        i_read_and_agree_to_the: "ኣንቢበ እና ተስማሚየ ኣለኹ ን",
        terms_and_conditions: "ውዕላትን ኩነታትን",
        already_have_an_account: "ቀድሞ ሕሳብ ኣለካ?",

        passwords_do_not_match: "መሕለፊ ቃላት ኣይሰማምዑን",
        you_must_accept_the_terms_and_conditions: "ውዕላትን ኩነታትን ክትቅበል ኣለካ",
        account_created_successfully_please_verify_your_account:
          "ሕሳብካ ብትኽክል ተፈጢሩ፣ በጃኻ ኣረጋግጾ",
        failed_to_create_account: "ሕሳብ ምፍጣር ኣይተሳኸለን",
        you_have_to_read_and_review_the_terms_and_conditions_to_proceed:
          "ንምቕጻል ውዕላትን ኩነታትን ክትንብብን ክትምርምርን ኣለካ",
        signUp: "ተመዝገብ",
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
        total: "ጠቅላላ ክፍያ",
        login: "ግቡ",
        or: "ወይም",
        operator: "ኦፕሬተር",
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
        selectYourPreferedBus: "የእርስዎን ተመራጭ አውቶቡስ ይምረጡ",
        chooseYourSeat: "መቀመጫዎን ይምረጡ",
        reviewAndConfirm: "ይገምግሙ እና ያረጋግጡ",
        showing: "Showing",
        bookNow: "አሁን ይያዙ",
        noTripsFound: "ጉዞ አልተገኘም",
        enterPassengerInfo: "የመንገደኞች መረጃ ያስገቡ",
        passenger: "መንገደኛ",
        isPassengerChild: "ይህ መንገደኛ ሕፃን ነው?",
        nameBookingForm: "ሙሉ ስም",
        faydaId: "መታወቂያ ቁጥር",
        email: "ኢሜይል",
        phone: "ስልክ ቁጥር",
        companyInfo: "የድርጅት መረጃ",
        weWouldLoveToHearFromYou: "ከእርስዎ መስማት እንፈልጋለን",
        haveAQuestionOrFeedback:
          "ጥያቄ ወይም አስተያየት አለዎት? ጉዞዎን በቀላል እና በራስ መተማመን እንዲሄዱ ለማገዝ እዚህ መጥተናል።",
        aboutHeroTitle1: "የኢትዮጵያን",
        aboutHeroTitle2: "የከተማ አቋራጭ ጉዞ ማዘመን",
        aboutHeroDesc:
          "ዳኑ ቡኪንግ (DANU Booking) ዘመናዊ እና ተደራሽ በሆኑ ዲጂታል መፍትሄዎች በመላው ኢትዮጵያ የሰዎችን የጉዞ ልምድ እያዘመነ ይገኛል።",

        vision: "ራዕያችን",
        visionDesc: "ለከተማ አቋራጭ የአውቶቡስ ትኬት ሽያጭ የኢትዮጵያ ታማኝ እና ቀዳሚ ዲጂታል መድረክ መሆን።",
        visionPoint1: "በመንገደኞች እና በአውቶቡስ ባለንብረቶች ዘንድ ታማኝ",
        visionPoint2: "ሀገር አቀፍ ተደራሽነት",

        mission: "ተልእኳችን",
        missionDesc: "አስተማማኝ በሆነ ዲጂታል የትኬት ሽያጭ ስርዓት የከተማ አቋራጭ ጉዞን ማቅለል።",
        missionPoint1: "ቀላል እና አስተማማኝ ዲጂታል መፍትሄዎች",
        missionPoint2: "ለሁሉም ባለድርሻ አካላት ጠቃሚ",

        whyWeExist: "የተፈጠርንበት ዓላማ",
        whyWeExistDesc:
          "በኢትዮጵያ የከተማ አቋራጭ ትራንስፖርት ውስጥ ያሉትን እውነተኛ ችግሮች ተመልክተናል፤ እነሱን ለመፍታትም እዚህ እንገኛለን።",

        passengerChallenges: "የመንገደኞች ፈተናዎች",
        challenge1: "ረጅም የትኬት መቁረጫ ሰልፎች",
        challenge2: "ውስን የትኬት መቁረጫ ሰዓታት",
        challenge3: "ስለመቀመጫ መኖር እርግጠኛ አለመሆን",
        challenge4: "አድካሚ እና ጊዜ አጥፊ አሰራሮች",

        operatorChallenges: "የአውቶቡስ ባለንብረቶች ፈተናዎች",
        operator1: "ያልተሸጡ መቀመጫዎች እና የገቢ ብክነት",
        operator2: "በወረቀት ላይ የተመሰረተ አሰራር",
        operator3: "ውስን የገበያ ተደራሽነት",
        operator4: "አስተማማኝ የሽያጭ መረጃ አለመኖር",

        whatWeOffer: "ምን እናቀርባለን",
        whatWeOfferDesc: "ለመንገደኞች እና ለአውቶቡስ ባለንብረቶች የተሟላ መፍትሄዎች",

        forPassengers: "ለመንገደኞች",
        p1: "በመላው ኢትዮጵያ ጉዞዎችን ይፈልጉ",
        p2: "አውቶቡሶችን ያወዳድሩ",
        p3: "መቀመጫ ይምረጡ",
        p4: "አስተማማኝ የክፍያ ስርዓት",
        p5: "ዲጂታል ትኬቶች",
        p6: "የአጭር የፅሁፍ መልዕክት (SMS) ማሳወቂያዎች",

        forOperators: "ለአውቶቡስ ባለንብረቶች",
        o1: "የመቀመጫ ሽያጭን ማሳደግ",
        o2: "አስተማማኝ የሽያጭ አማራጭ",
        o3: "የጊዜ-እውነተኛ (Real-time) አስተዳደር",
        o4: "የስራ ጫናን መቀነስ",
        o5: "ሰፊ የደንበኛ ተደራሽነት",
        o6: "የተሻለ የመረጃ ትንተና",

        joinDanu: "የዳኑ ኔትወርክን ይቀላቀሉ",
        joinDanuDesc:
          "ዳኑ በመላው ኢትዮጵያ የሚገኙ መንገደኞችን፣ የአውቶቡስ ባለንብረቶችን እና አጋሮችን ያገናኛል።",

        quickSupport: "ፈጣን ድጋፍ",
        visitUs: "ይጎብኙን",
        callUs: "ይደውሉልን",
        emailUs: "ኢሜይል ያድርጉልን",

        getInTouch: "ያግኙን",
        sendMessage: "ላክ",

        viewAllPast: "ያለፉትን እና የሚመጡ ጉዞዎችን በሙሉ ይመልከቱ",
        cancelled: "ተሰርዟል",
        bookedOn: "የተያዘበት ቀን",
        confirmed: "ተረጋግጧል",

        passengers: "ተሳፋሪዎች",

        create_account: "መለያ ፍጠር",
        join_danu_booking_and_start_booking_today:
          "ዳኑ ቡኪንግን ይቀላቀሉ እና ዛሬ መያዝ ይጀምሩ",
        first_name: "የመጀመሪያ ስም",
        last_name: "የአባት ስም",
        email_address_optional: "የኢሜይል አድራሻ (አማራጭ)",
        phone_number: "ስልክ ቁጥር",

        confirm_password: "የይለፍ ቃልን ያረጋግጡ",
        i_read_and_agree_to_the: "አንብቤ እና ተስማምቻለሁ ከ",
        terms_and_conditions: "ውሎች እና ሁኔታዎች",
        already_have_an_account: "መለያ አለዎት?",

        passwords_do_not_match: "የይለፍ ቃላት አይዛመዱም",
        you_must_accept_the_terms_and_conditions: "ውሎችን እና ሁኔታዎችን መቀበል አለብዎት",
        account_created_successfully_please_verify_your_account:
          "መለያው በተሳካ ሁኔታ ተፈጥሯል፣ እባክዎ ያረጋግጡት",
        failed_to_create_account: "መለያ መፍጠር አልተሳካም",
        you_have_to_read_and_review_the_terms_and_conditions_to_proceed:
          "ለመቀጠል ውሎችን እና ሁኔታዎችን ማንበብ እና ማረጋገጥ አለብዎት",
        signUp: "ይመዝገቡ",
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
