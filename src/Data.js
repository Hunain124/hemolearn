export const BLOOD_GROUPS = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];

export const COMPAT = {
  "A+":  { recv: ["A+","A-","O+","O-"], give: ["A+","AB+"] },
  "A-":  { recv: ["A-","O-"],           give: ["A+","A-","AB+","AB-"] },
  "B+":  { recv: ["B+","B-","O+","O-"], give: ["B+","AB+"] },
  "B-":  { recv: ["B-","O-"],           give: ["B+","B-","AB+","AB-"] },
  "AB+": { recv: ["A+","A-","B+","B-","AB+","AB-","O+","O-"], give: ["AB+"] },
  "AB-": { recv: ["A-","B-","AB-","O-"], give: ["AB+","AB-"] },
  "O+":  { recv: ["O+","O-"],           give: ["A+","B+","AB+","O+"] },
  "O-":  { recv: ["O-"],               give: ["A+","A-","B+","B-","AB+","AB-","O+","O-"] },
};

export const BG_FACTS = {
  "O-":  "Universal donor — can give to ALL 8 blood types. Only 7% of people have it.",
  "AB+": "Universal recipient — can receive from ALL 8 blood types. Rarest compatible receiver.",
  "O+":  "Most common blood type globally (38%). Needed every 2 seconds in emergencies.",
  "A+":  "Second most common (34%). High demand for platelets from A+ donors.",
  "B+":  "9% of population. Critical for South Asian and African-American communities.",
  "AB-": "Rarest blood type (1%). Universal plasma donor — plasma saves burn victims.",
  "A-":  "6% of population. Vital for premature babies and immune-deficient patients.",
  "B-":  "2% of population. Extremely rare — chronic shortage worldwide.",
};

export const CRISIS_DATA = [
  { country:"Pakistan",   shortage:88, needed:1.8,  have:0.22, flag:"🇵🇰" },
  { country:"Ethiopia",   shortage:91, needed:0.6,  have:0.05, flag:"🇪🇹" },
  { country:"Nigeria",    shortage:82, needed:1.2,  have:0.22, flag:"🇳🇬" },
  { country:"Bangladesh", shortage:75, needed:0.9,  have:0.23, flag:"🇧🇩" },
  { country:"Indonesia",  shortage:55, needed:4.5,  have:2.0,  flag:"🇮🇩" },
  { country:"India",      shortage:15, needed:14.8, have:12.6, flag:"🇮🇳" },
  { country:"Brazil",     shortage:8,  needed:5.5,  have:5.1,  flag:"🇧🇷" },
  { country:"Germany",    shortage:1,  needed:4.2,  have:4.16, flag:"🇩🇪" },
  { country:"USA",        shortage:2,  needed:6.8,  have:6.66, flag:"🇺🇸" },
];

export const CASES = [
  { 
    title: "The Trauma Arrival", 
    desc: "A patient arrives at Civil Hospital Karachi after a road accident. Blood type unknown. What do you give?", 
    opts: ["A+", "O-", "AB+", "B-"], 
    ans: "O-", 
    explain: "O- is the universal donor. In extreme emergencies when there's no time to cross-match, O- is used." 
  },
  { 
    title: "The Rarest Match", 
    desc: "A patient with AB- needs a transfusion. Which of these can they NOT receive?", 
    opts: ["A-", "O-", "B+", "B-"], 
    ans: "B+", 
    explain: "Negative blood types can only receive from other negative types. Positive blood would cause a reaction." 
  }
];