/**
 * Single source of truth for the Pindrop Entertainment V3 site.
 *
 * Every fact here is carried over from the verified research base built for V2
 * (see Website-V2/RESEARCH_FACT_BASE.md) and re-checked against public sources —
 * the YouTube channel, the Amazon author store, and each video's own page.
 *
 * Nothing rendered from this file carries a "last updated" date, so the site can
 * sit untouched without reading as stale. Counts in STATS are written open-ended
 * (`9.9K+`) for the same reason; the footer year is generated at page load.
 */

export const SITE = {
  name: 'Pindrop Entertainment',
  shortName: 'Pindrop',
  domain: 'pindropentertainment.com',
  url: 'https://pindropentertainment.com',
  tagline: 'Independent entertainment, built around story.',
  description:
    'Pindrop Entertainment is an independent entertainment company developing narrative-driven work across film, video, screenwriting, books, audio, and experiments.',
  location: 'Rochester, New York',
  /**
   * No public inbox is published: enquiries route through the company and
   * founder profiles instead. To publish an address later, set this to the
   * address and the contact page will surface it as the primary channel.
   */
  email: '',
  copyrightYear: 2026,
};

export const NAV = [
  { label: 'Work', href: 'work.html' },
  { label: 'Books', href: 'books.html' },
  { label: 'Studio', href: 'studio.html' },
  { label: 'Contact', href: 'contact.html' },
];

export const SOCIAL = [
  { label: 'YouTube', url: 'https://youtube.com/@PindropMedia', handle: '@PindropMedia' },
  {
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/company/pindrop-entertainment',
    handle: 'pindrop-entertainment',
  },
  {
    label: 'Bluesky',
    url: 'https://bsky.app/profile/pindropentertain.bsky.social',
    handle: 'pindropentertain',
  },
  { label: 'TikTok', url: 'https://www.tiktok.com/@pindrop.entertain', handle: '@pindrop.entertain' },
  { label: 'X', url: 'https://twitter.com/PindropENT', handle: '@PindropENT' },
];

/** Headline numbers, snapshotted rather than live. */
export const STATS = [
  { value: '9.9K+', label: 'YouTube subscribers' },
  { value: '300+', label: 'Videos published' },
  { value: '650K+', label: 'Lifetime views' },
  { value: '10', label: 'Published books' },
  { value: '32', label: 'Podcast episodes' },
];

/** Marquee strip — public, verifiable recognitions only. */
export const RECOGNITION = [
  'Runway Daily Challenge — Winner, Day 751',
  'Runway Daily Challenge — Winner, Day 701',
  'Runway Daily Challenge — Winner, Day 651',
  'Runway Daily Challenge — Winner, Day 617',
  'Gen:48 — Official Submission',
  'Global AI Film Hack — Selected Work',
  "Runway Big Pitch Contest — Shows That Don’t Exist",
  'Runway Big Ad Contest — Entrant',
];

export const CATEGORIES = [
  { id: 'all', label: 'All work' },
  { id: 'film-video', label: 'Film & video' },
  { id: 'audio', label: 'Audio' },
  { id: 'experiments', label: 'Experiments' },
];

