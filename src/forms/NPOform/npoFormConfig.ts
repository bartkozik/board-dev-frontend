import { COMMON_FOCUS_AREAS } from '../constants';
import { ConfigFieldKind, FormConfig, Step } from '../types';

export const NPO_FORM_OPTIONS = {
  operatingBudget: [
    { value: '0-500K', label: '$0 - $500K' },
    { value: '500K-1M', label: '$500 - $1M' },
    { value: '1M-2.5M', label: '$1 - $2.5M' },
    { value: '2.5M-5M', label: '$2.5 - $5M' },
    { value: '5M-10M', label: '$5 - $10M' },
    { value: '10M+', label: '>$10M' },
  ],
  yearsInOperation: [
    { value: 'less_than_3_years', label: '< 3 years' },
    { value: '3-10_years', label: '3 - 10 years' },
    { value: '11-20_years', label: '11 - 20 years' },
    { value: 'more_than_20_years', label: '> 20 years' },
  ],
  technicalStaffCount: [
    { value: '0', label: '0' },
    { value: '1-3', label: '1 - 3' },
    { value: '4-10', label: '4 - 10' },
    { value: '11-20', label: '11 - 20' },
    { value: 'moreThan20', label: '> 20' },
  ],
  boardMemberExperienceProfiles: [
    { label: 'C-suite', key: 'c-suite' },
    { label: 'Partner/MD of Professional Services, Bank, or Fund', key: 'partner_md' },
    { label: 'Consultant', key: 'consultant' },
    { label: 'SVP', key: 'svp' },
    { label: 'VP', key: 'vp' },
    { label: 'Senior Director', key: 'senior_director' },
    { label: 'Director', key: 'director' },
    { label: 'Senior Manager', key: 'senior_manager' },
    { label: 'Manager', key: 'manager' },
    { label: 'Other', key: 'other' },
  ],
  boardMeetingsPerYear: [
    { label: '1-2 (annual / semi-annual)', value: '1-2' },
    { label: '3-4 (quarterly)', value: '3-4' },
    { label: '5-8 (bimonthly)', value: '5-8' },
    { label: '9-12 (monthly)', value: '9-12' },
  ],
  boardTermsLength: [
    { label: '1 year', value: '1_year' },
    { label: '2 years', value: '2_years' },
    { label: '3 years', value: '3_years' },
    { label: '> 3 years', value: 'more_than_3' },
    { label: 'Custom for each board member', value: 'custom' },
  ],
  boardMemberDirectDonation: [
    { label: 'No defined expectation', value: 'none' },
    { label: '< $1,000', value: 'below_1k' },
    { label: '$1,000 - $3,000', value: '1k_3k' },
    { label: '$3,000 - $5,000', value: '3k_5k' },
    { label: '$5,000 - $10,000', value: '5k_10k' },
    { label: '$10,000-$15,000', value: '10k_15k' },
    { label: '$15,000-$25,000', value: '15k_25k' },
    { label: '> $25,000', value: 'above_25k' },
  ],
  geographicalScope: [
    { value: 'local', label: 'Local scope or serving communities in our home city or state' },
    { value: 'national', label: 'National scope or serving communities across multiple U.S. states' },
    { value: 'international', label: 'International scope or serving communities beyond the U.S.' },
  ],
  boardMeetingLocation: [
    { label: 'All virtual', value: 'all_virtual' },
    { label: 'All in-person', value: 'all_in_person' },
    { label: 'Hybrid: in-person and virtual options', value: 'hybrid' },
    { label: 'Hybrid: At least one meeting per year requires in-person attendance', value: 'hybrid_one_in_person' },
  ],
  techPriorities: [
    { label: 'Developing a technology product for clients/users', key: 'developing_tech_product' },
    { label: 'Undertaking IT system(s) transformation', key: 'it_system_transformation' },
    { label: 'Developing a digital transformation strategy', key: 'digital_transformation_strategy' },
    { label: 'Improving information security / risk management', key: 'information_security' },
    { label: 'Harnessing data to improve effectiveness and efficiency', key: 'data_harnessing' },
    { label: 'Identifying funding and resources for technology initiatives', key: 'funding_for_tech' },
    { label: 'Exploring frontier tech / leading the field', key: 'frontier_tech' },
    { label: 'None of the above', key: 'none_of_the_above' },
  ],
  averageBoardMemberExperience: [
    { label: '< 7', value: '<7' },
    { label: '7 - 12', value: '7-12' },
    { label: '13 - 20', value: '13-20' },
    { label: '> 20', value: '>20' },
  ],
};

