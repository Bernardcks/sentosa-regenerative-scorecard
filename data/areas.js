// Team estimates. Each area gets a score from 0 to 5 in the four scorecard categories.
// s = [Stakeholder Engagement, No Compromise, Baseline Sustainability, Additional KPIs]
window.WEIGHTS = [0.35, 0.2167, 0.2167, 0.2167];
window.CAT_NAMES = ['Stakeholder Engagement', 'No Compromise', 'Baseline Sustainability', 'Additional KPIs'];

window.AREAS = [
  {
    id: 'sensoryscape', name: 'Sentosa Sensoryscape', kind: 'Public walkway and gardens', x: 55.0, y: 40.1,
    now: [2.5, 3, 3, 2.5], after: [3.5, 3.5, 3.5, 3.5],
    summary: [
      'Sensoryscape is a 30,000 m² walkway. It connects Resorts World Sentosa to the beaches.',
      'It has six sensory gardens. One garden, Palate Playground, grows edible plants, herbs and spices.',
      'It is the first completed project of the Greater Sentosa Master Plan. Entry is free.',
      'The gardens give shade and native plants. But SDC does not publish measured data about the effect on nature.'
    ],
    improveTitle: 'Make it a living laboratory',
    improve: [
      'Measure a habitat index for the gardens each year and publish the result.',
      'Let nature groups and visitors do the surveys together.',
      'Supply herbs from Palate Playground to island kitchens.'
    ],
    links: ['BS-02', 'NC-03', 'AK-17', 'SE-15']
  },
  {
    id: 'golf', name: 'Sentosa Golf Club', kind: 'SDC subsidiary', x: 31.4, y: 20.3,
    now: [1.5, 1, 2, 1], after: [2.5, 3, 3, 2],
    summary: [
      'The club is an SDC subsidiary. It has two golf courses on the east side of the island.',
      'The club waters the courses with captured rainwater only. It also has a food waste digester.',
      'But the "carbon neutral" label of the club relies mostly on purchased carbon credits.',
      'The public has no access to most of this land.'
    ],
    improveTitle: 'Make the claims honest and open the land',
    improve: [
      'Report real emission cuts apart from carbon credits.',
      'Stop the "carbon neutral" label until real cuts make it true.',
      'Change the areas that are not in play into native habitat.',
      'Open a public nature walk each month.'
    ],
    links: ['NC-05', 'BS-17', 'SE-03', 'AK-07']
  },
  {
    id: 'uss', name: 'Universal Studios Singapore', kind: 'Theme park in Resorts World Sentosa', x: 40.2, y: 49.6,
    now: [3, 2, 2, 2], after: [3, 2.5, 3, 2.5],
    summary: [
      'The theme park is a part of Resorts World Sentosa. The resort has a sustainability certificate that GSTC recognises.',
      'The park is one of the largest attractions on the island.',
      'Heat is a risk. In 2025, the temperature at the resort plaza felt like 56 °C.',
      'The resort diverted only 19% of its waste from disposal in 2024.'
    ],
    improveTitle: 'Cool the park and cut the waste',
    improve: [
      'Add shade trees, cool roofs and free water points in the queue areas.',
      'Set a waste diversion target of 50% for the park.',
      'Use food containers that visitors return and the park washes.'
    ],
    links: ['BS-12', 'BS-13', 'AK-08', 'SE-07']
  },
  {
    id: 'rws', name: 'Resorts World Sentosa', kind: 'Integrated resort', x: 48.3, y: 55.5,
    now: [3, 2, 2.5, 2.5], after: [4, 3.5, 3, 2.5],
    summary: [
      'Resorts World Sentosa is the largest private operator on the island.',
      'Its carbon intensity is 28% lower than in 2015. Alternative water supplies 54% of its water.',
      'The RWS 2.0 expansion adds 50% more floor area by 2030.',
      'Thus total emissions and waste can increase while the intensity decreases.'
    ],
    improveTitle: 'Agree absolute targets for RWS 2.0',
    improve: [
      'Agree joint targets with SDC for total emissions, water and waste.',
      'The totals must decrease while the floor area increases.',
      'Make these targets a condition of the expansion and publish the results each year.'
    ],
    links: ['SE-07', 'SE-11', 'BS-14', 'NC-02']
  },
  {
    id: 'cove', name: 'Sentosa Cove', kind: 'Homes and marina', x: 14.8, y: 46.6,
    now: [1, 1.5, 1.5, 1], after: [2.5, 2, 2.5, 2],
    summary: [
      'Sentosa Cove has private homes and a marina.',
      'SDC does not include the water use of these homes in its reports.',
      'We estimate that about 5% of the homes share energy and water data with SDC.',
      'Much of the shoreline is private. The marina is a good example: it makes solar power and collects boat sewage.'
    ],
    improveTitle: 'Bring the residents into the plan',
    improve: [
      'Ask residents to share energy and water data. Give them an estate report each year.',
      'Do solar, greening and waste projects together with the residents.',
      'Open a public walk along the shoreline.'
    ],
    links: ['SE-13', 'NC-03', 'BS-09', 'AK-07']
  },
  {
    id: 'tanjong', name: 'Tanjong Beach', kind: 'Public beach', x: 38.4, y: 14.2,
    now: [1.5, 2, 2.5, 2.5], after: [2.5, 2.5, 3.5, 3],
    summary: [
      'Tanjong Beach is the quietest of the three public beaches. Entry is free.',
      'Hawksbill turtles make nests on the beaches of Sentosa. SDC released 85 young turtles in 2021.',
      'There is no published data about light and noise at the nesting beaches.'
    ],
    improveTitle: 'Make a dark zone for the turtles',
    improve: [
      'In the nesting season, use low amber lights and stop late events.',
      'Train volunteers with nature groups to monitor the nests.',
      'Publish the light and noise results each year.'
    ],
    links: ['BS-19', 'BS-05', 'BS-04', 'SE-15']
  },
  {
    id: 'palawan', name: 'Palawan Beach', kind: 'Public beach and beach clubs', x: 53.5, y: 23.5,
    now: [2, 2, 2, 3], after: [2.5, 2.5, 3, 3.5],
    summary: [
      'Palawan Beach is a free family beach with beach clubs and food outlets.',
      'The master plan includes a large change to the beaches and the coastline.',
      'The SDC guidelines about disposable items apply only to members of the Sentosa Carbon Neutral Network.'
    ],
    improveTitle: 'Remove disposable items from the beach',
    improve: [
      'Use one system of cups and containers that all outlets share and wash.',
      'Give free or low-price programme places to families with low income.',
      'Write the same rules into each new lease on the beach.'
    ],
    links: ['BS-13', 'BS-12', 'AK-05', 'SE-09']
  },
  {
    id: 'siloso', name: 'Siloso Beach', kind: 'Public beach and events', x: 66.4, y: 34.2,
    now: [2, 1.5, 1.5, 2.5], after: [3, 2.5, 2.5, 3],
    summary: [
      'Siloso Beach is the busiest beach. It has bars, attractions and night events.',
      'Events cause the largest quantities of waste, light and noise.',
      'The seagrass at Tanjong Rimau, near Siloso Point, is at risk.'
    ],
    improveTitle: 'Set limits for events and protect the seagrass',
    improve: [
      'Set light, noise and waste limits for each event. Publish the results.',
      'Protect the seagrass at Tanjong Rimau.',
      'Let visitors go on monitored shore walks with nature groups.'
    ],
    links: ['BS-19', 'BS-03', 'SE-20', 'SE-15']
  },
  {
    id: 'imbiah', name: 'Imbiah Lookout and nature area', kind: 'Forest hill and attractions', x: 62.7, y: 47.2,
    now: [2, 2, 2.5, 2], after: [3, 3, 3.5, 2.5],
    summary: [
      'Mount Imbiah has old coastal forest and nature trails.',
      'SDC protects 40 hectares of the 500 hectares of the island. This is 8%.',
      'There is no public baseline for forest cover or species.',
      'Thus no one can show a gain or a loss of nature.'
    ],
    improveTitle: 'Measure the forest and connect it',
    improve: [
      'Do a habitat survey each year with NParks and universities. Publish the index.',
      'Connect Mount Imbiah to Mount Serapong with a corridor of native trees.'
    ],
    links: ['BS-01', 'BS-02', 'SE-06', 'SE-15']
  },
  {
    id: 'fort', name: 'Fort Siloso', kind: 'National monument', x: 91.5, y: 56.7,
    now: [1.5, 2.5, 2, 3.5], after: [3, 3, 2, 4.5],
    summary: [
      'Fort Siloso is a preserved coastal fort and a national monument. Entry is free.',
      'It is the strongest heritage site on the island.',
      'But the site tells the military story only.',
      'The communities that lived on Blakang Mati and Brani do not tell their stories here.'
    ],
    improveTitle: 'Let the communities tell the full story',
    improve: [
      'Write the site content together with descendants of the island villages.',
      'Tell the story of the people who lived here before the fort.',
      'Pay the communities for their stories and their time.'
    ],
    links: ['AK-13', 'AK-11', 'AK-14', 'SE-17']
  },
  {
    id: 'gateway', name: 'Sentosa Gateway and transport', kind: 'Sentosa Express, Boardwalk and buses', x: 37.3, y: 75.6,
    now: [2, 2.5, 3, 2.5], after: [2.5, 3, 4, 3],
    summary: [
      'Visitors enter by monorail, cable car, bus, car, or on foot along the Boardwalk.',
      'Public transport on the island is electric: 14 buses, 10 trams and the monorail.',
      'But SDC has no data about how each visitor arrives. Car access continues.',
      'The master plan replaces the Sentosa Express with a People Mover System.'
    ],
    improveTitle: 'Measure arrivals and make cars the last choice',
    improve: [
      'Count how each visitor arrives.',
      'Increase the car entry price at peak times. Use the money to make public transport entry free.',
      'Use renewable electricity for the new People Mover System.'
    ],
    links: ['BS-18', 'BS-08', 'NC-03', 'SE-05']
  }
];

