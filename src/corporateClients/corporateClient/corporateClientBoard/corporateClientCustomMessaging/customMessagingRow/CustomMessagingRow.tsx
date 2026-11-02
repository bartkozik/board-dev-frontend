import { observer } from 'mobx-react-lite';
import { useStores } from '@/RootStore';
import { CustomMessaging, MessageField, MessageKeys, MessageValue } from '@/corporateClients/types';
import { INSTRUCTIONS } from '@/domain/instructions';
import Button from '@/theme/button';
import TextArea from '@/theme/textArea';
import { RawUserRole } from '@/users/types';
import styles from './CustomMessagingRow.module.scss';

interface CustomMessagingRowProps {
  sectionKey: RawUserRole;
  labelKey: CustomMessaging;
  values: MessageValue[];
}

const CustomMessagingRow = ({ sectionKey, labelKey, values }: CustomMessagingRowProps): JSX.Element => {
  const { corporateClientStore } = useStores();
  const { setMessageValue, updateMessageValue, initializeCustomMessaging, corporateClient } = corporateClientStore;

  const fields = values.find((group) => group.key === labelKey)?.fields || [];

  const handleTextAreaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      updateMessageValue(sectionKey, labelKey, e.currentTarget.value);
      initializeCustomMessaging(sectionKey, labelKey);
      e.currentTarget.blur();
    }
  };

  const handleSaveMessage = (): void => {
    const customField = fields.find((field) => field.key === MessageKeys.Custom);
    if (customField) {
      updateMessageValue(sectionKey, labelKey, customField.value);
      initializeCustomMessaging(sectionKey, labelKey);
    }
  };

  const renderLabel = (mainLabel: string, isActive: boolean): JSX.Element => {
    return (
      <label className={styles.label}>
        {mainLabel}
        {isActive && <span>(currently active)</span>}
      </label>
    );
  };

  const hasCustomValueChanged = (): boolean => {
    const customField = fields.find((field) => field.key === MessageKeys.Custom);
    const customValue = customField?.value || '';
    const storedValue = corporateClient?.[labelKey] || '';
    return customValue.trim() !== storedValue.trim();
  };

  const determineActiveField = (): string => {
    const customStoreValue = corporateClient?.[labelKey];
    if (customStoreValue) return MessageKeys.Custom;

    return MessageKeys.Default;
  };

  return (
    <div className={styles.root}>
      <div className={styles.textAreaContainer}>
        {fields.map((message: MessageField) => {
          const isMessageActive = message.key === determineActiveField();

          return (
            <TextArea
              key={message.key}
              name={message.key}
              label={renderLabel(message.label, isMessageActive)}
              value={message.value}
              disabled={message.key === MessageKeys.Default}
              onChange={(e) => setMessageValue(sectionKey, labelKey, message.key, e.target.value)}
              placeholder={INSTRUCTIONS.corporate.customMessageSubmit}
              onKeyDown={handleTextAreaKeyDown}
            />
          );
        })}
      </div>
      <Button onClick={handleSaveMessage} text="Save message" variant="text" disabled={!hasCustomValueChanged()} />
    </div>
  );
};

export default observer(CustomMessagingRow);
