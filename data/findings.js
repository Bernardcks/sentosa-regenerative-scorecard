// Findings link each weak result to the scorecard items that cause it.
// whatIf = item scores used to recalculate the final score with the scorecard rules.
window.FINDINGS = [
  {
    title: 'Waste keeps the environment category at 1.00',
    why: 'Waste diversion is a Core item. The island diverts 15% of its waste, and level 2 starts at 25%. One Core item below level 2 limits the whole category to 1.00. Before this gate, the category scores 1.95.',
    codes: ['BS-12', 'BS-13', 'BS-20'],
    actions: [
      'Make waste segregation and waste reporting a condition for each tenant, not only for members of the Sentosa Carbon Neutral Network.',
      'Build central food waste treatment on the island. The island treats about 5% of its food waste today.',
      'Report the waste per visitor each year. Then the trend is visible.'
    ],
    whatIf: { 'BS-12': 2 }
  },
  {
    title: 'Clean energy and carbon claims are below the minimum',
    why: 'About 2% of electricity is from renewable sources on the island or by contract. The GSTC minimum is 10%. About 60% of the claimed reductions rely on purchased carbon credits. There is no register that checks public claims.',
    codes: ['BS-08', 'BS-17', 'NC-05'],
    actions: [
      'Add solar panels on car parks, roofs and the new transport hub. Sign a renewable power contract to get above 10%.',
      'Report real cuts apart from carbon credits. Limit credits to 50% of each claim, then to 25%.',
      'Start a claims register. Check each public claim against evidence before SDC or a partner uses it.'
    ],
    whatIf: { 'BS-08': 2, 'BS-17': 2 }
  },
  {
    title: 'Four Core stakeholders are below the Committed level',
    why: 'Government policy owners, developers, local visitors and international visitors are below level 2. This limits Stakeholder Engagement to 1.00. The category is 35% of the final score, thus this is the largest loss.',
    codes: ['SE-04', 'SE-11', 'SE-18', 'SE-19'],
    actions: [
      'Agree nature and community targets for the master plan with METI and STB. Level 2 needs 10% of master plan KPIs to be regenerative.',
      'Write measured conditions into the Brani and RWS 2.0 bids. Level 2 needs 25% of developers to sign them.',
      'Tell residents about the goals of the island. Level 2 needs 25% of residents to know them. Our survey shows 18%.',
      'Follow up each visitor pledge. Level 2 needs 1% of visitors to make a pledge, a contribution or an activity.'
    ],
    whatIf: { 'SE-04': 2, 'SE-11': 2, 'SE-18': 2, 'SE-19': 2 }
  },
  {
    title: 'The community does not yet trust the plans',
    why: 'Only 50% of the Standard stakeholders are at level 2 or above. The rule needs 70%. The three lowest are the Singapore public, the heritage communities and the residents of Sentosa Cove.',
    codes: ['SE-14', 'SE-17', 'SE-13'],
    actions: [
      'Publish plans and data, and hold public panels before decisions. Net public opinion must go from −36% to −10% for level 2.',
      'Design the Brani heritage workshops together with the descendant communities. Level 2 needs 10% of the workshops.',
      'Start data sharing with Sentosa Cove residents. Level 2 needs 10% of the homes.'
    ],
    whatIf: { 'SE-14': 2, 'SE-17': 2, 'SE-13': 2 }
  },
  {
    title: 'No one measures nature',
    why: 'There is no public baseline for forest cover or species. Thus Biodiversity net gain has no data and stays at level 1. SDC protects 8% of the island.',
    codes: ['BS-02', 'BS-01', 'BS-03'],
    actions: [
      'Do a baseline habitat survey in the first year. Do it again each year and publish the index.',
      'Protect more forest and shore. The KPI needs 10% for level 2 and 20% for level 3.',
      'Start reef and seagrass restoration and measure how much survives.'
    ],
    whatIf: { 'BS-02': 2 }
  },
  {
    title: 'Local culture and visitor behaviour get little attention',
    why: 'The communities make about 5% of the cultural programmes. No one follows up with visitors after their visit. Only 18% of the people in our survey know the goals of the island.',
    codes: ['AK-13', 'AK-18', 'AK-17', 'AK-19'],
    actions: [
      'Make cultural programmes together with local practitioners and heritage communities. Level 2 needs 10% of the programmes.',
      'Contact visitors three months after their visit. Level 2 needs 2% of them to report a continued action.',
      'Put 0.5% of the revenue of new developments into community benefit agreements.'
    ],
    whatIf: { 'AK-13': 2, 'AK-18': 2 }
  },
  {
    title: 'Strengths to keep',
    why: 'These items are at level 3 or above. They show that SDC can move the island when it sets a clear condition and a date.',
    codes: ['SE-08', 'SE-10', 'BS-18', 'BS-11', 'AK-02'],
    actions: [
      'Use the same method for the weak items: one target, one owner, one date, and data each year.'
    ]
  }
];
