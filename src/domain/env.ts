declare global {
  interface Window {
    env: { [key: string]: string };
  }
}

export type Env = {
  backendUrl: string;
  environment: string;
  publicUrl: string;
};

function fetchEnv(name: string, defaultValue = ''): string {
  if (typeof window === 'undefined') return defaultValue;
  return import.meta.env?.[`VITE_${name}`] ?? (window['env'] ? window['env'][name] : null) ?? defaultValue;
}

const env: Env = {
  backendUrl: fetchEnv('API_BASE_URL'),
  environment: fetchEnv('MODE'),
  publicUrl: fetchEnv('PUBLIC_URL'),
};

export default env;
