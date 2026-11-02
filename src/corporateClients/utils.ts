import { CustomMessaging, MessageKeys, MessageValue } from './types';

export const createInitialMessaging = (
  welcomeKey: CustomMessaging,
  thankYouKey: CustomMessaging,
  welcomeValue: string,
  thankYouValue: string
): MessageValue[] => {
  const msgRecipient = welcomeKey.includes('npo') ? 'Nonprofits' : 'Tech Leaders';
  return [
    {
      key: welcomeKey,
      fields: [
        {
          key: MessageKeys.Default,
          label: `Default welcome message for ${msgRecipient}`,
          value: welcomeValue,
        },
        { key: MessageKeys.Custom, label: `Your welcome message for ${msgRecipient}`, value: '' },
      ],
    },
    {
      key: thankYouKey,
      fields: [
        {
          key: MessageKeys.Default,
          label: `Default thank you message for ${msgRecipient}`,
          value: thankYouValue,
        },
        { key: MessageKeys.Custom, label: `Your thank you message for ${msgRecipient}`, value: '' },
      ],
    },
  ];
};