window.BRANI = {
  facts: [
    ['120 ha', 'Area of Pulau Brani. The master plan joins it to Sentosa.'],
    ['1890', 'The Straits Trading Company opens a tin smelter. It operates for more than 70 years.'],
    ['1974', 'The Brani Naval Base opens. The villagers moved to the mainland from 1971.'],
    ['2027', 'Port operations move to Tuas. Development starts in the early 2030s.']
  ],
  history: [
    'Pulau Brani means "island of the brave". The Orang Laut, the sea people, lived here first.',
    'Malay fishing villages stood on the coast: Kampong Telok Saga, Kampong Selat Sengkir and Kampong Kopit.',
    'Then the island became a tin smelter, a naval base and a container port.',
    'Each change moved people and nature away. A regenerative Brani must bring them back.'
  ],
  proposals: [
    {
      id: 'heritage', name: 'Orang Laut Shore and the Tin Works', tag: 'Idea 1 · Culture and industry', img: 'brani-village',
      s: [4, 3.5, 3.5, 4.5],
      pitch: 'Start Brani again from its roots: the sea people, the tin smelter and the naval base.',
      parts: [
        ['Orang Laut Shore', [
          'Descendants of the island villages design and operate the activities.',
          'Visitors learn to paddle a sampan, to read the tides and to cook the food of the sea people.',
          'A rebuilt kampong jetty is the place for stories, crafts and community events.',
          'The communities own their stories. They get a share of the income.'
        ]],
        ['The Tin Works (regenerative idea)', [
          'Keep the old port and smelter structures. Use them again as a metal workshop.',
          'The workshop melts used drink cans and scrap metal from the island.',
          'Visitors cast a small item from this metal and take it home.',
          'Thus the first industry of Singapore becomes a closed loop for island waste.'
        ]],
        ['The Navy Dock sea nursery (regenerative idea)', [
          'Use the old naval jetties as a nursery for coral and seagrass.',
          'Agencies, universities and nature groups operate it together.',
          'Visitors help to plant coral pieces and to count marine life.',
          'A place that repaired ships now repairs the sea.'
        ]]
      ],
      why: [
        'Heritage communities move from level 1 (Informed) to level 4 (Collaborating).',
        'Intangible heritage is the weakest Additional KPI today. This idea is its direct answer.',
        'Reuse of port structures cuts the embodied carbon of new buildings.'
      ],
      risk: 'The score is valid only if the descendant communities lead the work. A theme without the people is not regenerative.',
      links: ['SE-17', 'AK-13', 'AK-15', 'AK-19', 'BS-03', 'BS-20', 'BS-21']
    },
    {
      id: 'pasar', name: 'Pasar Brani', tag: 'Idea 2 · Local food', img: 'pasar',
      s: [3.5, 3, 3.5, 4],
      pitch: 'A night market with local food only. The stalls change for each event, and the garden of the island supplies the fresh produce.',
      parts: [
        ['A market that changes', [
          'Each event has a theme, for example hawker classics, Malay kueh or food of the Southern Islands.',
          'Only local hawkers, home businesses and social enterprises can have a stall.',
          'Stall rent is low. Thus food prices stay low for local families.'
        ]],
        ['"Upgrade your dish" from the edible garden', [
          'Brani has a large edible garden. The idea comes from Palate Playground in Sensoryscape.',
          'The garden grows laksa leaf, pandan, chilli, calamansi, ginger and ulam herbs.',
          'Visitors take their dish to the garden counter and add fresh produce to it.',
          'Visitors can also pick the produce with a garden guide and learn how it grows.'
        ]],
        ['A closed loop', [
          'All stalls use cups and plates that visitors return. There are no disposable items.',
          'Food waste goes to a composter. The compost goes back to the garden.',
          'A sign at each stall shows the source of the food and the quantity of waste that the market prevented.'
        ]]
      ],
      why: [
        'The market gives local residents a reason to come to the island again.',
        'It increases the share of spend that stays with local businesses and food producers.',
        'It treats food waste on the island. Today the island treats about 5%.'
      ],
      risk: 'One garden cannot supply a full market. The garden supplies the fresh additions, and local farms supply the remainder.',
      links: ['AK-04', 'AK-10', 'AK-05', 'BS-20', 'BS-13', 'SE-18']
    },
    {
      id: 'moana', name: 'A Moana island with a climate-positive lease', tag: 'Idea 3 · Anchor attraction', img: 'barangaroo',
      s: [4, 4, 4, 2.5],
      pitch: 'Invite Disney, or an equivalent partner, to make a Moana island in Brani West. The lease has climate-positive conditions that the tenant must accept.',
      parts: [
        ['Why Moana fits', [
          'Moana is a story about sea people, navigation and an island that becomes healthy again.',
          'Brani is an island of sea people. The theme and the place agree.',
          'The Orang Laut Shore is adjacent to it. Thus the local story stays in first position.'
        ]],
        ['The Barangaroo model', [
          'In Sydney, the government made carbon neutrality a condition of the 99-year lease of Barangaroo South.',
          'Each tenant must accept the green lease clauses.',
          'The precinct is the first certified carbon neutral precinct in Australia.'
        ]],
        ['Conditions for the Brani lease', [
          'The tenant makes or buys renewable energy for all operations. It does not use carbon credits.',
          'The tenant diverts a minimum of 80% of waste from disposal.',
          'The tenant returns more recycled water than the drinking water it uses.',
          'The tenant pays 1% of revenue into a community and nature fund.',
          'SDC measures the results each year. If the tenant fails, the rent increases.'
        ]]
      ],
      why: [
        'Developers are a Core stakeholder at 1.5 today. Performance terms in the lease move them to level 4.',
        'The bid is the strongest control that SDC has. After the lease is signed, the control is weaker.',
        'The Additional KPIs score is lower because the story comes from the Pacific and ticket prices can keep local families out.'
      ],
      risk: 'This is a proposal by our team. Disney has made no commitment. The conditions apply to any anchor tenant.',
      links: ['SE-11', 'NC-02', 'BS-08', 'BS-12', 'BS-17', 'AK-19', 'AK-13']
    }
  ]
};

