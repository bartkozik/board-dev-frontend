export const SUPPORT_EMAIL = 'support@example.invalid';
export const HOME_PAGE = 'https://example.invalid';

export const DEFAULT_PAGE_SIZE = 25;

export const UNKNOWN_USER_ROLE = 'Not selected' as const;

export const DEFAULT_PAGINATION_PARAMS = {
  pageNumber: 1,
  pageSize: DEFAULT_PAGE_SIZE,
};

export const DEFAULT_FORM_MESSAGES = {
  WELCOME: {
    TECH_LEADER:
      "We're glad you're interested in tech board leadership! By sharing more information in the form below, you'll help us ensure a strong match with a nonprofit that needs your expertise.",
    NPO: 'Thank you for your interest in a tech-focused board candidate! Completing the following assessment will help to ensure a match with a tech leader whose skills and passion align with your mission and needs.',
  },
  THANK_YOU: {
    TECH_LEADER: " Thank you for submitting the assessment. We're reviewing your responses now.",
    NPO: " Thank you for submitting the assessment. We're reviewing your responses now.",
  },
};

export const LOCAL_STORAGE_FILTERS_KEY = 'filters_for_';
export const LOCAL_STORAGE_PREVIOUS_FILTERS_KEY = 'previous_filters_for_';
