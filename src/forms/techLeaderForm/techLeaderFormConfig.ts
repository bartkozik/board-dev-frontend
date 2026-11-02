import { COMMON_FOCUS_AREAS } from '../constants';
import { ConfigFieldKind, FormConfig, Step } from '../types';

export const TECH_LEADER_FORM_OPTIONS = {
  companyEmployees: [
    { value: 'lessThan100', label: '< 100' },
    { value: '100To2499', label: '100 - 2,499' },
    { value: '2500To9999', label: '2,500 - 9,999' },
    { value: '10000Plus', label: '10,000+' },
  ],
  positionOfResponsibility: [
    { value: 'c_suite', label: 'C-suite' },
    {
      value: 'partner_managing_director',
      label: 'Partner or Managing Director of Professional Services Firm, Bank, or Investment Fund',
    },
    { value: 'svp', label: 'SVP' },
    { value: 'vp', label: 'VP' },
    { value: 'consultant', label: 'Consultant' },
    { value: 'senior_director', label: 'Senior Director' },
    { value: 'director', label: 'Director' },
    { value: 'advisor_or_senior_advisor', label: 'Advisor or Senior Advisor' },
    { value: 'consultant_or_senior_consultant', label: 'Consultant or Senior Consultant' },
    { value: 'senior_manager', label: 'Senior Manager' },
    { value: 'manager', label: 'Manager' },
    { value: 'other', label: 'Other' },
  ],
  yearsOfExperience: [
    { value: 'lessThan7', label: '< 7' },
    { value: '7To12', label: '7 - 12' },
    { value: '13To20', label: '13 - 20' },
    { value: 'moreThan20', label: '> 20' },
  ],
  organizationExperienceTypes: [
    { label: 'Early to mid-stage startups', key: 'earlyMidStageStartup' },
    { label: 'Late stage startups', key: 'lateStageStartup' },
    { label: 'Small businesses', key: 'smallBusiness' },
    { label: 'Mid-market enterprises', key: 'midMarketEnterprise' },
    { label: 'Large enterprises', key: 'largeEnterprise' },
    { label: 'Very large enterprises (Fortune 500 or Fortune Global 500)', key: 'veryLargeEnterprise' },
    { label: 'Nonprofits', key: 'nonprofit' },
    { label: 'Government', key: 'government' },
    { label: 'Consulting (technology consulting role for external clients)', key: 'consultingFirm' },
  ],
  nonprofitTechPrioritiesPreference: [
    { key: 'techProductDevelopment', label: 'Developing a technology product for their clients/users' },
    { key: 'itSystemsTransformation', label: 'Undertaking IT system(s) transformation' },
    { key: 'digitalTransformationStrategy', label: 'Developing a digital transformation strategy' },
    { key: 'informationSecurity', label: 'Improving information security / risk management' },
    { key: 'dataHarnessing', label: 'Harnessing data to improve effectiveness and efficiency' },
    { key: 'techFundingResources', label: 'Identifying funding and resources for technology initiatives' },
    { key: 'frontierTechExploration', label: 'Exploring frontier tech / leading the field' },
    { key: 'noPreference', label: 'No preference' },
  ],
  techExpertiseAreas: [
    { key: 'productStrategyManagement', label: 'Product (Strategy & Management)' },
    { key: 'itInfrastructureOperations', label: 'IT Infrastructure & Operations' },
    { key: 'informationSecurity', label: 'Information Security (Cybersecurity)' },
    { key: 'engineeringSoftwareDevelopment', label: 'Engineering & Software Development' },
    { key: 'dataAnalytics', label: 'Data & Analytics' },
    { key: 'enterpriseArchitecture', label: 'Enterprise Architecture' },
    { key: 'devOps', label: 'DevOps' },
    { key: 'cloudOperations', label: 'Cloud Operations' },
    { key: 'digitalTransformationInnovation', label: 'Digital Transformation & Innovation' },
    { key: 'aiMl', label: 'AI & ML' },
    { key: 'enterpriseResourcePlanning', label: 'Enterprise Resource Planning (ERP) Systems' },
    { key: 'itGovernanceProjectManagement', label: 'IT Governance & Project Management' },
    { key: 'other', label: 'Other' },
  ],
  goalsForBoardService: [
    { label: 'Drive impact', key: 'driveImpact' },
    { label: 'Increased sense of purpose or contribution', key: 'increasedSenseOfPurpose' },
    { label: 'Expand my professional or personal network', key: 'expandNetwork' },
    { label: 'Further develop my leadership skills', key: 'developLeadershipSkills' },
    { label: 'Grow my technical experience or skills', key: 'growTechExperience' },
    { label: 'Connect to my community', key: 'connectToCommunity' },
    { label: 'Learn about nonprofit organizations', key: 'learnAboutNonprofits' },
    { label: 'Other', key: 'other' },
  ],
  nonprofitGeographicalReachPreference: [
    { value: 'localScope', label: 'Prefer a nonprofit with a local scope' },
    { value: 'nationalScope', label: 'Prefer a nonprofit with a national scope' },
    { value: 'internationalScope', label: 'Prefer a nonprofit with an international scope' },
    { value: 'noPreference', label: 'No preference' },
  ],
  boardMeetingPreference: [
    { value: 'both', label: 'Open to both in-person and virtual meetings' },
    { value: 'virtualOnly', label: 'Prefer virtual-only' },
    { value: 'inPersonOnly', label: 'Prefer in-person only (may limit your likelihood of a match)' },
  ],
};

