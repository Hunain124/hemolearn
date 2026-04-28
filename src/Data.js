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

export const FACTS = {
  "O-":  "Universal donor — gives to ALL 8 types. Only 7% of people worldwide.",
  "AB+": "Universal recipient — receives from ALL 8 blood types.",
  "O+":  "Most common globally (38%). Needed every 2 seconds in emergencies.",
  "A+":  "Second most common (34%). High demand for platelet donation.",
  "B+":  "9% of population. Critical for South Asian communities.",
  "AB-": "Rarest type (1%). Universal plasma donor for burn victims.",
  "A-":  "6% of population. Vital for premature babies.",
  "B-":  "2% of population. Extreme chronic worldwide shortage.",
};

export const CRISIS = [
  { c:"Pakistan",    f:"🇵🇰", s:88, need:1.8,  have:0.22, lat:30.3,  lng:69.3,  region:"Asia"     },
  { c:"Ethiopia",    f:"🇪🇹", s:91, need:0.6,  have:0.05, lat:9.1,   lng:40.5,  region:"Africa"   },
  { c:"Nigeria",     f:"🇳🇬", s:82, need:1.2,  have:0.22, lat:9.1,   lng:8.7,   region:"Africa"   },
  { c:"Bangladesh",  f:"🇧🇩", s:75, need:0.9,  have:0.23, lat:23.7,  lng:90.4,  region:"Asia"     },
  { c:"DR Congo",    f:"🇨🇩", s:89, need:0.7,  have:0.08, lat:-4.0,  lng:21.8,  region:"Africa"   },
  { c:"Tanzania",    f:"🇹🇿", s:85, need:0.45, have:0.07, lat:-6.4,  lng:34.9,  region:"Africa"   },
  { c:"Uganda",      f:"🇺🇬", s:83, need:0.38, have:0.06, lat:1.4,   lng:32.3,  region:"Africa"   },
  { c:"Mozambique",  f:"🇲🇿", s:86, need:0.31, have:0.04, lat:-18.7, lng:35.5,  region:"Africa"   },
  { c:"Myanmar",     f:"🇲🇲", s:71, need:0.55, have:0.16, lat:19.2,  lng:96.7,  region:"Asia"     },
  { c:"Afghanistan", f:"🇦🇫", s:79, need:0.42, have:0.09, lat:33.9,  lng:67.7,  region:"Asia"     },
  { c:"Haiti",       f:"🇭🇹", s:78, need:0.19, have:0.04, lat:18.9,  lng:-72.3, region:"Americas" },
  { c:"Yemen",       f:"🇾🇪", s:84, need:0.35, have:0.06, lat:15.6,  lng:48.5,  region:"MidEast"  },
  { c:"Sudan",       f:"🇸🇩", s:80, need:0.48, have:0.10, lat:12.9,  lng:30.2,  region:"Africa"   },
  { c:"Cambodia",    f:"🇰🇭", s:62, need:0.28, have:0.11, lat:12.6,  lng:104.9, region:"Asia"     },
  { c:"Bolivia",     f:"🇧🇴", s:57, need:0.32, have:0.14, lat:-16.3, lng:-63.6, region:"Americas" },
  { c:"Guatemala",   f:"🇬🇹", s:53, need:0.41, have:0.19, lat:15.8,  lng:-90.2, region:"Americas" },
  { c:"Indonesia",   f:"🇮🇩", s:55, need:4.5,  have:2.0,  lat:-0.8,  lng:113.9, region:"Asia"     },
  { c:"Philippines", f:"🇵🇭", s:48, need:1.8,  have:0.94, lat:12.9,  lng:121.8, region:"Asia"     },
  { c:"India",       f:"🇮🇳", s:15, need:14.8, have:12.6, lat:20.6,  lng:78.9,  region:"Asia"     },
  { c:"Brazil",      f:"🇧🇷", s:8,  need:5.5,  have:5.1,  lat:-14.2, lng:-51.9, region:"Americas" },
  { c:"Mexico",      f:"🇲🇽", s:12, need:3.2,  have:2.8,  lat:23.6,  lng:-102.6,region:"Americas" },
  { c:"South Africa",f:"🇿🇦", s:22, need:1.9,  have:1.48, lat:-30.6, lng:22.9,  region:"Africa"   },
  { c:"Turkey",      f:"🇹🇷", s:9,  need:2.8,  have:2.55, lat:38.9,  lng:35.2,  region:"Europe"   },
  { c:"Iran",        f:"🇮🇷", s:6,  need:2.4,  have:2.26, lat:32.4,  lng:53.7,  region:"MidEast"  },
  { c:"China",       f:"🇨🇳", s:4,  need:24.0, have:23.0, lat:35.9,  lng:104.2, region:"Asia"     },
  { c:"Japan",       f:"🇯🇵", s:3,  need:5.2,  have:5.04, lat:36.2,  lng:138.3, region:"Asia"     },
  { c:"UK",          f:"🇬🇧", s:2,  need:4.0,  have:3.92, lat:55.4,  lng:-3.4,  region:"Europe"   },
  { c:"Germany",     f:"🇩🇪", s:1,  need:4.2,  have:4.16, lat:51.2,  lng:10.5,  region:"Europe"   },
  { c:"France",      f:"🇫🇷", s:2,  need:3.8,  have:3.72, lat:46.2,  lng:2.2,   region:"Europe"   },
  { c:"USA",         f:"🇺🇸", s:2,  need:6.8,  have:6.66, lat:37.1,  lng:-95.7, region:"Americas" },
];

