import { observer } from 'mobx-react-lite';
import clsx from 'clsx';
import { useStores } from '@/RootStore';
import { CustomMessagesSection, CustomMessaging } from '@/corporateClients/types';
import { INSTRUCTIONS } from '@/domain/instructions';
import DetailsLayout from '@/theme/detailsLayout/';
import PageHeader from '@/theme/pageHeader';
import { RawUserRole } from '@/users/types';
import styles from './CorporateClientCustomMessaging.module.scss';
import CustomMessagingRow from './customMessagingRow';

const CorporateClientCustomMessaging = (): JSX.Element => {
  const { corporateClientStore } = useStores();
  const { customMessaging } = corporateClientStore;

  const sections: CustomMessagesSection[] = [
    {
      title: 'Welcome Messages',
      textAreaGroups: [
        {
          sectionKey: RawUserRole.TechLeader,
          labelKey: CustomMessaging.TECH_LEADER_WELCOME,
          values: customMessaging.techLeader,
        },
        { sectionKey: RawUserRole.NPO, labelKey: CustomMessaging.NPO_WELCOME, values: customMessaging.npo },
      ],
    },
    {
      title: 'Thank You Messages',
      textAreaGroups: [
        {
          sectionKey: RawUserRole.TechLeader,
          labelKey: CustomMessaging.TECH_LEADER_THANK_YOU,
          values: customMessaging.techLeader,
        },
        { sectionKey: RawUserRole.NPO, labelKey: CustomMessaging.NPO_THANK_YOU, values: customMessaging.npo },
      ],
    },
  ];

  return (
    <DetailsLayout>
      <PageHeader title="Change the default messaging company's users see" titleSize="small" />
      <span className={styles.instruction}>{INSTRUCTIONS.corporate.customMessage}</span>
      <div className={styles.messages}>
        {sections.map((section, index) => (
          <div
            key={section.title}
            className={clsx(styles.section, {
              [styles.withBorder]: index === 0,
            })}
          >
            {section.textAreaGroups.map((item, index) => (
              <div
                key={item.labelKey}
                className={clsx(styles.sectionRow, {
                  [styles.withBottomBorder]: index !== section.textAreaGroups.length - 1,
                })}
              >
                <CustomMessagingRow sectionKey={item.sectionKey} labelKey={item.labelKey} values={item.values} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </DetailsLayout>
  );
};

export default observer(CorporateClientCustomMessaging);
