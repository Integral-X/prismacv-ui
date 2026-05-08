import 'server-only';

import { apiClient } from '@/shared/http/api-client';
import type {
  FeatureFlagContract,
  FeaturesListPayload,
  UnleashStatusPayload,
} from './contracts';

export async function getFeatureFlagList(): Promise<FeatureFlagContract[]> {
  const payload = await apiClient.get<FeaturesListPayload>('features');
  return payload.data;
}

export async function getUnleashServiceStatus(): Promise<
  UnleashStatusPayload['unleash']
> {
  const payload = await apiClient.get<UnleashStatusPayload>('features/status');
  return payload.unleash;
}
