// Custom Analytics Event Definitions
// Type-safe event tracking for GA4 and other platforms

export type ReadingType = 'daily' | 'three_card' | 'love_relationships' | 'career_money' | 'yes_no' | 'celtic_cross' | 'decision_making' | 'self_discovery' | 'relationship_deep_dive' | 'shadow_work' | 'chakra_alignment' | 'friendship' | 'career_path' | 'financial_abundance' | 'monthly_forecast' | 'year_ahead' | 'elemental_balance' | 'zodiac_wheel';

// ============================================================================
// Event Definitions
// ============================================================================

export const analyticsEvents = {
  // Reading Flow Events
  readingStarted: (readingType: ReadingType, questionProvided: boolean) => ({
    event: 'reading_started',
    reading_type: readingType,
    question_provided: questionProvided,
  }),

  cardSelected: (cardName: string, position: number, isReversed: boolean) => ({
    event: 'card_selected',
    card_name: cardName,
    position: position,
    is_reversed: isReversed,
  }),

  readingCompleted: (readingType: ReadingType, readingId: string, durationSeconds: number) => ({
    event: 'reading_completed',
    reading_type: readingType,
    reading_id: readingId,
    duration_seconds: durationSeconds,
  }),

  // User Interaction Events
  ctaClicked: (buttonName: string, page: string) => ({
    event: 'cta_clicked',
    button_name: buttonName,
    page: page,
  }),

  shareInitiated: (readingId: string, platform: string) => ({
    event: 'share_initiated',
    reading_id: readingId,
    platform: platform,
  }),

  // Reading Management Events
  readingSaved: (readingId: string, readingType: ReadingType) => ({
    event: 'reading_saved',
    reading_id: readingId,
    reading_type: readingType,
  }),

  readingDeleted: (readingId: string, readingType: ReadingType) => ({
    event: 'reading_deleted',
    reading_id: readingId,
    reading_type: readingType,
  }),

  // Card Interaction Events
  cardFlipped: (cardName: string, position: number) => ({
    event: 'card_flipped',
    card_name: cardName,
    position: position,
  }),

  cardDetailsViewed: (cardName: string, cardSlug: string) => ({
    event: 'card_details_viewed',
    card_name: cardName,
    card_slug: cardSlug,
  }),

  // Navigation Events
  pageViewed: (pageName: string, pageUrl: string) => ({
    event: 'page_view',
    page_name: pageName,
    page_url: pageUrl,
  }),

  // Error Events
  errorOccurred: (errorMessage: string, errorPage: string) => ({
    event: 'error_occurred',
    error_message: errorMessage,
    error_page: errorPage,
  }),

  // Love Spread Specific Events
  loveSpreadStarted: (questionProvided: boolean) => ({
    event: 'love_spread_started',
    question_provided: questionProvided,
  }),

  loveSpreadCompleted: (readingId: string, durationSeconds: number) => ({
    event: 'love_spread_completed',
    reading_id: readingId,
    duration_seconds: durationSeconds,
  }),

  // Login Gate Events
  loginPromptShown: (source: string) => ({
    event: 'login_prompt_shown',
    source: source,
  }),

  loginFromGate: (source: string) => ({
    event: 'login_from_gate',
    source: source,
  }),

  // Gate Conversion Events
  loginGateShown: (spreadType: string, spreadName: string) => ({
    event: 'login_gate_shown',
    spread_type: spreadType,
    spread_name: spreadName,
  }),

  signupFromGate: (spreadType: string, spreadName: string) => ({
    event: 'signup_from_gate',
    spread_type: spreadType,
    spread_name: spreadName,
  }),

  gateConversion: (spreadType: string, action: 'signup' | 'login', completedReading: boolean) => ({
    event: 'gate_conversion',
    spread_type: spreadType,
    action: action,
    completed_reading: completedReading,
  }),

  // Career Spread Specific Events
  careerSpreadStarted: (questionProvided: boolean) => ({
    event: 'career_spread_started',
    question_provided: questionProvided,
  }),

  careerSpreadCompleted: (readingId: string, durationSeconds: number) => ({
    event: 'career_spread_completed',
    reading_id: readingId,
    duration_seconds: durationSeconds,
  }),

  // Yes/No Spread Specific Events
  yesNoStarted: (questionLength: number) => ({
    event: 'yes_no_started',
    question_length: questionLength,
  }),

  yesNoCompleted: (readingId: string, answer: 'yes' | 'no' | 'maybe', durationSeconds: number) => ({
    event: 'yes_no_completed',
    reading_id: readingId,
    answer: answer,
    duration_seconds: durationSeconds,
  }),

  yesNoAnswerDistribution: (answer: 'yes' | 'no' | 'maybe', confidence: string) => ({
    event: 'yes_no_answer_distribution',
    answer: answer,
    confidence: confidence,
  }),

  // Signup Value Prop Events
  signupTriggerSpread: (spreadType: string) => ({
    event: 'signup_trigger_spread',
    spread_type: spreadType,
  }),

  unlockedSpreadsModalShown: () => ({
    event: 'unlocked_spreads_modal_shown',
  }),

  unlockedSpreadClicked: (spreadId: string, spreadName: string) => ({
    event: 'unlocked_spread_clicked',
    spread_id: spreadId,
    spread_name: spreadName,
  }),

  // Story 7.8: Spread Recommendation Events
  recommendationShown: (params: {
    questionLength: number;
    hasMatches: boolean;
    primaryCategory: string;
    recommendationCount: number;
    spreadIds: string;
  }) => ({
    event: 'recommendation_shown',
    question_length: params.questionLength,
    has_matches: params.hasMatches,
    primary_category: params.primaryCategory,
    recommendation_count: params.recommendationCount,
    spread_ids: params.spreadIds,
  }),

  recommendationClicked: (params: {
    spreadId: string;
    spreadName: string;
    isAccessible: boolean;
    matchCategory: string;
    matchScore: number;
  }) => ({
    event: 'recommendation_clicked',
    spread_id: params.spreadId,
    spread_name: params.spreadName,
    is_accessible: params.isAccessible,
    match_category: params.matchCategory,
    match_score: params.matchScore,
  }),

  recommendationAccepted: (params: {
    spreadId: string;
    spreadName: string;
    questionLength: number;
    hasQuestion: boolean;
    accepted: boolean;
  }) => ({
    event: 'recommendation_accepted',
    spread_id: params.spreadId,
    spread_name: params.spreadName,
    question_length: params.questionLength,
    has_question: params.hasQuestion,
    accepted: params.accepted,
  }),

  recommendationQuestionStarted: (source: string) => ({
    event: 'recommendation_question_started',
    source: source,
  }),
} as const;

