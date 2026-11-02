import { makeAutoObservable, runInAction } from 'mobx';
import dayjs from 'dayjs';
import { RootStore } from '@/RootStore';
import { DELL_FORM_DATA, DELL_TECHNOLOGIES_ID } from '@/corporateClients/CUSTOM_FORM_DATA_FOR_DELL_TECH/dellFormData';
import { UNKNOWN_USER_ROLE } from '@/domain/constants';
import { NPO_FORM_CONFIG } from '@/forms/NPOform/npoFormConfig';
import { TECH_LEADER_FORM_CONFIG } from '@/forms/techLeaderForm/techLeaderFormConfig';
import {
  showErrorToast,
  API_ERROR_STATUS_TYPE,
  getWaitingForMatchTime,
  convertFirstLetterToLower,
  parseFieldsToStringArray,
} from '@/utils/helpers';
import { formatDate, DATE_FORMAT } from '@/utils/helpers';
import { UserFormField } from '../../forms/types';
import * as requests from '../requests';
import {
  EditUserParams,
  RawUser,
  RawUserRole,
  User,
  UserEditFormData,
  UserFormData,
  UserIdentityType,
  UserRole,
} from '../types';

const DAYS_TO_QUALIFY_AS_NEW = 3;

class UserStore {
  rootStore: RootStore;
  loadingUser = false;
  loadingAvatar = false;

  selectedUser: User | null = null;
  submitting = false;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  modelUser = (user: RawUser): User => {
    const email =
      user.identities?.find(({ type }) => type === UserIdentityType.MailAddress)?.value || user.email || 'Unknown';

    const type = UserRole[user.roles[0]] ?? UNKNOWN_USER_ROLE;

    const formattedFormData = user.formData.map((field: UserFormField) => ({
      ...field,
      key: convertFirstLetterToLower(field.key),
    }));

    const isConnectedWithDellCompany =
      user.corporateClientId === DELL_TECHNOLOGIES_ID && user.roles[0] === RawUserRole.TechLeader;

    const mappedInterests = parseFieldsToStringArray(formattedFormData, isConnectedWithDellCompany);

    return {
      ...user,
      email,
      formattedCreatedAt: formatDate(user.createdAt, DATE_FORMAT.FULL),
      formattedLastFormUpdateAt: formatDate(user.lastFormUpdateAt, DATE_FORMAT.FULL),
      matchWaitingTime: getWaitingForMatchTime(user.createdAt, !!user.match),
      type,
      isNewUser: dayjs().diff(dayjs(user.createdAt), 'day') <= DAYS_TO_QUALIFY_AS_NEW,
      formattedFormData,
      interests: mappedInterests,
      isConnectedWithDellCompany,
    };
  };

  setSelectedUserById = (userId: string): void => {
    const { users } = this.rootStore.usersStore;
    const user = users.find((user) => user.id === userId);

    if (!user) return;

    runInAction(() => {
      this.selectedUser = user;
    });
  };

  fetchAvatarDetails = async (userId: string): Promise<User | undefined> => {
    const { modelUser } = this.rootStore.userStore;

    runInAction(() => {
      this.loadingAvatar = true;
    });

    try {
      const { data } = await requests.fetchUsers({ id: [userId] });

      if (data) {
        return modelUser(data.results[0]);
      } else return undefined;
    } catch (err) {
      return undefined;
    } finally {
      runInAction(() => {
        this.loadingAvatar = false;
      });
    }
  };

