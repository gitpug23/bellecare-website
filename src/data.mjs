// Doctors, tests and packages. Everything the site lists comes from this file.
//
// SAMPLE CONTENT: apart from the Annual Physical Exam Package (₱1,450) and
// Dra. Villanueva's Tuesday/Thursday schedule, which come from the brand guide,
// the names, prices, prep notes and schedules below are stand-ins. Replace them
// with the clinic's real figures before publishing. `npm run build` lists what
// is still sample.

export const sampleNotes = [
  'Doctors other than Dra. Villanueva, and all doctor schedules except hers',
  'Every test price, prep note and result wait time',
  'Package contents and prices (except the Annual Physical Exam Package at ₱1,450)',
  'Clinic days (Monday to Saturday) and the phone number',
];

export const doctors = [
  {
    id: 'villanueva',
    name: 'Dra. Ma. Lourdes Villanueva',
    short: 'Dra. Villanueva',
    specialty: 'Internal Medicine',
    slug: 'internal-medicine',
    for: 'Adult check-ups, blood pressure, diabetes and medical certificates.',
    schedule: [{ days: [2, 4], from: '09:00', to: '12:00' }],
    fee: 500,
    consult: true,
  },
  {
    id: 'ledesma',
    name: 'Dra. Katrina Joy Ledesma',
    short: 'Dra. Ledesma',
    specialty: 'OB-GYN',
    slug: 'ob-gyn',
    for: 'Prenatal care, pelvic exams and women’s health check-ups.',
    schedule: [{ days: [1, 3, 5], from: '13:00', to: '16:00' }],
    room: '206',
    fee: 600,
    consult: true,
  },
  {
    id: 'arcenas',
    name: 'Dr. Paolo Jericho Arcenas',
    short: 'Dr. Arcenas',
    specialty: 'Pediatrics',
    slug: 'pediatrics',
    for: 'Check-ups, vaccinations and school clearances for children.',
    schedule: [
      { days: [1, 3, 5], from: '09:00', to: '12:00' },
      { days: [6], from: '09:00', to: '11:00' },
    ],
    fee: 500,
    consult: true,
  },
  {
    id: 'sarabia',
    name: 'Dr. Eduardo M. Sarabia',
    short: 'Dr. Sarabia',
    specialty: 'Radiology',
    slug: 'radiology',
    for: 'Reads your X-ray and ultrasound. Ask the front desk when your images are ready.',
    schedule: [{ days: [1, 2, 3, 4, 5, 6], from: '08:00', to: '15:00' }],
    room: '204',
    consult: false,
  },
];

