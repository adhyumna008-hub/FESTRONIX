export const edition = { label: '2K27', dates: 'October 18–19, 2027', college: 'Vardhaman College of Engineering', location: 'Hyderabad, India', tagline: 'Build. Break. Discover.' };
export const events = [
  {id:'quantum',number:'01',title:'Quantum Game Development Challenge',category:'Code',format:'Team · 2–4',day:18,time:'09:05 AM',venue:'Innovation Lab',fee:'₹300 / team',prize:'₹1,25,000',status:'Open',description:'Turn an unexpected idea into a playable world. Build a prototype with inventive mechanics, then show us what makes it impossible to put down.',rules:'Students from recognized colleges. Teams of 2–4. Bring a laptop; starter assets and a challenge prompt are provided. This is fictional prototype content.'},
  {id:'robot',number:'02',title:'RoboRumble',category:'Build',format:'Team · 2–5',day:18,time:'11:30 AM',venue:'Engineering Arena',fee:'₹500 / team',prize:'₹80,000',status:'Open',description:'Precision meets controlled chaos. Design a robot, tune your strategy and put your engineering instincts to the test in the arena.',rules:'Teams of 2–5. Safety inspection required before arena entry. Equipment limits would be published by faculty for a real event.'},
  {id:'signal',number:'03',title:'Signal / Noise',category:'Discover',format:'Solo workshop',day:19,time:'10:00 AM',venue:'Design Studio',fee:'Free',prize:'Learning lab',status:'Waitlist available',description:'Make sense of the signals around you. An exploratory workshop in creative electronics, sensors and making things respond.',rules:'Bring curiosity; workshop equipment is provided. Attendance-based certificates would require an approved event policy. No certificate promise is made by this demo.'}
];
export type FestivalEvent = typeof events[number];
export const faqs = [
 ['Who can take part?', 'Students from Vardhaman and other recognized colleges and universities may participate, subject to each event’s approved eligibility rules. The events on this page are fictional samples.'],
 ['Is there a general fest pass?', 'No. Events have individual free or paid registration. This visual prototype does not accept registrations or money.'],
 ['How would paid registration work?', 'The planned platform uses event-specific payment instructions and proof review by assigned coordinators, with faculty oversight. Uploading proof is not confirmed admission. No payment workflow is connected here.'],
 ['Can I change my team?', 'Each event sets its team-size and change deadline. Material changes after the deadline need authorized coordinator or faculty handling.'],
 ['Will I receive a certificate?', 'Only if the event has a faculty-approved certificate policy and you meet its participation or outcome requirements. Registration alone does not earn one.'],
 ['Where can I get help?', 'A real edition will publish a monitored help desk, coverage hours and duty-faculty contact. The help section here is a local visual demonstration.']
];