export const PROJECTS = [
  {
    slug: 'unwanted',
    title: 'UNWANTED',
    subtitle: 'Season 1',
    category: 'film-video',
    format: 'Narrative series',
    formatLong: 'AI-assisted narrative series',
    year: '2026',
    status: 'Season 1 in release',
    image: 'assets/media/projects/unwanted.jpg',
    youtubeId: '4zFD2tNB-Mw',
    short:
      'A narrative series about the people and things the world has decided it does not want — written and directed by both founders.',
    synopsis: [
      'UNWANTED is Pindrop’s flagship narrative series, written and directed by Eugene Mont and Thomas Muller. Across a teaser and a run of released episodes it follows characters pushed to the edge of the world that made them — soldiers, survivors, and machines that outlived their purpose.',
      'The series is produced with AI-assisted tools under the pair’s direct creative control. Every story beat, cut, and line of dialogue is authored by its credited writer-directors; the tools shorten the distance between the script and the screen, never the decisions.',
    ],
    credits: [
      { role: 'Written & Directed', name: 'Eugene Mont' },
      { role: 'Written & Directed', name: 'Thomas Muller' },
      { role: 'Produced', name: 'Pindrop Entertainment' },
    ],
    episodes: [
      {
        title: 'The Battle Above Jaisian',
        date: 'April 2026',
        youtubeId: 'ZI9-YuIsR58',
        image: 'assets/media/videos/unwanted-battle-above-jaisian.jpg',
      },
      { title: 'Is she worthy?', date: 'May 2026', youtubeId: '1KcBIYEErn0', image: '' },
      { title: 'Java Island', date: 'May 2026', youtubeId: 'DIw5uQhhNzc', image: '' },
    ],
    links: [
      { label: 'Watch the teaser', url: 'https://www.youtube.com/watch?v=4zFD2tNB-Mw' },
      { label: 'Full series on YouTube', url: 'https://www.youtube.com/@PindropMedia' },
    ],
    ai: true,
    aiNote:
      'Produced with AI-assisted tools — Runway and Seedance are referenced in the public credits — under the written-and-directed creative control of Eugene Mont and Thomas Muller.',
    featured: 1,
    order: 10,
  },
  {
    slug: 'prophecy-of-nightmares',
    title: 'The Prophecy of Nightmares',
    subtitle: '',
    category: 'film-video',
    format: 'Concept trailer',
    formatLong: 'Horror anthology — concept trailer',
    year: '2026',
    status: 'Concept trailer',
    image: 'assets/media/projects/prophecy-of-nightmares.jpg',
    youtubeId: 'R1KPdIur2Zk',
    short:
      'Thomas Muller’s linked horror stories cut into a trailer for the anthology series they are waiting to become.',
    synopsis: [
      'The Prophecy of Nightmares adapts the creeping dread of Thomas Muller’s short fiction into a trailer for a series that does not exist yet. It was built for Runway’s Big Pitch Contest for Shows That Don’t Exist.',
      'It is the clearest statement of how Pindrop works: a published book, already written and sold, becomes a visual pitch that can be watched rather than described — the company’s page-to-screen pipeline running end to end.',
    ],
    credits: [
      { role: 'Stories', name: 'Thomas Muller' },
      { role: 'Produced', name: 'Pindrop Entertainment' },
    ],
    links: [
      { label: 'Watch the trailer', url: 'https://www.youtube.com/watch?v=R1KPdIur2Zk' },
      { label: 'Read the book', url: 'https://www.amazon.com/dp/1674446837' },
    ],
    relatedBook: 'prophecy-of-nightmares',
    ai: true,
    aiNote:
      'Produced with AI-assisted tools; Runway, Kling, and Suno are referenced in the trailer’s public credits.',
    featured: 2,
    order: 20,
  },
  {
    slug: 'pindrop-perspectives',
    title: 'Pindrop Perspectives',
    subtitle: '',
    category: 'audio',
    format: 'Podcast',
    year: '2025',
    status: 'Season 1 · 32 episodes',
    image: 'assets/media/projects/pindrop-perspectives.jpg',
    /** Square show artwork: give it its own square block on the detail page. */
    imageFit: 'contain',
    youtubeId: '',
    short:
      'The founders’ own show — 32 episodes on screenwriting, filmmaking, and moving a story between formats.',
    synopsis: [
      'Pindrop Perspectives is the company thinking out loud. Across 32 episodes of Season 1, Eugene Mont and Thomas Muller walk through screenplays, shelved pilots, horror shorts, and the unproduced work that shaped everything since — from a Batman series that was never made to a crime anthology built out of three linked shorts.',
      'The season also experimented with AI co-hosts, “Mark and Jen,” an early and deliberately playful use of the tools the company now builds with.',
    ],
    credits: [
      { role: 'Co-host', name: 'Eugene Mont' },
      { role: 'Co-host', name: 'Thomas Muller' },
    ],
    links: [
      { label: 'Spotify', url: 'https://open.spotify.com/show/4nynxZkGwYRsflfgpADvBN' },
      {
        label: 'Apple Podcasts',
        url: 'https://podcasts.apple.com/us/podcast/pindrop-perspectives/id1799558795',
      },
      {
        label: 'Amazon Music',
        url: 'https://music.amazon.com/podcasts/639e4c31-2806-4496-8dea-732bae356f3c',
      },
      { label: 'iHeart', url: 'https://www.iheart.com/podcast/269-pindrop-perspectives-269307395/' },
    ],
    ai: false,
    featured: 3,
    order: 30,
  },
  {
    slug: 'the-brutalizer',
    title: 'The Brutalizer',
    subtitle: '',
    category: 'film-video',
    format: 'Comedy short',
    formatLong: 'Comedy micro short',
    year: '2026',
    status: 'Released',
    image: 'assets/media/projects/the-brutalizer.jpg',
    youtubeId: 'JMgNg_wkBJQ',
    short:
      'A pro-wrestling title match reduced to its most absurd essentials — written and directed by Eugene Mont.',
    synopsis: [
      '“Epic Finisher: The Brutalizer Claims the Title” is a micro-short from the WEC series — a wrestling finish played entirely straight and therefore entirely ridiculous. Written and directed by Eugene Mont.',
      'It sits in Pindrop’s fast lane: pieces made in days rather than months, testing how much character a single scene can carry.',
    ],
    credits: [{ role: 'Written & Directed', name: 'Eugene Mont' }],
    links: [{ label: 'Watch on YouTube', url: 'https://www.youtube.com/watch?v=JMgNg_wkBJQ' }],
    ai: true,
    aiNote: 'AI-assisted short; Runway and Seedance are referenced in its public credits.',
    order: 40,
  },
  {
    slug: 'echoes',
    title: 'Echoes',
    subtitle: '',
    category: 'experiments',
    format: 'AI music video',
    year: '2026',
    status: 'Released',
    image: 'assets/media/projects/echoes.jpg',
    youtubeId: 'M6lBL2-__ek',
    short:
      'A music video built for the Global AI Film Hack — testing how far a tool can carry a feeling before a human takes over.',
    synopsis: [
      'Echoes pairs an original track with generated imagery, made for the Global AI Film Hack. Written and directed by Eugene Mont, with story by Eugene Mont and Thomas Muller.',
      'The piece is deliberately an experiment: it asks where automated imagery stops being useful and a director has to intervene. The full lyrics are published with the video.',
    ],
    credits: [
      { role: 'Written & Directed', name: 'Eugene Mont' },
      { role: 'Story', name: 'Eugene Mont & Thomas Muller' },
    ],
    links: [{ label: 'Watch on YouTube', url: 'https://www.youtube.com/watch?v=M6lBL2-__ek' }],
    ai: true,
    aiNote:
      'Produced for the Global AI Film Hack using AI-assisted tools under the direction of its credited creators.',
    order: 50,
  },
  {
    slug: 'american-revolution',
    title: 'American Revolution',
    subtitle: '',
    category: 'audio',
    format: 'Concept album',
    year: '2025',
    status: 'Released — 10 tracks',
    image: 'assets/media/projects/american-revolution.jpg',
    youtubeId: '44ddP5czeh4',
    short: 'A ten-track hip-hop concept album, performed with AI tools and directed by the company.',
    synopsis: [
      'American Revolution is a full-length hip-hop concept album — ten songs written and directed by Pindrop and performed with AI tools rather than a conventional band.',
      'It is the furthest edge of the experiment lane: a musical idea taken to album length to see whether the format holds.',
    ],
    credits: [{ role: 'Produced', name: 'Pindrop Entertainment' }],
    links: [{ label: 'Listen on YouTube', url: 'https://www.youtube.com/watch?v=44ddP5czeh4' }],
    ai: true,
    aiNote: 'Music and performance generated with AI tools under Pindrop’s creative direction.',
    order: 60,
  },
  {
    slug: 'future-proof',
    title: 'Future Proof',
    subtitle: '',
    category: 'film-video',
    format: 'Short film',
    year: '2025',
    status: 'Released',
    image: 'assets/media/projects/future-proof.jpg',
    youtubeId: '7WxyOmj_ex8',
    short: 'A finished short film made inside the 48-hour Gen:48 competition window.',
    synopsis: [
      'Future Proof was made for Gen:48, a competition that demands a complete film in two days. It is Pindrop working lean and against the clock, with whatever is at hand.',
    ],
    credits: [{ role: 'Produced', name: 'Pindrop Entertainment' }],
    links: [{ label: 'Watch on YouTube', url: 'https://www.youtube.com/watch?v=7WxyOmj_ex8' }],
    ai: true,
    aiNote: 'AI-assisted short produced for the Gen:48 competition.',
    order: 70,
  },
  {
    slug: 'rusty',
    title: 'RUSTY',
    subtitle: '',
    category: 'film-video',
    format: 'Horror short',
    year: '2025',
    status: 'Released',
    image: 'assets/media/projects/rusty.jpg',
    youtubeId: '-RpeDGna87c',
    short:
      'Thomas Muller’s Halloween novella as a short film — released two weeks before the book itself.',
    synopsis: [
      'RUSTY is the screen version of Thomas Muller’s horror novella: a boy in the woods of northern Pennsylvania, a Halloween with no costume, and a neighbour who offers him one. It went out on the channel on 6 November 2025; the novella went on sale on the 19th.',
      'It belongs to Pindrop’s streak of self-contained horror pieces built to test dread in compressed running time — and it is the clearest case of the company running page and screen at the same time rather than one after the other.',
    ],
    credits: [
      { role: 'Story', name: 'Thomas Muller' },
      { role: 'Produced', name: 'Pindrop Entertainment' },
    ],
    links: [
      { label: 'Watch on YouTube', url: 'https://www.youtube.com/watch?v=-RpeDGna87c' },
      { label: 'Read the novella', url: 'https://www.amazon.com/dp/B0F3K14SVY' },
    ],
    relatedBook: 'rusty',
    ai: true,
    aiNote: 'AI-assisted horror short produced by Pindrop Entertainment.',
    order: 80,
  },
  {
    slug: 'double-or-nothing',
    title: 'Double or Nothing',
    subtitle: '',
    category: 'film-video',
    format: 'Short film',
    year: '2017',
    status: 'Released',
    image: 'assets/media/projects/double-or-nothing.jpg',
    youtubeId: 'UzfHYvqUjlI',
    short:
      'An early independent short credited to Eugene Mont — the filmmaking instinct that predates the tools.',
    synopsis: [
      'Double or Nothing is a legacy independent short from well before Pindrop’s AI-assisted work, credited to Eugene Mont. It is part of a run of independent films the founders made through the 2010s, and part of the reason the current work moves as quickly as it does.',
    ],
    credits: [{ role: 'Filmmaker', name: 'Eugene Mont' }],
    links: [{ label: 'Watch on YouTube', url: 'https://www.youtube.com/watch?v=UzfHYvqUjlI' }],
    ai: false,
    order: 90,
  },
];

