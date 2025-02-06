export interface CalendlyUserResponse {
  resource: {
    uri: string;
  };
}

export interface CalendlyEventType {
  scheduling_url: string;
}

export interface CalendlyEventResponse {
  collection: CalendlyEventType[];
}

export interface UpdateUserData {
  scheduledEventUrls: string[];
}

export interface TokenDocument {
  calendlyRefreshToken: string;
}
