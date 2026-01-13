# Core Workflows

This section illustrates critical system workflows using sequence diagrams. These workflows represent the most important user journeys and system interactions, clarifying architecture decisions and complex interactions between components.

## Workflow 1: Daily Reading (Anonymous User)

**User Journey:** First-time visitor performs a daily reading without creating an account.

```mermaid
sequenceDiagram
    actor User
    participant LP as Landing Page
    participant RS as Reading Selection
    participant CS as Card Selection
    participant API as API Route<br/>/api/readings
    participant Shuffle as Shuffle Engine
    participant Repo as Repository
    participant DB as PostgreSQL
    participant RR as Reading Result
    participant Analytics as Analytics<br/>(GA4, Meta, Hotjar)

    User->>LP: Visit landing page
    LP->>User: Show hero + CTA "เริ่มดูดวง"
    
    User->>RS: Click "เริ่มดูดวง"
    RS->>User: Show reading types<br/>(Daily vs 3-Card)
    
    User->>RS: Select "Daily Reading"
    RS->>User: Optional: Enter question
    
    User->>CS: Click "เลือกไพ่"
    CS->>CS: Show fan of face-down cards
    CS->>API: POST /api/readings<br/>{type: "daily", question: "..."}
    
    API->>API: Validate request (Zod schema)
    API->>Shuffle: drawCards(1)
    Shuffle->>Shuffle: Fisher-Yates shuffle (crypto.random)
    Shuffle->>Shuffle: Select 1 card
    Shuffle->>Shuffle: Determine reversed (50% chance)
    Shuffle-->>API: [{ cardId, isReversed }]
    
    API->>Repo: createReading(data)
    Repo->>DB: BEGIN TRANSACTION
    Repo->>DB: INSERT INTO readings (user_id=NULL, type, question)
    Repo->>DB: INSERT INTO reading_cards (reading_id, card_id, is_reversed)
    Repo->>DB: SELECT cards with interpretation
    Repo->>DB: COMMIT
    DB-->>Repo: Reading with cards
    Repo-->>API: ReadingWithCards
    
    API-->>CS: 201 Created + reading data
    CS->>CS: Animate card flip (3D, 800ms)
    CS->>RR: Navigate to result page
    
    RR->>RR: Display card + interpretation
    RR->>Analytics: Track "reading_completed"<br/>{type: "daily", anonymous: true}
    RR->>User: Show result + actions<br/>(Share, ดูอีกครั้ง, Sign up prompt)
    
    Note over User,Analytics: Anonymous reading saved<br/>Can be claimed later on signup
```

**Key Points:**
- No authentication required (frictionless UX per PRD)
- Card shuffle uses cryptographically secure randomization
- Reading saved with `user_id = NULL` for anonymous users
- Transaction ensures data consistency
- Analytics tracked at completion
- Signup prompt shown (conversion opportunity)

---

## Workflow 2: 3-Card Spread (Authenticated User)

**User Journey:** Returning logged-in user performs a 3-card spread with a specific question.

```mermaid
sequenceDiagram
    actor User
    participant Page as Reading Page
    participant Auth as Auth Context
    participant API as API Route
    participant Shuffle as Shuffle Engine
    participant Repo as Repository
    participant DB as PostgreSQL
    participant Result as Result Page
    participant Analytics as Analytics

    Note over User,Analytics: User already authenticated (JWT in context)
    
    User->>Page: Select "3-Card Spread"
    Page->>User: Show question input + positions<br/>(Past-Present-Future)
    
    User->>Page: Enter question:<br/>"อาชีพการงานจะเป็นอย่างไร?"
    User->>Page: Click "เลือกไพ่"
    
    Page->>Auth: getUser()
    Auth-->>Page: User object + JWT token
    
    Page->>API: POST /api/readings<br/>Authorization: Bearer {token}<br/>{type: "three_card", question: "..."}
    
    API->>API: Validate JWT token<br/>(Supabase Auth)
    API->>API: Extract user_id from token
    API->>API: Validate request body
    
    API->>Shuffle: drawCards(3)
    Shuffle->>Shuffle: Shuffle full deck (78 cards)
    Shuffle->>Shuffle: Select 3 unique cards
    Shuffle->>Shuffle: Determine reversed for each (50%)
    Shuffle-->>API: [<br/>  {cardId, isReversed, position: 0, label: "past"},<br/>  {cardId, isReversed, position: 1, label: "present"},<br/>  {cardId, isReversed, position: 2, label: "future"}<br/>]
    
    API->>Repo: createReading({user_id, type, question, cards})
    Repo->>DB: BEGIN TRANSACTION
    Repo->>DB: INSERT INTO readings (user_id, type, question)
    
    loop For each of 3 cards
        Repo->>DB: INSERT INTO reading_cards<br/>(reading_id, card_id, position, position_label, is_reversed)
    end
    
    Repo->>DB: SELECT reading with JOINed cards and interpretations
    Repo->>DB: COMMIT
    DB-->>Repo: Complete reading with 3 cards
    Repo-->>API: ReadingWithCards
    
    API-->>Page: 201 Created + reading
    
    Page->>Page: Animate cards sequentially<br/>Card 1 → Card 2 → Card 3<br/>(staggered timing)
    
    Page->>Result: Navigate to result
    Result->>Result: Display 3 cards horizontally<br/>with position labels
    Result->>Result: Show individual interpretations<br/>+ combined summary
    
    Result->>Analytics: Track "reading_completed"<br/>{type: "three_card", user_id, has_question: true}
    
    Result->>User: Show results + actions<br/>(Share, Add notes, Favorite, ดูอีกครั้ง)
    
    Note over User,Analytics: Reading saved to user's history<br/>Can be viewed later in /history
```