export const CASES = [
  { diff:"Beginner",     tag:"ABO Compatibility",       q:"Emergency: 7-year-old thalassemia patient (B+) needs blood urgently. Stock: B+, O+, O−. Which do you give first?",                  opts:["O− — universal donor","B+ — same group, ideal match","O+ — compatible for B+","Any works, no difference"],                                   ans:1, explain:"B+ is the ideal choice — identical ABO group and Rh type eliminates all compatibility risks. O+ works but repeated transfusions risk Rh alloimmunization. O− conserved for blood-type-unknown emergencies." },
  { diff:"Beginner",     tag:"Universal Donor",          q:"Unconscious trauma patient arrives. No time for blood typing. Your protocol?",                                                        opts:["Wait 10 minutes for typing","Give AB+ (universal recipient)","Give O− (universal donor)","Give O+ to conserve O−"],                           ans:2, explain:"O− is the universal donor — safe for ALL 8 blood types without prior testing. In life-threatening emergencies, O− is given immediately. It's the global standard for unknown-type emergency transfusion." },
  { diff:"Intermediate", tag:"Rh Factor",                q:"Pregnant O− woman. Husband is O+. She's 28 weeks pregnant. What critical intervention is needed?",                                    opts:["Nothing — same ABO group","Anti-D immunoglobulin (RhoGAM) injection","Emergency C-section preparation","Immediate fetal blood typing"],           ans:1, explain:"If baby inherited O+ from father, mother creates Anti-D antibodies destroying fetal RBCs — Hemolytic Disease of Newborn. RhoGAM at 28 weeks prevents sensitization." },
  { diff:"Intermediate", tag:"Blood Components",         q:"Hemophilia A patient (A+) is actively bleeding. What do you transfuse?",                                                              opts:["Whole blood A+","Packed Red Blood Cells","Fresh Frozen Plasma / Factor VIII","Platelet concentrate"],                                             ans:2, explain:"Hemophilia A = Factor VIII deficiency. Treatment is FFP or Factor VIII concentrate — NOT RBCs. Modern transfusion medicine uses component therapy targeting specific deficiencies." },
  { diff:"Intermediate", tag:"Crossmatching",            q:"Lab detects an unexpected antibody in an A+ patient before surgery. Next step?",                                                      opts:["Transfuse A+ immediately","Full crossmatch with donor blood","Give O− to be safe","Cancel transfusion"],                                           ans:1, explain:"Unexpected alloantibodies form after previous transfusions or pregnancies. Full crossmatch mixes patient serum with donor RBCs to detect reactions BEFORE transfusion — the critical final safety check." },
  { diff:"Advanced",     tag:"Mass Casualty Protocol",   q:"40 trauma patients arrive simultaneously. Stock: 20 O−, 30 O+, limited A+/B+. No typing time. Protocol?",                          opts:["O− to everyone","O+ to all adults","O+ to males/older women · O− to females <50 + children","Type everyone first"],                           ans:2, explain:"O− (rare) conserved for women of childbearing age and children — Rh sensitization devastates future pregnancies. O+ given to males and post-menopausal women. Never delay transfusion in mass casualty." },
  { diff:"Advanced",     tag:"Transfusion Reaction",     q:"Minutes after transfusion starts: fever, chills, severe back pain, dark urine. What's happening?",                                   opts:["Allergic — antihistamine + continue","Febrile non-hemolytic — slow drip","Acute hemolytic reaction — STOP IMMEDIATELY","Normal — monitor"],       ans:2, explain:"Dark urine + back pain + fever = ACUTE HEMOLYTIC TRANSFUSION REACTION. Stop immediately, aggressive IV fluids to protect kidneys. ABO mismatch can be fatal." },
  { diff:"Advanced",     tag:"Prophylactic Transfusion", q:"Leukemia patient post-chemo: platelets 8,000/μL (normal 150,000+). Not actively bleeding. Do you transfuse?",                      opts:["No — transfuse only if bleeding","Yes — prophylactic at <10,000/μL is standard","Yes, but O+ matched only","Wait until 5,000/μL"],               ans:1, explain:"At 8,000/μL, spontaneous intracranial hemorrhage risk is real even without trauma. Prophylactic transfusion at <10,000/μL is standard protocol worldwide." },
];

// ── CLAUDE API — direct browser call with required header ────────
export async function askClaude(messages, system) {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system,
        messages,
      }),
    });
    const d = await res.json();
    if (d.error) return `Error: ${d.error.message}`;
    return d.content?.[0]?.text || "No response.";
  } catch (e) {
    return `Network error: ${e.message}`;
  }
}
