/*
  Wedding details. This is the only file you need to edit for wording, names, dates and numbers.

  Source: "Wedding Invitation.pdf" (Hindi card for Jiya & Smit, 12 December 2026).
  All times are India Standard Time (IST, UTC+05:30).

  The illustrations (palace, couple, peacock, lamps) are drawn in art.js, and the order of the
  scenes and their time of day is set in app.js (the SLIDES list).
*/
window.WEDDING = {
  couple: {
    bride: { name: "Jiya", hindi: "जिया" },
    groom: { name: "Smit", hindi: "स्मित" },
  },

  wedding: {
    // The evening Ashirwad Samaroh. The countdown counts down to this moment.
    startsAt: "2026-12-12T19:15:00+05:30",
    dateLine: "Saturday, 12 December 2026",
    venue: "Jamuna Resort",
    city: "Jhunjhunu, Rajasthan",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Jamuna+Resort+Jhunjhunu+Rajasthan",
  },

  music: {
    // Replace with your own song, for example "assets/music/our-song.mp3".
    src: "assets/music/wedding-theme.wav",
  },

  blessing: {
    hindi: "श्री गणेशाय नमः",
    shloka: ["वक्रतुण्ड महाकाय, सूर्यकोटि समप्रभः।", "निर्विघ्नं कुरूमे देव, सर्व कार्येषु सर्वदा॥"],
    shlokaEn: "O Lord with the curved trunk, bright as a million suns, keep every task of ours free from obstacles.",
  },

  invitation: {
    salutation: "स्नेहिल स्वजन,",
    quote: "संस्कृति के सोलह संस्कारों में से एक है परिणय संस्कार, इस संस्कार की पूर्णता है अपनों का आशीर्वाद।",
    hindi:
      "परमपिता परमेश्वर की असीम अनुकम्पा से श्रीमती मुन्नी देवी एवं सत्यनारायण शाह के शुभाशीर्वाद से अपनी सुपौत्री आयुष्मती जिया एवं आयुष्मान् स्मित के मंगल परिणयोत्सव की सांस्कृतिक परम्परा, पूर्वजों के आशीर्वाद, अग्नि के साक्ष्य, आमंत्रितों की शुभकामनाओं एवं स्वागत सत्कार की सुमधुर मंगल वेला में आयोजित सभी कार्यक्रमों में आपकी स्नेहमयी उपस्थिति एवं आशीर्वाद हेतु आपको सादर आमंत्रित करते हैं।",
    english:
      "With the blessings of Smt. Munni Devi and Sh. Satyanarayan Shah, you are lovingly invited to the wedding of their granddaughter Jiya with Smit, and to bless them at every ceremony.",
  },

  families: {
    bride: {
      side: "वधु पक्ष",
      nameHindi: "आयुष्मती जिया",
      lines: [
        "Daughter of Smt. Sangita Shah & Sh. Virendra Shah",
        "Granddaughter of Smt. Munni Devi & Sh. Satyanarayan Shah",
        "Mukundgarh Mandi, Jhunjhunu",
      ],
      firm: "Shah Trading Company, Mukundgarh Mandi",
    },
    groom: {
      side: "वर पक्ष",
      nameHindi: "आयुष्मान् स्मित",
      lines: [
        "Son of Smt. Meena Devi & Sh. Sunil Gupta",
        "Grandson of late Smt. Sita Devi & late Sh. Matadin Gupta",
      ],
      firm: "Shri Shyam Textile, Ahmedabad, Gujarat",
    },
    maternal: {
      hindi: "ननिहाल पक्ष",
      label: "Maternal family (Nanihal), Gadoda",
      names: "Ramavatar ji, late Banwarilal ji, Jagdish ji",
    },
  },

  // Each day gets its own step. Set "main: true" to highlight the main ceremony.
  days: [
    {
      day: "9", weekday: "Wednesday", month: "December 2026",
      place: "At the family residence, Mukundgarh Mandi",
      events: [
        { time: "11:15 AM", startsAt: "2026-12-09T11:15:00+05:30", hindi: "श्री गणेश पूजन", english: "Shri Ganesh Pujan" },
        { time: "2:30 PM", startsAt: "2026-12-09T14:30:00+05:30", hindi: "कीर्तन (मंगल पाठ)", english: "Kirtan (Mangal Path)" },
        { time: "6:00 PM", startsAt: "2026-12-09T18:00:00+05:30", hindi: "प्रसाद", english: "Prasad" },
      ],
    },
    {
      day: "11", weekday: "Friday", month: "December 2026",
      place: "Jamuna Resort, Jhunjhunu",
      events: [
        { time: "11:15 AM", startsAt: "2026-12-11T11:15:00+05:30", hindi: "भात (मायरा)", english: "Bhaat (Mayra)" },
        { time: "5:15 PM", startsAt: "2026-12-11T17:15:00+05:30", hindi: "तिलकोत्सव", english: "Tilakotsav" },
      ],
    },
    {
      day: "12", weekday: "Saturday", month: "December 2026",
      place: "Jamuna Resort, Jhunjhunu",
      events: [
        { time: "10:15 AM", startsAt: "2026-12-12T10:15:00+05:30", hindi: "हल्दी", english: "Haldi" },
        {
          time: "7:15 PM",
          startsAt: "2026-12-12T19:15:00+05:30",
          hindi: "आशीर्वाद समारोह एवं स्वरूचि भोज",
          english: "Ashirwad Samaroh and dinner",
          main: true,
        },
      ],
    },
  ],

  guests: {
    darshan: {
      hindi: "दर्शनाभिलाषी",
      names: ["Sangita – Ramakant Shah", "Kiran – Devendra Shah", "Shweta – Dr. Narendra Shah", "Dr. Pragya – Dr. Ankit Shah"],
    },
    special: {
      hindi: "विशेष आग्रह",
      names: ["Prem – Govind ji Karivala", "Sushila – Ravi Prakash ji Mittal", "Mamta – Sumit ji Udaipuria", "Nikita – Manish ji Mittal"],
    },
    sweet: {
      hindi: "मीठी मनुहार",
      names: ["Tilak", "Mahak", "Harshit", "Mridul", "Priyanshi", "Divyam", "Chaitanya", "Nayesha"],
    },
    ladies: "Please accept this card as the invitation for the ladies of the family too.",
  },

  // Phone numbers from the card. "tel" is for the call button, "wa" for WhatsApp (country code + number, no +).
  contacts: [
    { display: "94600 36251", tel: "+919460036251", wa: "919460036251" },
    { display: "96103 72147", tel: "+919610372147", wa: "919610372147" },
  ],

  closing: {
    hindi: "आपके आगमन की प्रतीक्षा में",
    english: "Awaiting your arrival",
    signedHindi: "विनीत: सत्यनारायण शाह एवं समस्त शाह परिवार",
    signedEnglish: "Satyanarayan Shah and the entire Shah family",
  },
};
