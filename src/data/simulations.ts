export interface Simulation {
  id: string;
  title: string;
  description: string;
  locked: boolean;
  cbc?: string;
  cmp?: string;
  ekg?: string;
  xr?: string;
  ct?: string;
  bloodGas?: string;
  ultrasound?: string;
  assignedTo?: "student" | "admin" | "all";
}

export const simulations = [
  {
    id: "1",
    title: "Test Sim 1",
    description: "Patient details...",
    locked: false,
    cbc: "WBC 11.2, Hgb 13.9, Platelets 210",
    cmp: "Na 138, K 4.1, Cr 1.0, AST 22, ALT 25",
    ekg: "ST elevations in leads II, III, aVF",
    xr: "Normal cardiac silhouette",
    ct: "No acute intracranial abnormality",
    bloodGas: "pH 7.32, pCO2 48, pO2 70",
    ultrasound: "Normal LV function",
    assignedTo: "student",
  },
  {
    id: "2",
    title: "Stroke Workup",
    description: "68-year-old female with weakness",
    locked: true,
    cbc: "Pending",
    cmp: "Pending",
    ekg: "Normal sinus rhythm",
    xr: "Normal",
    ct: "Left MCA infarct",
    bloodGas: "Normal",
    ultrasound: "Carotid stenosis 70%",
    assignedTo: "admin",
  },
  {
    id: "3",
    title: "Emergency Trauma",
    description: "Multiple injuries, adult male",
    locked: false,
    assignedTo: "all",
  },
];
