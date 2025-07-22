import {createConfig, str} from '@shipfox/config';

export const config = createConfig({
  GOOGLE_CLOUD_PROJECT_ID: str(),
});
