// Facts that appear on every page. Change them here, then run `npm run build`.
// Anything marked SAMPLE is a stand-in until the clinic confirms the real value.

export const site = {
  name: 'BelleCare',
  legalName: 'BelleCare Health and Diagnostic Center',
  tagline: 'One clinic, one visit.',
  url: 'https://bellecare.ph',

  phone: '(034) 000 0000', // SAMPLE, from the brand guide's stationery
  phoneHref: '+63340000000',
  email: 'hello@bellecare.ph',
  dohLicense: '', // e.g. '00-0000'. Shown in the footer only when filled in.

  address: {
    street: 'Lacson St., Mandalagan',
    city: 'Bacolod City',
    postal: '6100',
    region: 'Negros Occidental',
  },
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Lacson+St+Mandalagan+Bacolod+City',

  // 0 = Sunday. SAMPLE days; the brand guide gives 6 AM to 5 PM.
  hours: { days: [1, 2, 3, 4, 5, 6], open: '06:00', close: '17:00' },
  walkInCutoff: '10:00',

  // Time slots offered on the booking form.
  slots: ['6:00 – 8:00 AM', '8:00 – 10:00 AM', '10:00 AM – 12 NN', '1:00 – 3:00 PM', '3:00 – 5:00 PM'],

  // Booking requests. Leave `endpoint` empty and the form opens the visitor's email app.
  // To receive requests without an email app, paste a form endpoint (Formspree, Getform, ...).
  booking: { endpoint: '' },
};

export const nav = [
  { label: 'Services', href: 'services.html' },
  { label: 'Doctors', href: 'doctors.html' },
  { label: 'Packages', href: 'packages.html' },
  { label: 'Results', href: 'results.html' },
];