export const TECH_LEADER_FOCUS_AREAS = COMMON_FOCUS_AREAS;

export const TECH_LEADER_STEPS: Step[] = [
  { label: 'Your Information' },
  { label: 'Match Preferences' },
  { label: 'Your Experience' },
  { label: 'Feedback' },
];

export const TECH_LEADER_FORM_CONFIG: FormConfig = {
  1: [
    {
      name: 'city',
      type: ConfigFieldKind.Input,
      label: 'City',
    },
    {
      name: 'state',
      type: ConfigFieldKind.Input,
      label: 'State',
    },
    {
      name: 'country',
      type: ConfigFieldKind.Input,
      label: 'Country',
    },
    {
      name: 'linkedIn',
      type: ConfigFieldKind.Input,
      label: 'LinkedIn Profile URL',
      previewLabel: 'LinkedIn profile',
      link: true,
    },
    {
      name: 'company',
      type: ConfigFieldKind.Input,
      label: 'Company (current or most recent)',
      previewLabel: 'Company',
    },
    {
      name: 'companyIndustry',
      type: ConfigFieldKind.Select,
      label: 'Which industry best describes your company?',
      previewLabel: 'Industry',
      options: [
        { value: 'software_services', label: 'Software & Services' },
        { value: 'semiconductors', label: 'Semiconductors and semiconductor equipment' },
        { value: 'technology_hardware', label: 'Technology hardware and devices' },
        { value: 'technology_consulting', label: 'Technology consulting' },
        { value: 'ecommerce', label: 'E-commerce & Internet Platforms' },
        { value: 'financial_services', label: 'Financial Services' },
        { value: 'health_care', label: 'Health care & Life Sciences' },
        { value: 'retail', label: 'Retail' },
        { value: 'consulting', label: 'Consulting & Professional Services' },
        { value: 'legal', label: 'Legal' },
        { value: 'telecommunications', label: 'Telecommunications' },
        { value: 'media_entertainment', label: 'Media & Entertainment' },
        { value: 'philanthropy', label: 'Philanthropy' },
        { value: 'government', label: 'Government & Public Sector' },
        { value: 'real_estate', label: 'Real Estate' },
        { value: 'education', label: 'Education' },
        { value: 'automotive', label: 'Automotive & Transportation' },
        { value: 'aerospace', label: 'Aerospace & Defense' },
        { value: 'energy_utilities', label: 'Energy & Utilities' },
        { value: 'industrial_manufacturing', label: 'Industrial Manufacturing' },
        { value: 'other', label: 'Other' },
      ],
    },
    {
      name: 'companyEmployees',
      type: ConfigFieldKind.Select,
      label: 'Approximate number of employees at company?',
      previewLabel: 'Number of employees',
      options: TECH_LEADER_FORM_OPTIONS.companyEmployees,
    },
    {
      name: 'role',
      type: ConfigFieldKind.Input,
      label:
        'Your current role (external title) at your current company (e.g., VP of Engineering, CIO, CISO, Partner, etc.)?',
      previewLabel: 'Role',
    },
    {
      name: 'managerRole',
      type: ConfigFieldKind.Input,
      label: "Your direct manager's role or title?",
      previewLabel: 'Manager role',
    },
    {
      name: 'positionOfResponsibility',
      type: ConfigFieldKind.Radio,
      label: 'Your position of responsibility (internal level):',
      previewLabel: 'Position of responsibility',
      notChecklisted: true,
      options: TECH_LEADER_FORM_OPTIONS.positionOfResponsibility,
    },
    {
      name: 'yearsOfExperience',
      type: ConfigFieldKind.Select,
      label: 'How many years of professional experience do you have?',
      previewLabel: 'Years of experience',
      options: TECH_LEADER_FORM_OPTIONS.yearsOfExperience,
    },
    {
      name: 'organizationExperienceTypes',
      type: ConfigFieldKind.Checklist,
      label: 'In what kinds of organizations did you gain the majority of your technology experience?',
      previewLabel: 'Organization experience types',
      instruction: 'Select up to 3 options.',
      fields: TECH_LEADER_FORM_OPTIONS.organizationExperienceTypes,
      maxSelections: 3,
    },
    {
      name: 'goalsForBoardService',
      type: ConfigFieldKind.Checklist,
      label: 'What do you most hope to get out of nonprofit board service?',
      previewLabel: 'Goals for board service',
      instruction: 'Select up to 3 options.',
      fields: TECH_LEADER_FORM_OPTIONS.goalsForBoardService,
      maxSelections: 3,
    },
    {
      name: 'additionalMotivation',
      type: ConfigFieldKind.Textarea,
      label: 'Please tell us a little more about what motivates you to join a nonprofit board.',
      previewLabel: 'Additional motivation',
    },
    {
      name: 'nonprofitFocusAreas',
      type: ConfigFieldKind.Checklist,
      label: 'Which of these nonprofit focus areas interest you?',
      previewLabel: 'Nonprofit focus areas',
      instruction: 'Please select all that apply to increase the likelihood of a match.',
      fields: TECH_LEADER_FOCUS_AREAS,
    },
    //DELL custom non profit areas field
    {
      name: 'nonprofitFocusAreasDell',
      type: ConfigFieldKind.Textarea,
      label: 'What nonprofit focus areas are you interested in? (optional)',
      previewLabel: 'Nonprofit focus areas (DELL)',
      optional: true,
    },
    {
      name: 'idealNonprofitCommunity',
      type: ConfigFieldKind.Textarea,
      label: 'Are there any specific communities your ideal nonprofit match would serve? (optional)',
      optional: true,
      previewLabel: 'Ideal nonprofit community',
    },

    {
      name: 'priorExperienceOrConnection',
      type: ConfigFieldKind.Textarea,
      label:
        'Do you have any prior experience with – or personal connection to – any of the cause areas or communities that you selected? (optional)',
      optional: true,
      previewLabel: 'Prior experience or connection',
    },
  ],
  2: [
    {
      name: 'nonprofitGeographicalReachPreference',
      type: ConfigFieldKind.Radio,
      label: 'What geographical reach or scope do you prefer in a nonprofit match?',
      previewLabel: 'Geographical reach',
      options: TECH_LEADER_FORM_OPTIONS.nonprofitGeographicalReachPreference,
    },
    {
      name: 'nonprofitStagePreference',
      type: ConfigFieldKind.Radio,
      label: "Any preference for a nonprofit match's stage or culture?",
      previewLabel: 'Stage preference',
      options: [
        { value: 'earlyStage', label: 'Early-stage organization or “startup” culture' },
        { value: 'longEstablished', label: 'Long-established organization or more traditional “corporate” culture' },
        { value: 'noPreference', label: 'No preference' },
      ],
    },
    {
      name: 'nonprofitTechPrioritiesPreference',
      type: ConfigFieldKind.Checklist,
      label: "Any preference for a nonprofit match's current or future tech priorities? (select up to 3)",
      previewLabel: 'Tech priorities preference',
      fields: TECH_LEADER_FORM_OPTIONS.nonprofitTechPrioritiesPreference,
      maxSelections: 3,
    },
    {
      name: 'boardMeetingPreference',
      type: ConfigFieldKind.Radio,
      label: 'Do you prefer virtual or in-person board meetings?',
      previewLabel: 'Board meeting preference',
      options: TECH_LEADER_FORM_OPTIONS.boardMeetingPreference,
    },
  ],
  3: [
    {
      name: 'executiveTechPitching',
      type: ConfigFieldKind.Scale,
      scale: { min: 'No experience', max: 'Very often or daily' },
      sectionTitle: 'How would you rate your comfort level in the following areas?',
      label: 'Understanding and pitching tech solutions and investments at the executive level',
      previewLabel: 'Executive tech pitching',
    },

    {
      name: 'techRiskManagement',
      type: ConfigFieldKind.Scale,
      scale: {
        min: 'No experience',
        max: 'Led a relevant tech function or organization at at least one company (e.g. CISO)',
      },
      label:
        'Technology risk management (Evaluating and addressing potential risks and vulnerabilities in digital infrastructure, systems, and processes)',
      previewLabel: 'Technology risk management',
    },
    {
      name: 'techStrategyPlanning',
      type: ConfigFieldKind.Scale,
      scale: { min: 'No experience', max: 'Led a relevant function at multiple companies (e.g. CTO, CIO)' },
      label:
        'Tech strategy and planning (Needs assessment, identifying technologies that will drive company growth and innovation, building tech roadmaps including IT infrastructure, etc.)',
      previewLabel: 'Building tech strategy',
    },

    {
      name: 'networkLeveraging',
      type: ConfigFieldKind.Scale,
      scale: { min: 'No network', max: 'Very strong network and very comfortable leveraging it' },
      label: 'Leveraging your professional network to explore or solve a business problem',
      previewLabel: 'Personal networking',
    },

    {
      name: 'exploratoryTechConversations',
      type: ConfigFieldKind.Scale,
      scale: { min: 'None', max: 'Expert' },
      previewLabel: 'Exploratory tech conversations',
      label:
        'Facilitating exploratory conversations with non-technical executives around potential impacts and opportunities of emerging technology',
    },

    {
      name: 'consultingExperience',
      type: ConfigFieldKind.Scale,
      scale: { min: 'None', max: 'Paid consultant' },
      label:
        'Consulting (diagnosing organizational challenges and advising on next steps or calling in expert support)',
      previewLabel: 'Consulting',
    },
    {
      name: 'knowledgeOfNonprofitSector',
      type: ConfigFieldKind.Scale,
      scale: { min: 'None', max: 'Highly informed' },
      label: 'How would you rate your knowledge of the nonprofit sector?',
      previewLabel: 'Nonprofit knowledge',
    },

    {
      name: 'techExpertiseAreas',
      type: ConfigFieldKind.Checklist,
      label: 'How would you describe your primary area(s) of technology expertise? (select up to 4)',
      previewLabel: 'Tech expertise areas',
      fields: TECH_LEADER_FORM_OPTIONS.techExpertiseAreas,
      maxSelections: 4,
    },
    {
      name: 'previousNonprofitBoardExperience',
      type: ConfigFieldKind.Radio,
      label: 'Do you have any previous nonprofit board experience?',
      previewLabel: 'Previous nonprofit board experience',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
    },
    {
      name: 'nonprofitWorkingExperience',
      type: ConfigFieldKind.Textarea,
      previewLabel: 'Nonprofit working experience',
      label:
        'Please share any relevant experience you have had with the nonprofit sector. Examples might include: working for a nonprofit, providing paid consulting services, working with nonprofits as customers, volunteering, providing pro bono services, and/or fundraising.',
      instruction:
        "If you've had a lot of nonprofit experiences, feel free to call out only the experiences that you think matter most.",
    },
    {
      name: 'timeCommitment',
      type: ConfigFieldKind.Radio,
      label:
        "Are you ready to invest your time and energy into joining a nonprofit board? The needs for each nonprofit vary, but you'll be expected to attend regular board meetings as well as (potentially) a board sub-committee meeting, and you will usually have reading or preparation to complete in advance. Plus, you may spend additional time supporting the CEO on strategic questions and projects. In total, you can expect to spend 5-10 hours per quarter on your board service. Are you able to commit to that time investment?",
      previewLabel: 'Ready to invest time in board service',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
    },

    {
      name: 'financialContributionComfort',
      type: ConfigFieldKind.Radio,
      label:
        'In addition to board service, nonprofit board members typically support their organization’s mission by making a financial contribution. The expectation in terms of contribution amount will vary for each nonprofit and is often flexible. We can provide you with more specific information when you receive a proposed match with a nonprofit, and you can then discuss it with the CEO or Board Chair. Are you generally comfortable with this as a possible requirement?',
      previewLabel: 'Comfortable with financial contribution as requirement',
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
    },
    {
      name: 'roleDescriptionExcitement',
      type: ConfigFieldKind.Textarea,
      label: 'Is there anything in the role description that you are particularly excited about? (optional)',
      optional: true,
      previewLabel: 'Exciting  aspects of role description',
    },
    {
      name: 'roleDescriptionConcerns',
      type: ConfigFieldKind.Textarea,
      label: 'Is there anything in the role description that you are unsure or less excited about? (optional)',
      optional: true,
      previewLabel: 'Unsure or less exciting aspects of role description',
    },
  ],
  4: [
    {
      name: 'somethingWeDidntAskButShouldHave',
      type: ConfigFieldKind.Textarea,
      label: "Is there something we didn't ask that we should have? (optional)",
      previewLabel: "Something we didn't ask but should have",
      optional: true,
    },
    {
      name: 'feedbackOrQuestions',
      type: ConfigFieldKind.Textarea,
      label:
        'We regularly reevaluate and update this assessment. Do you have any feedback or questions for us? (optional)',
      optional: true,
      previewLabel: 'Feedback or questions',
    },
  ],
};