// Export event names for reference
export const EVENT_NAMES = {
  READING_STARTED: 'reading_started',
  CARD_SELECTED: 'card_selected',
  READING_COMPLETED: 'reading_completed',
  CTA_CLICKED: 'cta_clicked',
  SHARE_INITIATED: 'share_initiated',
  READING_SAVED: 'reading_saved',
  READING_DELETED: 'reading_deleted',
  CARD_FLIPPED: 'card_flipped',
  CARD_DETAILS_VIEWED: 'card_details_viewed',
  PAGE_VIEWED: 'page_view',
  ERROR_OCCURRED: 'error_occurred',
  LOVE_SPREAD_STARTED: 'love_spread_started',
  LOVE_SPREAD_COMPLETED: 'love_spread_completed',
  LOGIN_PROMPT_SHOWN: 'login_prompt_shown',
  LOGIN_FROM_GATE: 'login_from_gate',
  LOGIN_GATE_SHOWN: 'login_gate_shown',
  SIGNUP_FROM_GATE: 'signup_from_gate',
  GATE_CONVERSION: 'gate_conversion',
  CAREER_SPREAD_STARTED: 'career_spread_started',
  CAREER_SPREAD_COMPLETED: 'career_spread_completed',
  YES_NO_STARTED: 'yes_no_started',
  YES_NO_COMPLETED: 'yes_no_completed',
  YES_NO_ANSWER_DISTRIBUTION: 'yes_no_answer_distribution',
  SIGNUP_TRIGGER_SPREAD: 'signup_trigger_spread',
  UNLOCKED_SPREADS_MODAL_SHOWN: 'unlocked_spreads_modal_shown',
  UNLOCKED_SPREAD_CLICKED: 'unlocked_spread_clicked',
  // Story 7.8: Recommendation Events
  RECOMMENDATION_SHOWN: 'recommendation_shown',
  RECOMMENDATION_CLICKED: 'recommendation_clicked',
  RECOMMENDATION_ACCEPTED: 'recommendation_accepted',
  RECOMMENDATION_QUESTION_STARTED: 'recommendation_question_started',
} as const;
