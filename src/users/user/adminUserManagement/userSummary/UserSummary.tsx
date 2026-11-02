import { useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { z } from 'zod';
import { useStores } from '@/RootStore';
import Button from '@/theme/button';
import CustomPrompt from '@/theme/customPrompt';
import DetailsLayout from '@/theme/detailsLayout';
import SummaryPreview from '@/theme/summaryPreview';
import SummaryWrapper from '@/theme/summaryWrapper';
import TextArea from '@/theme/textArea';
import { RawUserRole, UrlInfo } from '@/users/types';
import { useFormValidation } from '@/utils/hooks';
import styles from './UserSummary.module.scss';
import UserSummaryStore from './UserSummary.store';

const SUMMARY_FORM_FIELDS = [
  { key: 'shortSummary', label: 'Short summary' },
  { key: 'longSummary', label: 'Long summary' },
] as const;

const summarySchema = z.object({
  shortSummary: z.string().min(1, { message: 'Short summary is required' }),
  longSummary: z.string().min(1, { message: 'Long summary is required' }),
});

const UserSummary = (): JSX.Element => {
  const { userStore, toastsStore } = useStores();
  const summaryStore = useMemo(() => new UserSummaryStore(toastsStore), []);
  const { selectedUser, fetchUser } = userStore;
  const [isEditing, setIsEditing] = useState(false);

  const { formMethods } = useFormValidation(summarySchema, {
    shortSummary: selectedUser?.shortFormSummary,
    longSummary: selectedUser?.longFormSummary,
  });

  const {
    register,
    setValue,
    formState: { errors },
    clearErrors,
    handleSubmit,
  } = formMethods;

  const handleClickRegenerate = (prompt: string): void => {
    summaryStore.generateSummary(selectedUser?.id || '', prompt).then((summary) => {
      if (summary) {
        setValue('shortSummary', summary.shortSummary);
        setValue('longSummary', summary.longSummary);
      }
    });
  };

  if (!selectedUser) return <></>;

  const urls: UrlInfo[] = [
    {
      url: selectedUser.profileDescriptionUrl || '',
      text: 'Open profile ',
    },
    {
      url: (selectedUser.roles.includes(RawUserRole.NPO) && selectedUser.techFocusedDescriptionUrl) || '',
      text: 'Open role description',
    },
  ].filter((url) => url.url);

  const handleSave = handleSubmit((data) => {
    const { shortSummary, longSummary } = data;

    summaryStore
      .updateUserSummary({
        userId: selectedUser.id,
        shortFormSummary: shortSummary || '',
        longFormSummary: longSummary || '',
      })
      .then(() => {
        fetchUser({ userId: selectedUser.id });
        setIsEditing(false);
      });
  });

  const summaryForm = (
    <form onSubmit={handleSave} className={styles.wrapper}>
      <CustomPrompt onClick={handleClickRegenerate} loading={summaryStore.loading} />
      {SUMMARY_FORM_FIELDS.map(({ key, label }) => (
        <TextArea
          key={key}
          label={label}
          {...register(key)}
          onChange={(e) => {
            clearErrors(key);
            register(key).onChange(e);
          }}
          className={styles[key]}
          error={errors[key]?.message}
        />
      ))}
      <Button type="submit" text="Save changes" loading={summaryStore.submitting} disabled={summaryStore.loading} />
    </form>
  );

  const summaryPreview = (
    <SummaryPreview
      long={selectedUser.longFormSummary || ''}
      short={selectedUser.shortFormSummary || ''}
      urls={urls}
      onClick={() => setIsEditing(true)}
    />
  );

  return (
    <DetailsLayout>
      <SummaryWrapper>{isEditing ? summaryForm : summaryPreview}</SummaryWrapper>
    </DetailsLayout>
  );
};

export default observer(UserSummary);
