const LOCAL_STORAGE_APP_NAME = 'board_dev';

export const LOCAL_STORAGE_AUTH_NAME = {
  ACCESS_TOKEN: `${LOCAL_STORAGE_APP_NAME}__auth__access_tok_${location.hostname}`,
  DEVICE_ID: `${LOCAL_STORAGE_APP_NAME}__auth__device_id_${location.hostname}`,
  REFRESH_TOKEN: `${LOCAL_STORAGE_APP_NAME}__auth__ref_tok_${location.hostname}`,
};
