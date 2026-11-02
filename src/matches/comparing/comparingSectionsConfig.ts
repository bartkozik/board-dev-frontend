import { ConfigFieldKind } from '@/forms/types';
import { NonAdminUserRole, RawUserRole } from '@/users/types';
import { Section, Subsection } from '../types';

const blankField = { label: ' ', keyName: ' ', compareId: 'blank' };

export const comparingSectionsConfig: Record<NonAdminUserRole, (Section | Subsection)[]> = {
  [RawUserRole.TechLeader]: [
    {
      id: 'location',
      title: 'Location & Meeting Preferences',
      fields: [
        { label: 'City:', keyName: 'City', compareId: 'city' },
        { label: 'State:', keyName: 'State', compareId: 'state' },
        {
          label: 'Meeting Format Preferences:',
          keyName: 'BoardMeetingPreference',
          type: ConfigFieldKind.Radio,
          compareId: 'meetingFormat',
        },
        {
          label: 'Geographical reach:',
          keyName: 'NonprofitGeographicalReachPreference',
          type: ConfigFieldKind.Radio,
          compareId: 'geoReach',
        },

        { ...blankField, compareId: 'boardMemberLocation' },
      ],
    },
    {
      id: 'causes',
      title: 'Cause Area & Beneficiaries',
      fields: [
        {
          label: 'Focus areas:',
          keyName: 'NonprofitFocusAreas',
          type: ConfigFieldKind.Checklist,
          compareId: 'focusAreas',
        },
        //Custom question form Dell users
        {
          label: 'Focus areas:',
          keyName: 'NonprofitFocusAreasDell',
          compareId: 'focusAreas',
        },
        {
          label: 'Specific communities or individuals:',
          keyName: 'IdealNonprofitCommunity',
          compareId: 'specificCommunity',
        },
        {
          label: 'Experience with any of the cause areas or communities:',
          keyName: 'PriorExperienceOrConnection',
          compareId: 'priorExperience',
        },
      ],
    },
    {
      id: 'board',
      title: 'Calibrating TL Seniority/Qualification with Board',
      subsections: [
        {
          id: 'seniorityLevel',
          title: '-> Seniority of Board',
          fields: [
            {
              label: 'Position of responsibility:',
              keyName: 'PositionOfResponsibility',
              type: ConfigFieldKind.Radio,
              compareId: 'responsibilityPosition',
            },
            {
              label: 'Years of experience:',
              keyName: 'YearsOfExperience',
              type: ConfigFieldKind.Select,
              compareId: 'boardExperienceYears',
            },
          ],
        },
        {
          id: 'seniorityBasedOnSizeAndIndustry',
          title: '-> Contextualizing title/seniority based on size of company and industry',
          fields: [
            { label: 'Company:', keyName: 'Company', compareId: 'companyName' },
            {
              label: 'Industry:',
              keyName: 'CompanyIndustry',
              type: ConfigFieldKind.Select,
              compareId: 'companyIndustry',
            },
            {
              label: 'Number of employees:',
              keyName: 'CompanyEmployees',
              type: ConfigFieldKind.Select,
              compareId: 'companyEmployees',
            },
          ],
        },
        {
          id: 'ageStageAndCulturePreferences',
          title: '-> Preferences for age, stage, culture of the organization',
          fields: [
            {
              label: 'Organization experience types:',
              keyName: 'OrganizationExperienceTypes',
              type: ConfigFieldKind.Checklist,
              compareId: 'orgExperienceTypes',
            },

            { ...blankField, compareId: 'yearsInOperation' },
          ],
        },
      ],
    },
    {
      id: 'interests',
      title: 'TL Tech Expertise & Interests',
      fields: [
        { label: 'Role:', keyName: 'Role', compareId: 'role' },
        {
          label: 'Tech expertise areas:',
          keyName: 'TechExpertiseAreas',
          type: ConfigFieldKind.Checklist,
          compareId: 'techExpertise',
        },
        {
          label: 'Tech priorities preference:',
          keyName: 'NonprofitTechPrioritiesPreference',
          type: ConfigFieldKind.Checklist,
          compareId: 'techPriorities',
        },
      ],
    },
    {
      id: 'boardRequirements',
      title: "NPO's Requirements for Board Members",
      fields: [
        {
          label: 'Previous nonprofit board experience:',
          keyName: 'PreviousNonprofitBoardExperience',
          type: ConfigFieldKind.Radio,
          compareId: 'prevBoardExperience',
        },
        {
          label: 'Comfortable with financial contribution as requirement:',
          keyName: 'FinancialContributionComfort',
          type: ConfigFieldKind.Radio,
          compareId: 'financialContribution',
        },
        {
          label: 'Ready to invest time in board service:',
          keyName: 'TimeCommitment',
          type: ConfigFieldKind.Radio,
          compareId: 'timeCommitment',
        },
      ],
    },
    {
      id: 'fit',
      title: '“Fit” - Org and Board Culture and Environment',
      fields: [
        {
          label: 'Stage preference:',
          keyName: 'NonprofitStagePreference',
          type: ConfigFieldKind.Radio,
          compareId: 'stagePreference',
        },
      ],
    },
  ],

  [RawUserRole.NPO]: [
    {
      id: 'location',
      title: 'Location & Meeting Preferences',
      fields: [
        {
          label: 'City:',
          keyName: 'OrganizationHQCity',
          compareId: 'city',
        },
        {
          label: 'State:',
          keyName: 'OrganizationHQState',
          compareId: 'state',
        },
        {
          label: 'Meeting Format Preferences:',
          keyName: 'BoardMeetingLocation',
          type: ConfigFieldKind.Radio,
          compareId: 'meetingFormat',
        },
        {
          label: 'Geographical Scope:',
          keyName: 'GeographicalScope',
          type: ConfigFieldKind.Radio,
          compareId: 'geoReach',
        },
        {
          label: 'Board members required to be in this city:',
          keyName: 'RequireBoardMembersLocation',
          type: ConfigFieldKind.Radio,
          compareId: 'boardMemberLocation',
        },
      ],
    },
    {
      id: 'causes',
      title: 'Cause Area & Beneficiaries',
      fields: [
        {
          label: 'Area of interest:',
          keyName: 'Causes',
          type: ConfigFieldKind.Checklist,
          compareId: 'focusAreas',
        },
        {
          label: 'Mission:',
          keyName: 'MissionStatement',
          compareId: 'specificCommunity',
        },
        {
          label: 'Primary Recipient:',
          keyName: 'PrimaryRecipient',
          compareId: 'priorExperience',
        },
      ],
    },
    {
      id: 'board',
      title: 'Calibrating TL Seniority/Qualification with Board',
      subsections: [
        {
          id: 'seniorityLevel',
          title: '-> Seniority of Board',
          fields: [
            {
              label: 'Experience profiles of board members:',
              keyName: 'BoardMemberExperienceProfiles',
              type: ConfigFieldKind.Checklist,
              compareId: 'responsibilityPosition',
            },
            {
              label: 'Typical years of board member experience:',
              keyName: 'AverageBoardMemberExperience',
              type: ConfigFieldKind.Select,
              compareId: 'boardExperienceYears',
            },
          ],
        },
        {
          id: 'seniorityBasedOnSizeAndIndustry',
          title: '-> Contextualizing title/seniority based on size of company and industry',

          fields: [
            { ...blankField, compareId: 'companyName' },
            { ...blankField, compareId: 'companyIndustry' },
            { ...blankField, compareId: 'companyEmployees' },
          ],
        },
        {
          id: 'ageStageAndCulturePreferences',
          title: '-> Preferences for age, stage, culture of the organization',
          fields: [
            {
              label: 'Operating Budget:',
              keyName: 'OperatingBudget',
              type: ConfigFieldKind.Radio,
              compareId: 'orgExperienceTypes',
            },
            {
              label: 'Years in Operation:',
              keyName: 'YearsInOperation',
              type: ConfigFieldKind.Radio,
              compareId: 'yearsInOperation',
            },
          ],
        },
      ],
    },
    {
      id: 'interests',
      title: 'NPO Goals and Needs',
      fields: [
        {
          label: 'Biggest technology challenge or opportunity:',
          keyName: 'BiggestTechnologyChallengeOrOpportunity',
          compareId: 'role',
        },
        {
          label: 'Technology priorities:',
          keyName: 'TechPriorities',
          type: ConfigFieldKind.Checklist,
          compareId: 'techExpertise',
        },

        { ...blankField, compareId: 'techPriorities' },
      ],
    },
    {
      id: 'boardRequirements',
      title: "NPO's Requirements for Board Members",
      fields: [
        {
          label: 'Nonprofit board experience required:',
          keyName: 'NonprofitBoardExperienceRequirement',
          type: ConfigFieldKind.Checkbox,
          compareId: 'prevBoardExperience',
        },
        {
          label: 'Direct donation from board members:',
          keyName: 'BoardMemberDirectDonation',
          type: ConfigFieldKind.Select,
          compareId: 'financialContribution',
        },

        { ...blankField, compareId: 'timeCommitment' },
      ],
    },
    {
      id: 'fit',
      title: '“Fit” - Org and Board Culture and Environment',
      fields: [
        {
          label: 'Organization type preference:',
          keyName: 'OrganizationType',
          type: ConfigFieldKind.Radio,
          compareId: 'stagePreference',
        },
      ],
    },
  ],
};
