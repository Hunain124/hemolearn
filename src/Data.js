export const BLOOD_GROUPS = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];

export const COMPAT = {
  "A+":  { recv:["A+","A-","O+","O-"],                       give:["A+","AB+"] },
  "A-":  { recv:["A-","O-"],                                 give:["A+","A-","AB+","AB-"] },
  "B+":  { recv:["B+","B-","O+","O-"],                       give:["B+","AB+"] },
  "B-":  { recv:["B-","O-"],                                 give:["B+","B-","AB+","AB-"] },
  "AB+": { recv:["A+","A-","B+","B-","AB+","AB-","O+","O-"], give:["AB+"] },
  "AB-": { recv:["A-","B-","AB-","O-"],                      give:["AB+","AB-"] },
  "O+":  { recv:["O+","O-"],                                 give:["A+","B+","AB+","O+"] },
  "O-":  { recv:["O-"],                                      give:["A+","A-","B+","B-","AB+","AB-","O+","O-"] },
};

export const BG_FACTS = {
  "O-": "Universal donor — can give to ALL 8 types. Only 7% of people have it.",
  "AB+":"Universal recipient — can receive from ALL 8 types.",
  "O+": "Most common globally (38%). Needed every 2 seconds in emergencies.",
  "A+": "Second most common (34%). High platelet demand.",
  "B+": "9% of population. Critical for South Asian communities.",
  "AB-":"Rarest type (1%). Universal plasma donor.",
  "A-": "6% of population. Vital for premature babies.",
  "B-": "2% of population. Chronic worldwide shortage.",
};

export const CRISIS_DATA = [
  { country:"Pakistan",    flag:"🇵🇰", shortage:88, needed:1.8,  have:0.22, lat:30.3,  lng:69.3  },
  { country:"Ethiopia",    flag:"🇪🇹", shortage:91, needed:0.6,  have:0.05, lat:9.1,   lng:40.5  },
  { country:"Nigeria",     flag:"🇳🇬", shortage:82, needed:1.2,  have:0.22, lat:9.1,   lng:8.7   },
  { country:"Bangladesh",  flag:"🇧🇩", shortage:75, needed:0.9,  have:0.23, lat:23.7,  lng:90.4  },
  { country:"DR Congo",    flag:"🇨🇩", shortage:89, needed:0.7,  have:0.08, lat:-4.0,  lng:21.8  },
  { country:"Tanzania",    flag:"🇹🇿", shortage:85, needed:0.45, have:0.07, lat:-6.4,  lng:34.9  },
  { country:"Uganda",      flag:"🇺🇬", shortage:83, needed:0.38, have:0.06, lat:1.4,   lng:32.3  },
  { country:"Mozambique",  flag:"🇲🇿", shortage:86, needed:0.31, have:0.04, lat:-18.7, lng:35.5  },
  { country:"Myanmar",     flag:"🇲🇲", shortage:71, needed:0.55, have:0.16, lat:19.2,  lng:96.7  },
  { country:"Afghanistan", flag:"🇦🇫", shortage:79, needed:0.42, have:0.09, lat:33.9,  lng:67.7  },
  { country:"Haiti",       flag:"🇭🇹", shortage:78, needed:0.19, have:0.04, lat:18.9,  lng:-72.3 },
  { country:"Yemen",       flag:"🇾🇪", shortage:84, needed:0.35, have:0.06, lat:15.6,  lng:48.5  },
  { country:"Sudan",       flag:"🇸🇩", shortage:80, needed:0.48, have:0.10, lat:12.9,  lng:30.2  },
  { country:"Cambodia",    flag:"🇰🇭", shortage:62, needed:0.28, have:0.11, lat:12.6,  lng:104.9 },
  { country:"Bolivia",     flag:"🇧🇴", shortage:57, needed:0.32, have:0.14, lat:-16.3, lng:-63.6 },
  { country:"Guatemala",   flag:"🇬🇹", shortage:53, needed:0.41, have:0.19, lat:15.8,  lng:-90.2 },
  { country:"Indonesia",   flag:"🇮🇩", shortage:55, needed:4.5,  have:2.0,  lat:-0.8,  lng:113.9 },
  { country:"Philippines", flag:"🇵🇭", shortage:48, needed:1.8,  have:0.94, lat:12.9,  lng:121.8 },
  { country:"India",       flag:"🇮🇳", shortage:15, needed:14.8, have:12.6, lat:20.6,  lng:78.9  },
  { country:"Brazil",      flag:"🇧🇷", shortage:8,  needed:5.5,  have:5.1,  lat:-14.2, lng:-51.9 },
  { country:"Mexico",      flag:"🇲🇽", shortage:12, needed:3.2,  have:2.8,  lat:23.6,  lng:-102.6},
  { country:"South Africa",flag:"🇿🇦", shortage:22, needed:1.9,  have:1.48, lat:-30.6, lng:22.9  },
  { country:"Turkey",      flag:"🇹🇷", shortage:9,  needed:2.8,  have:2.55, lat:38.9,  lng:35.2  },
  { country:"Iran",        flag:"🇮🇷", shortage:6,  needed:2.4,  have:2.26, lat:32.4,  lng:53.7  },
  { country:"China",       flag:"🇨🇳", shortage:4,  needed:24.0, have:23.0, lat:35.9,  lng:104.2 },
  { country:"Japan",       flag:"🇯🇵", shortage:3,  needed:5.2,  have:5.04, lat:36.2,  lng:138.3 },
  { country:"UK",          flag:"🇬🇧", shortage:2,  needed:4.0,  have:3.92, lat:55.4,  lng:-3.4  },
  { country:"Germany",     flag:"🇩🇪", shortage:1,  needed:4.2,  have:4.16, lat:51.2,  lng:10.5  },
  { country:"France",      flag:"🇫🇷", shortage:2,  needed:3.8,  have:3.72, lat:46.2,  lng:2.2   },
  { country:"USA",         flag:"🇺🇸", shortage:2,  needed:6.8,  have:6.66, lat:37.1,  lng:-95.7 },
];

