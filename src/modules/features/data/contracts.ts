export interface FeatureFlagContract {
  name: string;
  enabled: boolean;
  description?: string;
  type?: string;
}

export interface FeaturesListPayload {
  success: boolean;
  data: FeatureFlagContract[];
  total: number;
}

export interface UnleashStatusPayload {
  success: boolean;
  unleash: {
    connected: boolean;
    totalFeatures: number;
    enabledFeatures: number;
    disabledFeatures: number;
  };
  timestamp: string;
}
