/*
  Wedding details in English (en) and Hindi (hi). This is the only file you need to edit for
  wording, names, dates and numbers. Guests choose a language when they open the invitation.

  Source: "Wedding Invitation.pdf" (the Hindi card for Jeeya & Smit, 12 December 2026). The Hindi
  is taken word for word from the card; the English is a translation.
  All times are India Standard Time (IST, UTC+05:30).
*/
window.WEDDING = {
  couple: {
    bride: { en: "Jeeya", hi: "जिया" },
    groom: { en: "Smit", hi: "स्मित" },
  },

  wedding: {
    // The evening Ashirwad Samaroh. The countdown counts down to this moment.
    startsAt: "2026-12-12T19:15:00+05:30",
    date: { en: "Saturday, 12 December 2026", hi: "शनिवार, 12 दिसम्बर 2026" },
    venue: { en: "Jamuna Resort", hi: "जमुना रिसोर्ट" },
    city: { en: "Jhunjhunu, Rajasthan", hi: "झुंझुनूं (राजस्थान)" },
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Jamuna+Resort+Jhunjhunu+Rajasthan",
  },

  music: {
    // The first file that exists is played. Put your own song at assets/music/song.mp3 and it
    // replaces the default tune; until then the default plays.
    src: ["assets/music/song.mp3", "assets/music/wedding-theme.wav"],
    // Seconds to skip at the start of the song (and on each loop), because the song opens silent.
    startAt: 1.5,
  },

  blessing: {
    title: { en: "Shri Ganeshaya Namah", hi: "श्री गणेशाय नमः" },
    shloka: {
      hi: ["वक्रतुण्ड महाकाय, सूर्यकोटि समप्रभः।", "निर्विघ्नं कुरूमे देव, सर्व कार्येषु सर्वदा॥"],
      en: ["Vakratunda Mahakaya, Suryakoti Samaprabha,", "Nirvighnam Kuru Me Deva, Sarva Karyeshu Sarvada."],
    },
    meaning: { en: "O Lord with the curved trunk, radiant as a million suns, keep all our undertakings free of obstacles, always." },
    quote: {
      en: "Of the sixteen sacred rites of our culture, marriage is one, and it is made complete by the blessings of our loved ones.",
      hi: "संस्कृति के सोलह संस्कारों में से एक है परिणय संस्कार, इस संस्कार की पूर्णता है अपनों का आशीर्वाद।",
    },
  },

  invitation: {
    salutation: { en: "Dear family and friends,", hi: "स्नेहिल स्वजन," },
    body: {
      en: "With the boundless grace of the Almighty and the blessings of Mrs. Munni Devi and Mr. Satyanarayan Shah, we joyfully invite you to the wedding of their granddaughter Jeeya with Smit. Amid our traditions, the blessings of our ancestors and the witness of the sacred fire, your loving presence and blessings at every ceremony would mean the world to us.",
      hi: "परमपिता परमेश्वर की असीम अनुकम्पा से श्रीमती मुन्नी देवी एवं सत्यनारायण शाह के शुभाशीर्वाद से अपनी सुपौत्री आयुष्मती जिया संग आयुष्मान् स्मित के मंगल परिणयोत्सव की सांस्कृतिक परम्परा, पूर्वजों के आशीर्वाद, अग्नि के साक्ष्य, आमंत्रितों की शुभकामनाओं एवं स्वागत सत्कार की सुमधुर मंगल वेला में आयोजित सभी कार्यक्रमों में आपकी स्नेहमयी उपस्थिति एवं आशीर्वाद हेतु आपको सादर आमंत्रित करते हैं।",
    },
  },

  families: {
    bride: {
      side: { en: "The bride", hi: "वधु पक्ष" },
      title: { en: "Jeeya", hi: "आयुष्मती जिया" },
      lines: {
        en: ["Daughter of Mrs. Sangeeta Shah & Mr. Virendra Shah", "Granddaughter of Mrs. Munni Devi & Mr. Satyanarayan Shah", "Mukundgarh Mandi, Jhunjhunu"],
        hi: ["सुपुत्री : श्रीमती संगीता शाह एवं वीरेन्द्र शाह", "सुपौत्री : श्रीमती मुन्नी देवी एवं सत्यनारायण शाह", "निवासी : मुकुन्दगढ़ मण्डी (झुंझुनूं)"],
      },
      firm: { en: "Shah Trading Company, Mukundgarh Mandi", hi: "प्रतिष्ठान : शाह ट्रेडिंग कम्पनी, मुकुन्दगढ़ मण्डी" },
    },
    groom: {
      side: { en: "The groom", hi: "वर पक्ष" },
      title: { en: "Smit", hi: "आयुष्मान् स्मित" },
      lines: {
        en: ["Son of Mrs. Meena Devi & Mr. Sunil Gupta", "Grandson of late Smt. Sita Devi & late Sh. Matadin Gupta"],
        hi: ["सुपुत्र : श्रीमती मीना देवी एवं श्री सुनील जी गुप्ता", "सुपौत्र : स्व. श्रीमती सीता देवी एवं स्व. श्री मातादीन जी गुप्ता"],
      },
      firm: { en: "Shri Shyam Textile, Ahmedabad, Gujarat", hi: "प्रतिष्ठान : श्री श्याम टेक्सटाईल, अहमदाबाद (गुजरात)" },
    },
    maternal: {
      en: "Maternal family (Nanihal), Garoda: Ramavatar ji, late Banwarilal ji, Jagdish ji",
      hi: "ननिहाल पक्ष : रामावतार जी, स्व. बनवारीलाल जी, जगदीश जी (निवासी : गाडोदा)",
    },
  },

  // Each day gets its own scene. Set "main: true" to highlight the main ceremony.
  days: [
    {
      day: "9", weekday: { en: "Wednesday", hi: "बुधवार" }, month: { en: "December 2026", hi: "दिसम्बर 2026" },
      place: { en: "At the family home, Mukundgarh Mandi", hi: "निज निवास, मुकुन्दगढ़ मण्डी" },
      events: [
        { startsAt: "2026-12-09T11:15:00+05:30", time: { en: "11:15 AM", hi: "सुबह 11.15 बजे" }, icon: "kalash", name: { en: "Shri Ganesh Pujan", hi: "श्री गणेश पूजन" } },
        { startsAt: "2026-12-09T14:30:00+05:30", time: { en: "2:30 PM", hi: "दोपहर 2.30 बजे" }, icon: "bell", name: { en: "Kirtan (Mangal Path)", hi: "कीर्तन (मंगल पाठ)" } },
        { startsAt: "2026-12-09T18:00:00+05:30", time: { en: "6:00 PM", hi: "सायं 6.00 बजे" }, icon: "laddoo", name: { en: "Prasad", hi: "प्रसाद" } },
      ],
    },
    {
      day: "11", weekday: { en: "Friday", hi: "शुक्रवार" }, month: { en: "December 2026", hi: "दिसम्बर 2026" },
      place: { en: "Jamuna Resort, Jhunjhunu", hi: "जमुना रिसोर्ट, झुंझुनूं" },
      events: [
        { startsAt: "2026-12-11T11:15:00+05:30", time: { en: "11:15 AM", hi: "सुबह 11.15 बजे" }, icon: "gift", name: { en: "Bhaat (Mayra)", hi: "भात (मायरा)" } },
        { startsAt: "2026-12-11T17:15:00+05:30", time: { en: "5:15 PM", hi: "सायं 5.15 बजे" }, icon: "diya", name: { en: "Tilakotsav", hi: "तिलकोत्सव" } },
      ],
    },
    {
      day: "12", weekday: { en: "Saturday", hi: "शनिवार" }, month: { en: "December 2026", hi: "दिसम्बर 2026" },
      place: { en: "Jamuna Resort, Jhunjhunu", hi: "जमुना रिसोर्ट, झुंझुनूं" },
      events: [
        { startsAt: "2026-12-12T10:15:00+05:30", time: { en: "10:15 AM", hi: "सुबह 10.15 बजे" }, icon: "haldi", name: { en: "Haldi", hi: "हल्दी" } },
        { startsAt: "2026-12-12T19:15:00+05:30", time: { en: "7:15 PM", hi: "सायं 7.15 बजे" }, icon: "varmala", name: { en: "Ashirwad Samaroh and dinner", hi: "आशीर्वाद समारोह एवं स्वरूचि भोज" }, main: true },
      ],
    },
  ],

  guests: {
    darshan: {
      title: { en: "Looking forward to seeing you", hi: "दर्शनाभिलाषी" },
      names: {
        en: ["Sangeeta & Ramakant Shah", "Kiran & Devendra Shah", "Shweta & Dr. Narendra Shah", "Dr. Pragya & Dr. Ankit Shah"],
        hi: ["संगीता – रामाकान्त शाह", "किरण – देवेन्द्र शाह", "श्वेता – डॉ. नरेन्द्र शाह", "डॉ. प्रज्ञा – डॉ. अंकित शाह"],
      },
    },
    special: {
      title: { en: "With a special request", hi: "विशेष आग्रह" },
      names: {
        en: ["Prem & Govind ji Karivala", "Sushila & Ravi Prakash ji Mittal", "Mamta & Sumit ji Udaipuria", "Nikita & Manish ji Mittal"],
        hi: ["प्रेम – गोविन्द जी कारीवाला", "सुशीला – रवि प्रकाश जी मित्तल", "ममता – सुमित जी उदयपुरिया", "निकिता – मनीष जी मित्तल"],
      },
    },
    sweet: {
      title: { en: "With sweet insistence", hi: "मीठी मनुहार" },
      names: {
        en: ["Tilak", "Mahak", "Harshit", "Mridul", "Priyanshi", "Divyam", "Chaitanya", "Naysha"],
        hi: ["तिलक", "महक", "हर्षित", "मृदुल", "प्रियांशी", "दिव्यम", "चैतन्य", "नायशा"],
      },
    },
    ladies: {
      en: "Please accept this card as the invitation for the ladies of your family too.",
      hi: "कृपया महिलाओं का निमंत्रण भी इसी पत्रिका से स्वीकार करें।",
    },
  },

  // Phone numbers from the card. "tel" is for the call button, "wa" for WhatsApp (country code + number, no +).
  contacts: [
    { display: "94600 36251", tel: "+919460036251", wa: "919460036251" },
  ],

  closing: {
    title: { en: "Awaiting your arrival", hi: "आपके आगमन की प्रतीक्षा में" },
    signed: { en: "With love, Satyanarayan Shah and the entire Shah family", hi: "विनीत : सत्यनारायण शाह एवं समस्त शाह परिवार" },
  },
};