export const BOOKS = [
  {
    slug: 'indestructible',
    tone: '#18222e',
    title: 'Indestructible',
    genre: 'Action thriller',
    year: '2025',
    date: 'March 2025',
    cover: 'assets/media/books/indestructible.jpg',
    short:
      'A military prototype BMW is stolen by a crew of car thieves and torn through the streets of Philadelphia.',
    long: 'A military-prototype BMW falls into the hands of a crew of car thieves, and the chase that follows drags through the streets of Philadelphia. Fast, engine-hot, and built like a screenplay — it carries an official Pindrop book trailer.',
    isbn: '9798313559544',
    pages: '218',
    amazon: 'https://www.amazon.com/dp/B0F194SB9L',
    trailerId: 'A1TLl8Cul5M',
    featured: true,
  },
  {
    slug: 'the-kelleher',
    tone: '#14201b',
    title: 'The Kelleher',
    genre: 'Horror novel',
    year: '2023',
    date: 'March 2023',
    cover: 'assets/media/books/the-kelleher.jpg',
    short:
      'Investigator Derek Whitcomb is drawn into Willow Grove’s oldest secret — and some families bury more than their dead.',
    long: 'A horror novel set in the town of Willow Grove. When investigator Derek Whitcomb takes a case that reaches back generations, he finds a town that has been keeping its arrangement quiet for a very long time. The novel earned an official Pindrop book trailer and a dedicated episode of Pindrop Perspectives.',
    isbn: '9798377557388',
    pages: '',
    amazon: 'https://www.amazon.com/dp/B0BW3HG52P',
    trailerId: 'Mp9qyy6zlGQ',
    featured: true,
  },
  {
    slug: 'prophecy-of-nightmares',
    tone: '#14161c',
    title: 'The Prophecy of Nightmares',
    genre: 'Horror',
    year: '2019',
    date: 'December 2019',
    cover: 'assets/media/books/prophecy-of-nightmares.jpg',
    short:
      'Four linked stories of creeping dread — and the basis for Pindrop’s anthology concept trailer.',
    long: 'An elderly woman living alone accepts help from a charitable young couple. Two boys happen upon a country fair and their lives change forever. A small town is thrown into hell by something never seen before. Four linked stories asking whether any of it is real, or whether the prophecy has already been fulfilled — and the direct source material for Pindrop’s concept trailer of the same name.',
    isbn: '9781674446837',
    pages: '',
    amazon: 'https://www.amazon.com/dp/1674446837',
    relatedProject: 'prophecy-of-nightmares',
    featured: true,
  },
  {
    slug: 'four-corners',
    tone: '#1a1a24',
    title: 'Four Corners',
    genre: 'Horror',
    year: '2021',
    date: 'October 2021',
    cover: 'assets/media/books/four-corners.jpg',
    short: 'A horror novel from the middle stretch of the catalog.',
    long: 'Published in 2021, Four Corners sits between the early anthologies and the fuller character-driven novels that followed.',
    isbn: '9798750710904',
    pages: '',
    amazon: 'https://www.amazon.com/dp/B09K26D6YY',
  },
  {
    slug: 'nothing-to-fear',
    tone: '#191426',
    title: 'Nothing To Fear',
    genre: 'Horror',
    year: '2020',
    date: 'December 2020',
    cover: 'assets/media/books/nothing-to-fear.jpg',
    short: 'Ordinary settings, uneasy atmosphere, and dread that arrives without warning.',
    long: 'A horror novel from the middle of Thomas Muller’s catalog, continuing his signature interests: ordinary places, patient unease, and a threat that is already inside the room.',
    isbn: '9798580001920',
    pages: '',
    amazon: 'https://www.amazon.com/dp/B08QFCR5NP',
  },
  {
    slug: 'catherine',
    tone: '#221b13',
    title: 'Catherine',
    genre: 'Mystery / horror',
    year: '2019',
    date: 'April 2019',
    cover: 'assets/media/books/catherine.jpg',
    short: 'Sheriff Will Putner is called to a mystery that refuses to stay buried.',
    long: 'Sheriff Will Putner uncovers the truth behind a buried-car mystery in a small community. A slow-burn blend of procedural patience and horror atmosphere — a central example of Muller pressing genre conventions until they crack.',
    isbn: '9781456524241',
    pages: '',
    amazon: 'https://www.amazon.com/dp/1456524240',
  },
  {
    slug: 'no-more-tales-to-tell',
    tone: '#111c26',
    title: 'No More Tales To Tell',
    genre: 'Horror anthology',
    year: '2019',
    date: 'January 2019',
    cover: 'assets/media/books/no-more-tales-to-tell.jpg',
    short: 'Five men, one stranger, and the stories he carries in.',
    long: 'A horror anthology built on a classic framing device. Five men settle in to trade stories, and a sixth stranger arrives with tales of his own — each darker than the last, until the frame itself begins to bend. It establishes the short-fiction sensibility running through everything after it.',
    isbn: '9781791891470',
    pages: '',
    amazon: 'https://www.amazon.com/dp/1791891470',
  },
  {
    slug: 'rusty',
    tone: '#14141c',
    title: 'Rusty',
    genre: 'Horror novella',
    year: '2025',
    date: 'November 2025',
    cover: 'assets/media/books/rusty.jpg',
    short:
      'A boy with no Halloween costume is handed one by a neighbour, days before Devil’s Night.',
    long: 'As Halloween approaches, Rusty wants more than the quiet life he shares with his mother in the woods of northern Pennsylvania — where he spends his days wandering, and showing a slightly sadistic side. With no costume in hand as Devil’s Night nears, a neighbour gives him one he will not forget. Pindrop released a short film of the same name two weeks before the novella went on sale.',
    isbn: '',
    pages: '95',
    amazon: 'https://www.amazon.com/dp/B0F3K14SVY',
    relatedProject: 'rusty',
    trailerId: '-RpeDGna87c',
    featured: true,
  },
  {
    slug: 'honor-among-thieves',
    tone: '#1a2028',
    title: 'Honor Among Thieves',
    genre: 'Crime thriller',
    year: '2020',
    date: 'April 2020',
    cover: 'assets/media/books/honor-among-thieves.jpg',
    short:
      'A widow must fend off four criminals hunting a stolen fortune after her husband is murdered.',
    long: 'A widow is suddenly left to fend off four criminals searching for a stolen fortune, days after her husband is brutally murdered. It is the most straight-ahead crime story in the catalog — a home-invasion thriller run at speed.',
    isbn: '',
    pages: '',
    amazon: 'https://www.amazon.com/dp/B087QRTHR4',
  },
  {
    slug: 'foster-road',
    tone: '#1d1419',
    title: 'Foster Road',
    genre: 'Horror',
    year: '2026',
    date: 'June 2026',
    cover: 'assets/media/books/foster-road.jpg',
    short: 'A single unsettling idea, followed down a very dark road.',
    long: 'A Thomas Muller horror title available in ebook form.',
    isbn: '',
    pages: '',
    amazon: 'https://www.amazon.com/dp/B0H5X543FF',
  },
];