// Groups shown on the Services page, in order. Consult rows are generated from `doctors`.
export const groups = [
  {
    id: 'laboratory',
    name: 'Laboratory',
    summary: 'CBC, chemistry, urinalysis, drug testing.',
    intro: 'Blood, urine and stool tests. Walk in before 10 AM and most results are released the same afternoon.',
    plate: { title: 'Blood Extraction', detail: 'Room 201 · 6:00 AM – 5:00 PM' },
    prepLabel: 'Before you come',
    items: [
      { id: 'cbc', name: 'CBC (complete blood count)', price: 200, prep: 'No fasting', results: 'Same afternoon' },
      { id: 'urinalysis', name: 'Urinalysis', price: 100, prep: 'No fasting', results: 'Same afternoon' },
      { id: 'fecalysis', name: 'Fecalysis', price: 100, prep: 'Bring a sample', results: 'Same afternoon' },
      { id: 'fbs', name: 'Fasting blood sugar', price: 150, prep: 'Fasting starts at 10 PM', results: 'Same afternoon' },
      { id: 'lipid', name: 'Lipid profile', price: 650, prep: 'Fasting starts at 10 PM', results: 'Same afternoon' },
      { id: 'creatinine', name: 'Creatinine', price: 200, prep: 'No fasting', results: 'Same afternoon' },
      { id: 'uric-acid', name: 'Uric acid', price: 180, prep: 'No fasting', results: 'Same afternoon' },
      { id: 'sgpt', name: 'SGPT (ALT)', price: 250, prep: 'No fasting', results: 'Same afternoon' },
      { id: 'hba1c', name: 'HbA1c', price: 750, prep: 'No fasting', results: 'Next day' },
      { id: 'drug-test', name: 'Drug test (urine)', price: 450, prep: 'Bring a valid ID', results: 'Same afternoon' },
      { id: 'pregnancy-test', name: 'Pregnancy test (urine)', price: 150, prep: 'No fasting', results: 'Same afternoon' },
    ],
  },
  {
    id: 'imaging',
    name: 'Imaging',
    summary: 'X-ray, ultrasound, ECG.',
    intro: 'X-ray and ultrasound are in Room 204 on the second floor.',
    plate: { title: 'X-Ray & Ultrasound', detail: 'Room 204' },
    prepLabel: 'Before you come',
    items: [
      { id: 'xray-chest', name: 'Chest X-ray (PA)', price: 400, prep: 'No preparation', results: 'Same afternoon' },
      { id: 'ecg', name: 'ECG (12-lead)', price: 400, prep: 'No preparation', results: 'Same afternoon' },
      { id: 'us-abdomen', name: 'Ultrasound, whole abdomen', price: 1200, prep: 'Fast for 8 hours', results: 'Same afternoon' },
      { id: 'us-pelvic', name: 'Ultrasound, pelvic', price: 900, prep: 'Full bladder. Ask us how.', results: 'Same afternoon' },
      { id: 'us-kub', name: 'Ultrasound, kidneys and bladder', price: 800, prep: 'Full bladder. Ask us how.', results: 'Same afternoon' },
    ],
  },
  {
    id: 'consults',
    name: 'Consults',
    summary: 'Internal medicine, OB-GYN, pediatrics.',
    intro: 'Check who is in on the Doctors page. Fees are per visit.',
    prepLabel: 'Schedule',
    items: [], // built from `doctors` with consult: true
  },
  {
    id: 'certificates',
    name: 'Certificates',
    summary: 'Pre-employment, OFW and school clearances.',
    intro: 'Medical certificates are issued from Room 210. Ask us which tests your employer, school or agency needs before you pay.',
    plate: { title: 'Medical Certificates', detail: 'Room 210' },
    prepLabel: 'Before you come',
    items: [
      { id: 'cert-medical', name: 'Medical certificate', price: 300, prep: 'Bring a valid ID', results: 'Same visit' },
      { id: 'cert-school', name: 'School clearance', price: 550, prep: 'Bring your school form', results: 'Same afternoon' },
      { id: 'cert-preemployment', name: 'Pre-employment medical', price: 950, prep: 'Bring your employer’s form', results: 'Same afternoon' },
      { id: 'cert-ofw', name: 'OFW clearance', price: null, prep: 'Depends on your agency', results: 'Ask us', note: 'Price depends on your agency’s requirements. Call before you come.' },
    ],
  },
];

export const packages = [
  {
    id: 'annual-physical',
    name: 'Annual Physical Exam Package',
    price: 1450,
    includes: ['CBC', 'Urinalysis', 'Chest X-ray', 'ECG', 'Internal medicine consult'],
    blurb: 'CBC, urinalysis, chest X-ray, ECG and consult.',
    featured: true,
  },
  {
    id: 'pre-employment',
    name: 'Pre-employment Medical',
    price: 950,
    includes: ['CBC', 'Urinalysis', 'Fecalysis', 'Chest X-ray', 'Physical exam and medical certificate'],
    blurb: 'CBC, urinalysis, fecalysis, chest X-ray and certificate.',
  },
  {
    id: 'womens-health',
    name: 'Women’s Health Check',
    price: 1650,
    includes: ['CBC', 'Urinalysis', 'Pelvic ultrasound', 'OB-GYN consult'],
    blurb: 'CBC, urinalysis, pelvic ultrasound and OB-GYN consult.',
  },
  {
    id: 'sugar-cholesterol',
    name: 'Sugar and Cholesterol Panel',
    price: 1650,
    includes: ['Fasting blood sugar', 'HbA1c', 'Lipid profile', 'Creatinine', 'Uric acid'],
    blurb: 'Fasting blood sugar, HbA1c, lipid profile, creatinine and uric acid.',
    prep: 'Fasting starts at 10 PM',
  },
  {
    id: 'school-clearance',
    name: 'School Clearance Package',
    price: 550,
    includes: ['CBC', 'Urinalysis', 'Fecalysis', 'Physical exam and certificate'],
    blurb: 'CBC, urinalysis, fecalysis and certificate.',
  },
];

// Second-floor directory, from the brand guide's signage page.
export const directory = {
  floor: '2',
  floorName: 'Second floor',
  rooms: [
    { name: 'Laboratory', room: '201' },
    { name: 'X-Ray & Ultrasound', room: '204' },
    { name: 'Women’s Health', room: '206' },
    { name: 'Medical Certificates', room: '210' },
  ],
};
