// Custom Analytics Event Definitions

export type ReadingType = 'daily' | 'three_card' | 'love_relationships' | 'career_money' | 'yes_no';

export const analyticsEvents = {
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
  pageViewed: (pageName: string, pageUrl: string) => ({
    event: 'page_view',
    page_name: pageName,
    page_url: pageUrl,
  }),
  errorOccurred: (errorMessage: string, errorPage: string) => ({
    event: 'error_occurred',
    error_message: errorMessage,
    error_page: errorPage,
  }),
  loveSpreadStarted: (questionProvided: boolean) => ({
    event: 'love_spread_started',
    question_provided: questionProvided,
  }),
  loveSpreadCompleted: (readingId: string, durationSeconds: number) => ({
    event: 'love_spread_completed',
    reading_id: readingId,
    duration_seconds: durationSeconds,
  }),
  loginPromptShown: (source: string) => ({
    event: 'login_prompt_shown',
    source: source,
  }),
  loginFromGate: (source: string) => ({
    event: 'login_from_gate',
    source: source,
  }),
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
  careerSpreadStarted: (questionProvided: boolean) => ({
    event: 'career_spread_started',
    question_provided: questionProvided,
  }),
  careerSpreadCompleted: (readingId: string, durationSeconds: number) => ({
    event: 'career_spread_completed',
    reading_id: readingId,
    duration_seconds: durationSeconds,
  }),
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
} as const;

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
} as const;