export const FOUNDERS = [
  {
    slug: 'eugene-mont',
    name: 'Eugene Mont',
    initials: 'EM',
    photo: 'assets/media/team/eugene-mont.jpg',
    photoSource: 'The Black List profile',
    role: 'Co-Founder · Writer, Director, Producer',
    short:
      'Writes, directs, and produces Pindrop’s film and experimental work, and leads the company’s adoption of AI-assisted production tools.',
    bio: [
      'Eugene Mont co-founded Pindrop Entertainment and works across film, video, and experimental formats as a writer-director-producer. He is credited on independent films including Double or Nothing (2017) and the Curse of Ball Hall shorts, and he has driven much of the company’s recent output — UNWANTED, Echoes, and The Brutalizer among them.',
      'He is a Runway Student Ambassador and a researcher working with emerging creative tools, and has studied at the Warner School of Education at the University of Rochester. He has been Thomas Muller’s screenwriting partner for years; between them the pair have written roughly 25 scripts.',
    ],
    links: [
      { label: 'LinkedIn', url: 'https://linkedin.com/in/eugenemont' },
      { label: 'IMDb', url: 'https://www.imdb.com/name/nm6260985/' },
      { label: 'The Black List', url: 'https://blcklst.com/profile/eugene-mont' },
    ],
  },
  {
    slug: 'thomas-muller',
    name: 'Thomas Muller',
    initials: 'TM',
    photo: 'assets/media/team/thomas-muller.jpg',
    photoSource: 'Amazon author page',
    role: 'Co-Founder · Author & Writer',
    short:
      'Author of the company’s book catalog and co-writer of its screenplays, shorts, and series.',
    bio: [
      'Thomas Muller co-founded Pindrop Entertainment and wrote its published book catalog — ten titles spanning horror, thrillers, and short fiction. His stories power several of the company’s page-to-screen projects, including the anthology trailer The Prophecy of Nightmares and the book trailers for Indestructible and The Kelleher.',
      'His writing began with a fifteen-page story written as a teenager and grew, by way of The Twilight Zone and Night Gallery, into a full catalog. He has also produced independent films including Double Cross (2014), Knightmare (2016), and A Walk in the Woods (2017). He lives in upstate New York with his wife.',
    ],
    links: [
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/thomas-muller-98416a90/' },
      { label: 'IMDb', url: 'https://www.imdb.com/name/nm6622850/' },
      { label: 'Amazon author page', url: 'https://www.amazon.com/stores/author/B082QP7SX5' },
    ],
  },
];