window.INSIGHTS = [
  {
    title: 'Sentosa obeys the standard. It does not yet restore.',
    body: 'The final score is 1.46 of 5. This is the Conventional stage. Of 77 items, 47 are at the GSTC compliant level and none is at the Regenerative level.'
  },
  {
    title: 'Two gates keep the score low.',
    body: 'A category cannot score more than 1 if a Core item is below level 2. Stakeholder Engagement and Baseline Sustainability fail this gate. Without the gates, the score is 2.01.'
  },
  {
    title: 'Waste is the one Core failure in the environment category.',
    body: 'The island diverts 15% of its waste. Singapore diverts 52%. If this one item reaches level 2, the gate for Baseline Sustainability opens.'
  },
  {
    title: 'People are the weakest part.',
    body: 'Public opinion is negative: 10% support the plans and 46% do not. Only 0.3% of exhibition guests made a pledge. Heritage communities are at the lowest engagement level.'
  },
  {
    title: 'Clean energy and honest claims are far behind.',
    body: 'About 2% of electricity is from renewable sources. The GSTC minimum is 10%. About 60% of the claimed reductions rely on carbon credits.'
  },
  {
    title: 'The strengths are real.',
    body: 'All hotel rooms have a certificate. The Sentosa Carbon Neutral Network covers about 95% of the carbon footprint. Public transport on the island is electric.'
  },
  {
    title: 'Leases are the strongest tool.',
    body: 'Brani and RWS 2.0 add most of the new floor area. If SDC writes measured conditions into each lease and bid, the largest partners must follow.'
  }
];