export const CASES = [
  { diff:"Beginner",     tag:"ABO Compatibility",        q:"7-year-old thalassemia patient (B+) needs blood urgently. Stock: B+, O+, O−. Which first?", opts:["O− — universal donor","B+ — same group, safest","O+ — works for B+","Any of these"], ans:1, explain:"B+ is ideal — same ABO and Rh eliminates all risks. O+ works but risks Rh alloimmunization. O− reserved for unknowns." },
  { diff:"Beginner",     tag:"Universal Donor",           q:"Unconscious trauma patient arrives. No time for blood typing. Protocol?", opts:["Wait 10 min for typing","Give AB+","Give O−","Give O+ to save O−"], ans:2, explain:"O− is the universal donor — safe for ALL types without prior testing. In life-threatening emergencies, O− is given immediately." },
  { diff:"Intermediate", tag:"Rh Factor",                 q:"Pregnant O− woman, husband O+, 28 weeks pregnant. Critical intervention?", opts:["Nothing — same ABO","Anti-D (RhoGAM) injection","Emergency C-section","Fetal blood typing"], ans:1, explain:"If baby inherited O+, mother creates Anti-D antibodies destroying fetal RBCs. RhoGAM at 28 weeks prevents Hemolytic Disease of the Newborn." },
  { diff:"Intermediate", tag:"Blood Components",          q:"Hemophilia A patient (A+) is bleeding. What do you transfuse?", opts:["Whole blood A+","Packed RBCs","Fresh Frozen Plasma (FFP)","Platelet concentrate"], ans:2, explain:"Hemophilia A = Factor VIII deficiency. Treatment is FFP or Factor VIII concentrate, not RBCs. Modern medicine uses component therapy." },
  { diff:"Intermediate", tag:"Crossmatching",             q:"Lab finds unexpected antibody in A+ patient. Next step before transfusion?", opts:["Transfuse A+ immediately","Full crossmatch with donor blood","Give O− to be safe","Cancel transfusion"], ans:1, explain:"Unexpected alloantibodies form after transfusions/pregnancies. Full crossmatch mixes patient serum + donor RBCs to detect reactions BEFORE transfusion." },
  { diff:"Advanced",     tag:"Mass Casualty Protocol",    q:"40 trauma patients, no typing time. Stock: 20 O−, 30 O+. Protocol?", opts:["O− to everyone","O+ to all adults","O+ to males/older women, O− to females <50 + children","Type everyone first"], ans:2, explain:"O− (rare) conserved for women of childbearing age and children. O+ safe for males and post-menopausal women. Never delay life-saving transfusion in MCI." },
  { diff:"Advanced",     tag:"Transfusion Reaction",      q:"Minutes after transfusion: fever, chills, back pain, dark urine. What's happening?", opts:["Allergic — antihistamine + continue","Febrile non-hemolytic — slow drip","Acute hemolytic reaction — STOP immediately","Normal — monitor and continue"], ans:2, explain:"Dark urine + back pain + fever = ACUTE HEMOLYTIC REACTION — medical emergency. Stop immediately, IV fluids to protect kidneys. Can be fatal." },
  { diff:"Advanced",     tag:"Prophylactic Transfusion",  q:"Leukemia patient post-chemo: platelets 8,000/μL (normal 150,000+). Not bleeding. Transfuse?", opts:["No — only if actively bleeding","Yes — prophylactic at <10,000/μL is standard","Yes, only O+ matched","Wait until 5,000/μL"], ans:1, explain:"At 8,000/μL, spontaneous intracranial hemorrhage risk is real even without trauma. Prophylactic transfusion at <10,000/μL is standard protocol." },
];

export async function askClaude(messages, system) {
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, system, messages }),
    });
    const d = await r.json();
    return d.content?.[0]?.text || "Could not get response.";
  } catch { return "Network error. Please try again."; }
}