/** The page-to-screen pipeline, as three plain steps. */
export const PIPELINE = [
  {
    n: '01',
    title: 'Written first',
    body: 'Everything starts on the page — eight published books, roughly 25 screenplays between the founders, and a catalog of short fiction they keep returning to.',
  },
  {
    n: '02',
    title: 'Adapted deliberately',
    body: 'A story earns a screen treatment when it is ready. Muller’s collections become concept trailers and pitches; the trailer is the argument, not the marketing.',
  },
  {
    n: '03',
    title: 'Produced fast, directed by hand',
    body: 'AI-assisted production compresses the gap between script and screen. The writers and directors keep every final decision — casting of tone, cut, and meaning.',
  },
];

/**
 * Studio filmography — the marker projects, not the full catalog.
 *
 * Through 2017 every independent release is listed. From 2021 on, each year is
 * represented by its most-watched work, two entries at most. Lifetime view
 * counts (read from each video's own page, 2026-08-14) are noted so the picks
 * can be re-checked: 2023 Kelleher 7.3K / Gotham #1 3.7K · 2024 UNWANTED teaser
 * 42.3K / Rabbit Hole 12.0K · 2025 Family Dinner 11.6K / American Revolution
 * 7.4K · 2026 Dreamberry 10.9K, with UNWANTED carried as the flagship in release.
 */