  fetchUser = ({
    userId,
    initializeFormData,
  }: {
    userId: string;
    initializeFormData?: boolean;
  }): Promise<User | void> => {
    const { toastMessages } = this.rootStore.toastsStore;
    const { initializeFormFromFormattedData, updateUserFormField } = this.rootStore.formStore;
    const { fetchCustomFormQuestions } = this.rootStore.corporateClientStore;
    runInAction(() => (this.loadingUser = true));

    return requests
      .fetchUsers({ id: [userId] })
      .then(({ data }) => {
        const user = this.modelUser(data.results[0]);

        runInAction(() => (this.selectedUser = user));

        if (initializeFormData && this.selectedUser) {
          this.selectedUser.corporateClientId && fetchCustomFormQuestions(this.selectedUser.corporateClientId);

          const isNpoUser = this.selectedUser.roles.includes(RawUserRole.NPO);
          const formConfig = isNpoUser ? NPO_FORM_CONFIG : TECH_LEADER_FORM_CONFIG;

          initializeFormFromFormattedData(this.selectedUser.formattedFormData, isNpoUser);

          //HARDCODED form values for users connected with DELL INC.
          if (this.selectedUser.isConnectedWithDellCompany) {
            DELL_FORM_DATA.forEach(({ key, value }) => {
              updateUserFormField(formConfig, key, value);
            });
          }
        }

        return user;
      })
      .catch((err) => {
        showErrorToast({ default: toastMessages.USERS.USER_FETCH_ERROR }, err);
      })
      .finally(() => {
        runInAction(() => (this.loadingUser = false));
      });
  };

  createUser = (user: UserFormData): Promise<void> => {
    const { addToast, toastMessages } = this.rootStore.toastsStore;
    runInAction(() => (this.submitting = true));

    return requests
      .createUser(user)
      .then(() => {
        this.rootStore.usersStore.fetchUsers();
        addToast(toastMessages.USERS.CREATE_SUCCESS, 'success');
      })
      .catch((err) =>
        showErrorToast(
          {
            409: { [API_ERROR_STATUS_TYPE.DUPLICATED_USER]: toastMessages.USERS.ALREADY_EXISTS },
            default: toastMessages.USERS.CREATE_ERROR,
          },
          err
        )
      )
      .finally(() => runInAction(() => (this.submitting = false)));
  };

  updateUser = ({
    name,
    primaryContactFullName,
    role,
    corporateClientId,
    isBlocked = false,
    formCompleted,
    accessToTrainingMaterials,
    trainingMaterialsUrl,
  }: EditUserParams): Promise<void> => {
    const { addToast, toastMessages } = this.rootStore.toastsStore;
    runInAction(() => (this.submitting = true));

    if (!this.selectedUser) return Promise.resolve();

    const formData: UserEditFormData = {
      userId: this.selectedUser.id,
      name: name ? name : this.selectedUser.name,
      primaryContactFullName: primaryContactFullName,
      roles: [role || RawUserRole[this.selectedUser.roles[0]]],
      corporateClientId,
      isBlocked,
      formCompleted,
      accessToTrainingMaterials,
      trainingMaterialsUrl,
    };

    return requests
      .updateUser(formData)
      .then(() => {
        runInAction(() => {
          if (this.selectedUser) {
            this.selectedUser = {
              ...this.selectedUser,
              name: formData.name,
              type: UserRole[formData.roles[0]],
              corporateClientId: formData.corporateClientId,
              isBlocked: formData.isBlocked,
              accessToTrainingMaterials: Boolean(formData.accessToTrainingMaterials),
              trainingMaterialsUrl: formData.trainingMaterialsUrl ?? '',
            };
          }
        });

        addToast(toastMessages.USERS.UPDATE_SUCCESS, 'success');
      })
      .catch((err) =>
        showErrorToast(
          {
            404: toastMessages.USERS.NO_USER,
            default: toastMessages.USERS.UPDATE_ERROR,
          },
          err
        )
      )
      .finally(() => runInAction(() => (this.submitting = false)));
  };

  deleteUser = (userId: string): Promise<void> => {
    const { addToast, toastMessages } = this.rootStore.toastsStore;
    runInAction(() => (this.submitting = true));

    return requests
      .deleteUser(userId)
      .then(() =>
        runInAction(() => {
          addToast(toastMessages.USERS.DELETE_SUCCESS, 'success');
        })
      )
      .catch((err) =>
        showErrorToast({ 404: toastMessages.USERS.NO_USER, default: toastMessages.USERS.DELETE_ERROR }, err)
      )
      .finally(() => runInAction(() => (this.submitting = false)));
  };
}

export default UserStore;