**Key Points:**
- JWT authentication required (Bearer token)
- User context available throughout flow
- 3 cards drawn sequentially with position labels
- Transaction ensures all 3 cards saved atomically
- Personalized result display (user-specific)
- Richer actions available (notes, favorite)

---

## Workflow 3: User Signup & Login (OAuth - Google)

**User Journey:** New user signs up using Google OAuth after completing an anonymous reading.

```mermaid
sequenceDiagram
    actor User
    participant Page as Signup Page
    participant SupabaseClient as Supabase Client
    participant SupabaseAuth as Supabase Auth Server
    participant Google as Google OAuth
    participant AuthContext as Auth Context
    participant API as API Route<br/>/api/users/me
    participant DB as PostgreSQL
    participant Analytics as Analytics

    User->>Page: After reading, sees "Sign up to save history"
    User->>Page: Click "Sign up with Google"
    
    Page->>SupabaseClient: signInWithOAuth({provider: 'google'})
    SupabaseClient->>SupabaseAuth: Request OAuth flow
    SupabaseAuth->>Google: Redirect to Google login
    
    Google->>User: Show Google login page
    User->>Google: Enter credentials + consent
    Google->>SupabaseAuth: Authorization code
    
    SupabaseAuth->>Google: Exchange code for access token
    Google-->>SupabaseAuth: Access token + user info
    SupabaseAuth->>SupabaseAuth: Create user in auth.users table
    SupabaseAuth->>DB: INSERT INTO public.users<br/>(id, email, name, auth_provider='google')
    
    SupabaseAuth->>Page: Redirect to app with JWT tokens<br/>(access_token + refresh_token)
    
    Page->>AuthContext: setSession({access_token, refresh_token})
    AuthContext->>AuthContext: Store tokens (httpOnly cookie)
    AuthContext->>AuthContext: Decode JWT to get user_id
    
    Page->>API: GET /api/users/me<br/>Authorization: Bearer {token}
    API->>API: Validate JWT
    API->>DB: SELECT * FROM users WHERE id = {user_id}
    DB-->>API: User profile data
    API-->>Page: User object
    
    Page->>AuthContext: setUser(user)
    
    Page->>Analytics: Track "signup_completed"<br/>{method: "google", user_id}
    
    Page->>Page: Show welcome modal:<br/>"Welcome! Your readings are now saved."
    
    Page->>User: Redirect to profile or previous page
    
    Note over User,Analytics: User now authenticated<br/>Previous anonymous readings can be claimed
```

**Key Points:**
- OAuth flow handled by Supabase (no manual token exchange)
- User record automatically created in public.users table
- JWT tokens stored securely (httpOnly cookies recommended)
- Auth context provides user state to entire app
- Welcome experience for new users
- Analytics track signup method

---

## Workflow Summary

| Workflow | Complexity | Authentication | Key Components | PRD Epic |
|----------|------------|----------------|----------------|----------|
| **Daily Reading (Anonymous)** | Medium | ❌ None | Shuffle Engine, Repository, Analytics | Epic 1 |
| **3-Card Spread (Auth)** | High | ✅ JWT | Shuffle Engine, Repository, Position Logic | Epic 1, 2 |
| **Signup/Login (OAuth)** | High | ✅ Supabase Auth | OAuth Flow, Auth Context, User Creation | Epic 2 |

**Total Workflows Documented:** 3 critical user journeys  
**Coverage:** Epic 1 + Epic 2 core flows  
**Format:** Mermaid sequence diagrams (interactive in supported viewers)

---