export const HERITAGE = [
  { year: '2011', title: 'The Curse of Ball Hall', who: 'Independent short · Eugene Mont' },
  { year: '2012', title: 'The Curse of Ball Hall II', who: 'Independent short · Eugene Mont' },
  { year: '2013', title: 'No Laughing Matter', who: 'Batman fan film' },
  { year: '2014', title: 'Double Cross', who: 'Independent short · Thomas Muller' },
  { year: '2016', title: 'Knightmare', who: 'Batman fan film' },
  {
    year: '2017',
    title: 'Double or Nothing',
    who: 'Short film · Eugene Mont',
    youtubeId: 'UzfHYvqUjlI',
  },
  {
    year: '2017',
    title: 'A Walk in the Woods',
    who: 'Short horror film · Thomas Muller',
    youtubeId: 'dFcH3npsKX4',
  },
  { year: '2021', title: 'Can’t Touch This', who: 'Micro film', youtubeId: 'bAIBSLOFc8E' },
  {
    year: '2023',
    title: 'The Kelleher',
    who: 'Official book trailer',
    youtubeId: 'Mp9qyy6zlGQ',
  },
  {
    year: '2023',
    title: 'Imported from Gotham City #1',
    who: 'Batman short',
    youtubeId: '3KURukskaR4',
  },
  {
    year: '2024',
    title: 'UNWANTED — Season 1 teaser',
    who: 'Series teaser trailer',
    youtubeId: '4zFD2tNB-Mw',
  },
  {
    year: '2024',
    title: 'Down the Rabbit Hole',
    who: 'AI-generated short film',
    youtubeId: 'LzCtci_0P3E',
  },
  { year: '2025', title: 'Family Dinner', who: 'AI horror film', youtubeId: 'Ak7wafS2JCo' },
  {
    year: '2025',
    title: 'American Revolution',
    who: 'Hip-hop concept album',
    youtubeId: '44ddP5czeh4',
  },
  {
    year: '2026',
    title: 'UNWANTED — Season 1',
    who: 'Episodes in release',
    youtubeId: 'ZI9-YuIsR58',
  },
  {
    year: '2026',
    title: 'Dreamberry Hotline',
    who: 'Runway Big Ad Contest',
    youtubeId: 'gd_yCAvOiHU',
  },
];
/**
 * Optional live refresh for the Highlighted Shorts grid, for when the site is
 * hosted rather than opened from a folder.
 *
 * Leave `apiKey` empty and nothing changes: the grid stays pre-built, which is
 * what makes it work offline. Add a YouTube Data API v3 key (restricted to the
 * site's domain) and the grid re-fetches itself on every page load instead.
 * `playlistId` defaults to the channel's uploads playlist; point it at a public
 * "Shorts" playlist to control exactly what appears.
 */
export const LIVE_SHORTS = {
  apiKey: '',
  playlistId: 'UUR7T3wo9zZJxUvRJiPjfE_Q',
  max: 8,
};

export const AI_DISCLOSURE =
  'Artificial intelligence tools may have assisted in the development or production of selected Pindrop Entertainment projects. All creative works, concepts, characters, stories, and final editorial decisions remain under the ownership and direction of their respective creators and Pindrop Entertainment.';