export const NPO_CAUSES = [...COMMON_FOCUS_AREAS, { key: 'other', label: 'Other' }];

export const NPO_STEPS: Step[] = [
  { label: 'Your organization' },
  {
    label: 'Tech Governance',
    description:
      'Help us determine likely areas of focus for a technical leader on the board by describing the state of technical governance in four key areas.',
  },
  {
    label: 'Your Board',
    description:
      'Help us articulate the operating environment of your organization and board to potential board candidates.',
  },
  {
    label: 'Your priorities',
  },
  { label: 'Additional questions' },
];

export const NPO_FORM_CONFIG: FormConfig = {
  1: [
    {
      name: 'organizationName',
      type: ConfigFieldKind.Input,
      label: 'Organization name',
      previewLabel: 'Organization name',
    },
    {
      name: 'organizationWebsite',
      type: ConfigFieldKind.Input,
      label: 'Organization website',
      previewLabel: 'Website',
      link: true,
    },
    {
      name: 'referrerCompanies',
      type: ConfigFieldKind.Select,
      label: 'Were you introduced to this program by one of the following companies?',
      previewLabel: 'Referring Companies',
      options: [
        { value: 'no', label: 'No' },
        { value: 'cdw', label: 'CDW' },
        { value: 'morganStanley', label: 'Morgan Stanley' },
        { value: 'okta', label: 'Okta' },
        { value: 'netApp', label: 'NetApp' },
        { value: 'pwc', label: 'PwC' },
        { value: 'dell', label: 'Dell' },
        { value: 'aws', label: 'AWS' },
        { value: 'tippingPoint', label: 'Tipping Point' },
        { value: 'other', label: 'Other' },
      ],
    },
    {
      name: 'organizationEin',
      type: ConfigFieldKind.Input,
      label: "Organization's EIN (optional)",
      secondaryLabel: true,
      relatedParent: true,
      optional: true,
    },
    {
      name: 'organizationHQCity',
      type: ConfigFieldKind.Input,
      label: 'City  (HQ or primary office)',
      previewLabel: 'City',
    },
    {
      name: 'organizationHQState',
      type: ConfigFieldKind.Input,
      label: 'State (HQ or primary office)',
      previewLabel: 'State',
    },
    {
      name: 'organizationHQCountry',
      type: ConfigFieldKind.Input,
      label: 'Country  (HQ or primary office)',
      previewLabel: 'Country',
    },
    {
      name: 'requireBoardMembersLocation',
      type: ConfigFieldKind.Radio,
      label: 'Do you require board members to be located in this city?',
      previewLabel: 'Board members required to be in this city',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ],
    },
    {
      name: 'usRegistration',
      type: ConfigFieldKind.Radio,
      label: 'Is your organization, or an affiliate, registered in the United States as a 501(c)(3) organization?',
      previewLabel: 'is registered in the United States as a 501(c)(3) organization.',
      relatedWith: 'organizationEin',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ],
    },
    {
      name: 'workWithPii',
      type: ConfigFieldKind.Radio,
      label: 'Do you work with Personally Identifiable Information (PII) or Protected Health Information (PHI).',
      previewLabel: 'work with Personally Identifiable Information (PII) or Protected Health Information (PHI).',
      relatedWith: 'organizationEin',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ],
    },

    {
      name: 'causes',
      type: ConfigFieldKind.Checklist,
      label: 'What cause area is your organization addressing with its mission statement?',
      instruction: 'Choose all that apply.',
      previewLabel: 'Area of interest',
      notChecklisted: true,
      fields: NPO_CAUSES,
    },

    {
      name: 'missionStatement',
      type: ConfigFieldKind.Textarea,
      label: 'What is the mission statement of your organization?',
      previewLabel: 'Mission',
    },
    {
      name: 'primaryRecipient',
      previewLabel: 'Primary Recipient',
      type: ConfigFieldKind.Textarea,
      label:
        'Who is the primary recipient of your services (e.g., BIPOC youth, other nonprofits, unhoused individuals, low-income families, women)?',
    },
    {
      name: 'geographicalScope',
      type: ConfigFieldKind.Radio,
      label: 'What is your geographical scope or reach?',
      previewLabel: 'Geographical Scope',
      options: NPO_FORM_OPTIONS.geographicalScope,
    },
    {
      name: 'servicesOutsideUs',
      type: ConfigFieldKind.Radio,
      label: 'Do you deliver services outside the United States?',
      options: [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ],
      previewLabel: 'deliver services outside the United States.',
      relatedWith: 'organizationEin',
    },
    {
      name: 'servicesOutsideUsLocation',
      type: ConfigFieldKind.Textarea,
      label: 'If yes, where? Please include City and Country information. (optional)',
      optional: true,
      previewLabel: 'Service Location Outside US',
    },

    {
      name: 'operatingBudget',
      type: ConfigFieldKind.Radio,
      label: 'What is your operating budget?',
      previewLabel: 'Operating Budget',
      options: NPO_FORM_OPTIONS.operatingBudget,
    },
    {
      name: 'yearsInOperation',
      type: ConfigFieldKind.Radio,
      label: 'How many years has your organization been in operation?',
      previewLabel: 'Years in Operation',
      options: NPO_FORM_OPTIONS.yearsInOperation,
    },
  ],
  2: [
    {
      name: 'techRoleInOrganization',
      type: ConfigFieldKind.Radio,
      label: 'Which of these best describes the role of technology in your organization today?',
      previewLabel: 'Current role of technology',
      options: [
        {
          value: 'businessOperations',
          label: 'Primarily used for our business operations, from email to fundraising to accounting',
        },
        {
          value: 'coreToProgramsAndOperations',
          label: 'Core to delivering our programs or services, as well as our business operations',
        },
        {
          value: 'missionStatementOrPrimaryValue',
          label: 'Part of our mission statement, or is the primary means for value delivery on our mission',
        },
      ],
    },
    {
      name: 'technicalStaffCount',
      type: ConfigFieldKind.Select,
      label:
        'How many technical people (with technology as their primary focus or part of their job description) are on your staff?',
      previewLabel: 'Tech team count',
      options: NPO_FORM_OPTIONS.technicalStaffCount,
    },
    {
      name: 'mostSeniorTechMember',
      type: ConfigFieldKind.Select,
      label: 'Who is the most senior tech member of your team and what is their role?',
      previewLabel: 'Most senior tech member',
      options: [
        { value: 'noTechnicalTeamMembers', label: 'No technical team members' },
        { value: 'cto', label: 'Chief Technology Officer' },
        { value: 'cio', label: 'Chief Information Officer' },
        { value: 'vpDirectorIT', label: 'VP/Director of IT/Technology' },
        { value: 'vpDirectorEngineering', label: 'VP/Director of Engineering' },
        { value: 'vpDirectorProduct', label: 'VP/Director of Product' },
        { value: 'itManager', label: 'IT Manager' },
        { value: 'dataManager', label: 'Data Manager' },
        { value: 'webManager', label: 'Web Manager' },
        { value: 'other', label: 'Other' },
      ],
    },
    {
      name: 'seniorTechMemberLinkedIn',
      type: ConfigFieldKind.Input,
      label: 'Please share the LinkedIn profile of this person. (optional)',
      previewLabel: 'LinkedIn profile',
      optional: true,
    },
    {
      name: 'ceoTechFluency',
      type: ConfigFieldKind.Radio,
      label: 'How tech-fluent is your CEO?',
      previewLabel: 'CEO tech fluency',
      options: [
        { value: 'littleOrNoExperience', label: 'Little to no tech experience or knowledge' },
        { value: 'basicConcepts', label: 'Can discuss basic technology concepts' },
        { value: 'strategicUnderstanding', label: 'Can discuss technology in a strategic way' },
        { value: 'technologist', label: 'Is a technologist' },
      ],
    },
    {
      name: 'ceoTechFluencyExplanation',
      type: ConfigFieldKind.Textarea,
      label: 'Please elaborate on your response (optional)',
      previewLabel: 'CEO tech fluency details (optional)',
      optional: true,
    },
    {
      name: 'boardTechFluency',
      type: ConfigFieldKind.Radio,
      label: 'How tech-fluent is your board?',
      previewLabel: 'Board tech fluency',
      options: [
        { value: 'fewUnderstandBasicTech', label: 'Few or no board members understand basic tech concepts' },
        { value: 'manyUnderstandBasicTech', label: 'Many or most board members understand basic tech concepts' },
        {
          value: 'manyUnderstandStrategicTech',
          label: 'Many or most board members can talk about tech in a strategic way',
        },
        { value: 'atLeastOneTechnologist', label: 'At least one board member is a technologist' },
      ],
    },
    {
      name: 'boardTechFluencyExplanation',
      type: ConfigFieldKind.Textarea,
      label: 'Please elaborate on your response (optional)',
      previewLabel: 'Board tech fluency details (optional)',
      optional: true,
    },
    {
      name: 'techRiskManagement',
      type: ConfigFieldKind.MultipleScale,
      label: '1. Tech risk management',
      previewLabel: 'Tech risk management',
      instruction:
        'The board should ensure the organization has effective privacy and security policies & procedures in place and is acting in compliance with them.',
      scales: [
        {
          key: 'boardTrainedOnPrivacySecurityPolicies',
          label:
            'The board has been trained on their responsibilities to ensure appropriate privacy and security policies are in place.',
        },
        {
          key: 'boardReviewedSecurityPrivacyPolicies',
          label: 'The board has reviewed and approved security and privacy policies.',
        },
        {
          key: 'organizationUpdatesBoardOnComplianceAndRisks',
          label: 'The organization updates the board about compliance with policies and associated risks.',
        },
        {
          key: 'unsureOfBoardApproachToTechRiskManagement',
          label: 'I am not sure how the board approaches tech risk management.',
        },
      ],
    },
    {
      name: 'techStrategyAndPlanning',
      type: ConfigFieldKind.MultipleScale,
      label: '2. Tech strategy and planning',
      previewLabel: 'Tech business operations',
      instruction:
        'The board should ensure the organization is making the right investments in technology to achieve the strategic plan, measuring the performance and business impact of technology tools, and using resources cost-effectively.',
      scales: [
        {
          key: 'boardCanDescribeTechRoleInProgramsOperations',
          label:
            'Each board member can describe the general role of technology in the delivery of programs and/or the operations of the organization.',
        },
        {
          key: 'boardUnderstandsBusinessCaseForTechInvestment',
          label:
            'Board members understand the business case for further investment in technology, including where tech could help the organization be more efficient and more effectively deliver on its mission.',
        },
        {
          key: 'boardReviewsTechRoadmapOrPerformanceInStrategicPlan',
          label:
            'Board members review a technical roadmap or technology performance as part of the strategic plan, budgets, or scorecards.',
        },
        {
          key: 'unsureOfTechInfluenceOnBusinessStrategy',
          label: 'I am not sure if the board understands how tech influences our business strategy.',
        },
      ],
    },
    {
      name: 'techResourcing',
      type: ConfigFieldKind.MultipleScale,
      label: '3. Tech resourcing',
      previewLabel: 'Tech resourcing',
      instruction:
        'The board should connect the organization to technology vendors and people resources who can deliver on the technical plan; support hiring of technical roles as needed.',
      scales: [
        {
          key: 'boardIdentifiesCoreTechResources',
          label:
            "Board members can identify the organization's core technical resources, including key staff and primary vendors.",
        },
        {
          key: 'boardAwareOfAdditionalTechResourcesNeeded',
          label:
            'Board members are aware of what additional resources would enable the organization to use technology more responsibly and effectively (such as a new CRM vendor, a website upgrade, or an IT Director).',
        },
        {
          key: 'boardUsesNetworksToSecureTechResources',
          label:
            'Board members use their networks to secure resources to achieve the organization’s technical plan through funding, software donation, pro bono, consultants, hires, and so on.',
        },
        {
          key: 'unsureOfTechResourcingSupport',
          label: 'I am not sure if the board can identify or support our tech resourcing.',
        },
      ],
    },
    {
      name: 'techInCommunity',
      type: ConfigFieldKind.MultipleScale,
      label: '4. Tech in the community',
      previewLabel: 'Tech in the community',
      instruction:
        'The board should provide insights into relevant technology trends and help the organization embrace technology proactively, exploring possibilities for future impact (internally and externally).',
      scales: [
        {
          key: 'boardDiscussesBestPracticesInTechUse',
          label:
            'The board discusses current best practices for the use of technology in your field (from programs to fundraising).',
        },
        {
          key: 'boardDiscussesRisingTechTrendsInCommunity',
          label:
            'The board discusses rising trends in technology that could impact the community, service recipients, donors, or operations.',
        },
        {
          key: 'boardReviewsTechInStrategicPlanningProcess',
          label:
            'The board reviews technology trends as a topic in the short and long-term strategic planning processes.',
        },
        {
          key: 'unsureOfBoardReviewOfTechOpportunities',
          label: 'I am not sure if the board reviews technology opportunities.',
        },
      ],
    },
  ],

  3: [
    {
      name: 'successMeasurement',
      type: ConfigFieldKind.Textarea,
      label: 'How do you measure success? What is an example of a core metric you use to show your progress?',
      previewLabel: 'Success measurement tools',
    },
    {
      name: 'keyBoardMembers',
      type: ConfigFieldKind.Input,
      label: 'Who is or are one or two of your key board members? (optional)',
      optional: true,
      previewLabel: 'Key partners or board members (optional)',
    },
    {
      name: 'averageBoardMemberExperience',
      type: ConfigFieldKind.Select,
      label: 'How would you describe the typical years of experience of your current board members?',
      previewLabel: 'Typical years of board member experience',
      options: NPO_FORM_OPTIONS.averageBoardMemberExperience,
    },
    {
      name: 'boardMemberExperienceProfiles',
      type: ConfigFieldKind.Checklist,
      label: 'How would you describe the experience profiles of your current board members?',
      instruction: 'Please select all that apply.',
      previewLabel: 'Experience profiles of board members',
      fields: NPO_FORM_OPTIONS.boardMemberExperienceProfiles,
    },
    {
      name: 'deiDefinitionAndMeasurement',
      type: ConfigFieldKind.Textarea,
      label:
        'How do you define and measure diversity, equity, and inclusion on the board? How do you think you are doing on those measures?',
      previewLabel: 'Diversity, equity, and inclusion on the board',
    },
    {
      name: 'organizationCultureDescription',
      type: ConfigFieldKind.Input,
      label: 'What are 3-5 words you would use to describe the culture of your organization?',
      previewLabel: 'Organization culture',
    },
    {
      name: 'boardCultureDescription',
      type: ConfigFieldKind.Input,
      label: 'What are 3-5 words you would use to describe the culture of your board?',
      previewLabel: 'Board culture',
    },
    {
      name: 'organizationType',
      type: ConfigFieldKind.Radio,
      label: 'Which of the following descriptions apply to your organization?',
      options: [
        { label: 'Early-stage organization or “startup” culture', value: 'startup' },
        { label: 'Long-established organization or more traditional “institutional” culture', value: 'institutional' },
        { label: 'Neither', value: 'neither' },
      ],
      previewLabel: 'Organization type',
    },
    {
      name: 'nonprofitBoardExperienceRequirement',
      type: ConfigFieldKind.Checkbox,
      label: 'Board candidates must have previous nonprofit board experience.',
      previewLabel: 'Nonprofit board experience required',
      optional: true,
    },
    {
      name: 'boardMeetingsPerYear',
      type: ConfigFieldKind.Select,
      label: 'How many board meetings per year?',
      options: NPO_FORM_OPTIONS.boardMeetingsPerYear,
      previewLabel: 'Annual board meetings frequency',
    },
    {
      name: 'boardTermsLength',
      type: ConfigFieldKind.Select,
      label: 'How long are your board terms?',
      previewLabel: 'Board terms length',
      options: NPO_FORM_OPTIONS.boardTermsLength,
    },
    {
      name: 'boardMeetingLocation',
      type: ConfigFieldKind.Radio,
      label: 'Where are your board meetings held?',
      previewLabel: 'Board meeting location type',
      options: NPO_FORM_OPTIONS.boardMeetingLocation,
    },
    {
      name: 'boardMemberDirectDonation',
      type: ConfigFieldKind.Select,
      label: 'What minimum direct financial contribution do you typically expect from your board members?',
      previewLabel: 'Direct donation from board members',
      options: NPO_FORM_OPTIONS.boardMemberDirectDonation,
    },
    {
      name: 'additionalFinancialExpectations',
      type: ConfigFieldKind.Textarea,
      previewLabel: 'Financial expectations for board members',
      label:
        'Are there other explicit or implicit financial expectations for your board members, such as introductions to high net worth individuals in their networks?',
    },
    {
      name: 'additionalBoardMemberTimeExpectations',
      type: ConfigFieldKind.Textarea,
      previewLabel: 'Time expectations for board members',
      label:
        'What other time expectations do you have of board members, beyond board meetings? For example, are board members expected to attend bi-annual events?',
    },
    {
      name: 'boardMemberTrainingAndOnboarding',
      type: ConfigFieldKind.Textarea,
      label:
        'What training and onboarding do you provide to new board members (such as mentors, BoardSource memberships, and so on)?',
      previewLabel: 'Training and onboarding for new board members',
    },
    {
      name: 'boardElectionProcess',
      type: ConfigFieldKind.Textarea,
      label: 'What is your board election process, including approval steps?',
      previewLabel: 'Board election process',
    },
    {
      name: 'timeToElectBoardMember',
      type: ConfigFieldKind.Select,
      label: 'How long does it typically take to elect a new board member once you have met with a candidate?',
      previewLabel: 'Average time to elect new board member',
      options: [
        { label: '< 1 month', value: 'less_than_1_month' },
        { label: '1-2 months', value: '1_2_months' },
        { label: '3-4 months', value: '3_4_months' },
        { label: '5-6 months', value: '5_6_months' },
        { label: '> 6 months', value: 'more_than_6_months' },
      ],
    },
  ],
  4: [
    {
      name: 'biggestOrganizationChallenge',
      type: ConfigFieldKind.Textarea,
      label: "What's the biggest challenge facing your organization currently?",
      previewLabel: 'Biggest organizational challenge',
    },
    {
      name: 'biggestTechnologyChallengeOrOpportunity',
      type: ConfigFieldKind.Textarea,
      label: 'What is your biggest current technology-related challenge or opportunity?',
      previewLabel: 'Biggest technology challenge or opportunity',
    },
    {
      name: 'techPriorities',
      type: ConfigFieldKind.Checklist,
      label: 'Which of the following are tech priorities for your organization?',
      previewLabel: 'Technology priorities',
      instruction: 'Choose up to 3',
      fields: NPO_FORM_OPTIONS.techPriorities,
      maxSelections: 3,
    },
    {
      name: 'wildSuccessForTechRole',
      type: ConfigFieldKind.Input,
      previewLabel: 'Definition of wild success for tech-focused board role',
      label:
        'If a new candidate were to join your board in a tech-focused role, what would wild success for this person look like in the next 12 months?',
    },
  ],

  5: [
    {
      name: 'interestedPrograms',
      type: ConfigFieldKind.Checklist,
      label: 'Which of the following programs would you be interested in?',
      previewLabel: 'Interested programs',
      instruction: 'Choose all that apply.',
      fields: [
        {
          label:
            "Opportunities to hear from other EDs/CEOs how they've leveraged technology in their organization (i.e., webinars, case studies)",
          key: 'hearFromOtherCeoEds',
        },
        {
          label: 'Access to a community of NPO peers working on tech governance',
          key: 'accessToNpoPeerCommunity',
        },
        {
          label: 'Resources for development teams to maximize technology-related grants',
          key: 'developmentTeamResourcesForGrants',
        },
        {
          label: 'Training programs for your existing board members to improve their tech fluency',
          key: 'trainingProgramsForBoardMembers',
        },
        {
          label: 'Guided consultation for your board on leveraging technology in your organization',
          key: 'guidedConsultationOnTechnology',
        },
      ],
    },
    {
      name: 'additionalQuestionToAsk',
      type: ConfigFieldKind.Input,
      label: "Is there something we didn't ask that we should have? (optional)",
      previewLabel: 'Additional questions',
      optional: true,
    },
    {
      name: 'feedbackOrQuestions',
      type: ConfigFieldKind.Input,
      label:
        'We regularly reevaluate and update this assessment. Do you have any feedback or questions for us? (optional)',
      optional: true,
      previewLabel: 'Feedback or questions',
    },
  ],
};
