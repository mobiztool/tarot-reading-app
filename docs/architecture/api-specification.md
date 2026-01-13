# API Specification

This section defines the complete REST API specification for the Web App ดูดวงไพ่ยิปซี. All API routes are implemented as Next.js API Routes deployed as Vercel serverless functions. The API follows RESTful conventions with JSON payloads.

## REST API Specification

```yaml
openapi: 3.0.0
info:
  title: Web App ดูดวงไพ่ยิปซี API
  version: 1.0.0
  description: |
    RESTful API for tarot card reading application. Provides endpoints for:
    - Card management and encyclopedia
    - Reading creation and history
    - User authentication and profiles
    - Favorites and personalization
    
    All endpoints return JSON responses and use JWT authentication where required.
  contact:
    name: API Support
    email: support@tarot-app.example.com

servers:
  - url: https://api.tarot-app.vercel.app
    description: Production API (Vercel)
  - url: http://localhost:3000
    description: Local Development

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: Supabase JWT token obtained from authentication

  schemas:
    # Core Models
    User:
      type: object
      properties:
        id:
          type: string
          format: uuid
          example: "123e4567-e89b-12d3-a456-426614174000"
        email:
          type: string
          format: email
          example: "user@example.com"
        name:
          type: string
          nullable: true
          example: "สมชาย ใจดี"
        profile_picture_url:
          type: string
          format: uri
          nullable: true
        created_at:
          type: string
          format: date-time
        last_login_at:
          type: string
          format: date-time
          nullable: true
        auth_provider:
          type: string
          enum: [email, google, facebook]

    Card:
      type: object
      properties:
        id:
          type: string
          format: uuid
        number:
          type: integer
          minimum: 0
          maximum: 21
        name:
          type: string
          example: "The Fool"
        name_th:
          type: string
          example: "คนบ้า"
        suit:
          type: string
          enum: [major_arcana, wands, cups, swords, pentacles]
        arcana:
          type: string
          enum: [major, minor]
        image_url:
          type: string
          format: uri
        meaning_upright:
          type: string
        meaning_reversed:
          type: string
        keywords_upright:
          type: array
          items:
            type: string
        keywords_reversed:
          type: array
          items:
            type: string
        advice:
          type: string
        element:
          type: string
          enum: [fire, water, air, earth]
          nullable: true
        slug:
          type: string
          example: "the-fool"

    Reading:
      type: object
      properties:
        id:
          type: string
          format: uuid
        user_id:
          type: string
          format: uuid
          nullable: true
        reading_type:
          type: string
          enum: [daily, three_card]
        question:
          type: string
          maxLength: 500
          nullable: true
        created_at:
          type: string
          format: date-time
        is_favorite:
          type: boolean
          default: false
        notes:
          type: string
          maxLength: 2000
          nullable: true

    ReadingCard:
      type: object
      properties:
        id:
          type: string
          format: uuid
        reading_id:
          type: string
          format: uuid
        card_id:
          type: string
          format: uuid
        position:
          type: integer
          minimum: 0
          maximum: 2
        position_label:
          type: string
          enum: [past, present, future]
          nullable: true
        is_reversed:
          type: boolean

    ReadingWithCards:
      allOf:
        - $ref: '#/components/schemas/Reading'
        - type: object
          properties:
            cards:
              type: array
              items:
                allOf:
                  - $ref: '#/components/schemas/ReadingCard'
                  - type: object
                    properties:
                      card:
                        $ref: '#/components/schemas/Card'
                      interpretation:
                        type: string
                        description: "Computed field: upright or reversed meaning based on is_reversed"

    UserPreferences:
      type: object
      properties:
        id:
          type: string
          format: uuid
        user_id:
          type: string
          format: uuid
        theme:
          type: string
          enum: [dark_mystical, light_ethereal, deep_ocean, cosmic_purple]
          default: dark_mystical
        enable_notifications:
          type: boolean
          default: false
        notification_time:
          type: string
          pattern: '^([01]\d|2[0-3]):([0-5]\d)$'
          nullable: true
          example: "09:00"
        enable_sound_effects:
          type: boolean
          default: true
        language:
          type: string
          enum: [th, en]
          default: th

    # Request/Response Models
    CreateReadingRequest:
      type: object
      required:
        - reading_type
      properties:
        reading_type:
          type: string
          enum: [daily, three_card]
        question:
          type: string
          maxLength: 500
        user_id:
          type: string
          format: uuid
          description: "Optional - if authenticated"

    CreateReadingResponse:
      type: object
      properties:
        reading:
          $ref: '#/components/schemas/ReadingWithCards'
        message:
          type: string
          example: "Reading created successfully"

    Error:
      type: object
      properties:
        error:
          type: object
          properties:
            code:
              type: string
              example: "VALIDATION_ERROR"
            message:
              type: string
              example: "Invalid input parameters"
            details:
              type: object
              additionalProperties: true
            timestamp:
              type: string
              format: date-time
            requestId:
              type: string
              format: uuid

  responses:
    UnauthorizedError:
      description: Access token is missing or invalid
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
          example:
            error:
              code: "UNAUTHORIZED"
              message: "Authentication required"
              timestamp: "2025-12-30T10:30:00Z"
              requestId: "req_123456"

    NotFoundError:
      description: The specified resource was not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

    ValidationError:
      description: Invalid request parameters
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'

paths:
  # ============================================================================
  # CARDS ENDPOINTS (Public)
  # ============================================================================
  /api/cards:
    get:
      summary: Get all tarot cards
      description: Returns list of all 78 tarot cards with optional filtering
      tags: [Cards]
      parameters:
        - name: suit
          in: query
          schema:
            type: string
            enum: [major_arcana, wands, cups, swords, pentacles]
          description: Filter by suit
        - name: arcana
          in: query
          schema:
            type: string
            enum: [major, minor]
          description: Filter by arcana type
        - name: search
          in: query
          schema:
            type: string
          description: Search card name (Thai or English)
        - name: limit
          in: query
          schema:
            type: integer
            default: 78
          description: Number of cards to return
        - name: offset
          in: query
          schema:
            type: integer
            default: 0
          description: Pagination offset
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  cards:
                    type: array
                    items:
                      $ref: '#/components/schemas/Card'
                  total:
                    type: integer
                  limit:
                    type: integer
                  offset:
                    type: integer

  /api/cards/{slug}:
    get:
      summary: Get card by slug
      description: Returns detailed information for a specific card
      tags: [Cards]
      parameters:
        - name: slug
          in: path
          required: true
          schema:
            type: string
          example: "the-fool"
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  card:
                    $ref: '#/components/schemas/Card'
        '404':
          $ref: '#/components/responses/NotFoundError'

  /api/cards/shuffle:
    get:
      summary: Shuffle deck and prepare for drawing
      description: Returns shuffled array of card IDs (no actual drawing)
      tags: [Cards]
      responses:
        '200':
          description: Shuffled deck
          content:
            application/json:
              schema:
                type: object
                properties:
                  shuffled_card_ids:
                    type: array
                    items:
                      type: string
                      format: uuid
                  shuffle_seed:
                    type: string
                    description: "Optional seed for reproducibility (dev only)"

  # ============================================================================
  # READINGS ENDPOINTS
  # ============================================================================
  /api/readings:
    post:
      summary: Create new reading
      description: |
        Draws cards and creates a new reading. Can be anonymous or authenticated.
        - Daily reading: draws 1 card
        - 3-Card Spread: draws 3 cards (Past-Present-Future)
      tags: [Readings]
      security:
        - BearerAuth: []
        - {} # Allow anonymous
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateReadingRequest'
            example:
              reading_type: "three_card"
              question: "จะเป็นอย่างไรกับอาชีพการงานของฉัน?"
      responses:
        '201':
          description: Reading created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CreateReadingResponse'
        '400':
          $ref: '#/components/responses/ValidationError'

    get:
      summary: Get reading history
      description: |
        Returns user's reading history (requires authentication).
        Anonymous readings not included unless claimed.
      tags: [Readings]
      security:
        - BearerAuth: []
      parameters:
        - name: reading_type
          in: query
          schema:
            type: string
            enum: [daily, three_card, all]
            default: all
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
        - name: offset
          in: query
          schema:
            type: integer
            default: 0
        - name: is_favorite
          in: query
          schema:
            type: boolean
          description: Filter favorite readings only
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  readings:
                    type: array
                    items:
                      $ref: '#/components/schemas/ReadingWithCards'
                  total:
                    type: integer
                  limit:
                    type: integer
                  offset:
                    type: integer
        '401':
          $ref: '#/components/responses/UnauthorizedError'

  /api/readings/{id}:
    get:
      summary: Get reading by ID
      description: Returns full reading details with cards
      tags: [Readings]
      security:
        - BearerAuth: []
        - {} # Allow anonymous if user owns reading
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  reading:
                    $ref: '#/components/schemas/ReadingWithCards'
        '404':
          $ref: '#/components/responses/NotFoundError'
        '403':
          description: Forbidden - user doesn't own this reading
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

    patch:
      summary: Update reading
      description: Update reading notes or favorite status
      tags: [Readings]
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                notes:
                  type: string
                  maxLength: 2000
                is_favorite:
                  type: boolean
            example:
              notes: "คำทำนายนี้แม่นมาก! ต้องจำไว้"
              is_favorite: true
      responses:
        '200':
          description: Reading updated
          content:
            application/json:
              schema:
                type: object
                properties:
                  reading:
                    $ref: '#/components/schemas/Reading'
                  message:
                    type: string
        '401':
          $ref: '#/components/responses/UnauthorizedError'
        '404':
          $ref: '#/components/responses/NotFoundError'

    delete:
      summary: Delete reading
      description: Permanently delete a reading from history
      tags: [Readings]
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Reading deleted
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                    example: "Reading deleted successfully"
        '401':
          $ref: '#/components/responses/UnauthorizedError'
        '404':
          $ref: '#/components/responses/NotFoundError'

  # ============================================================================
  # USER ENDPOINTS (Authenticated)
  # ============================================================================
  /api/users/me:
    get:
      summary: Get current user profile
      description: Returns authenticated user's profile information
      tags: [Users]
      security:
        - BearerAuth: []
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  user:
                    $ref: '#/components/schemas/User'
        '401':
          $ref: '#/components/responses/UnauthorizedError'

    patch:
      summary: Update user profile
      description: Update name and profile picture
      tags: [Users]
      security:
        - BearerAuth: []
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  maxLength: 100
                profile_picture_url:
                  type: string
                  format: uri
            example:
              name: "สมชาย ใจดี"
      responses:
        '200':
          description: Profile updated
          content:
            application/json:
              schema:
                type: object
                properties:
                  user:
                    $ref: '#/components/schemas/User'
                  message:
                    type: string
        '401':
          $ref: '#/components/responses/UnauthorizedError'

  /api/users/me/stats:
    get:
      summary: Get user statistics
      description: Returns reading count, favorite count, account age
      tags: [Users]
      security:
        - BearerAuth: []
      responses:
        '200':
          description: User statistics
          content:
            application/json:
              schema:
                type: object
                properties:
                  total_readings:
                    type: integer
                  daily_readings:
                    type: integer
                  three_card_readings:
                    type: integer
                  favorite_readings:
                    type: integer
                  favorite_cards:
                    type: integer
                  account_age_days:
                    type: integer
                  last_reading_at:
                    type: string
                    format: date-time

  # ============================================================================
  # FAVORITES ENDPOINTS (Epic 4)
  # ============================================================================
  /api/favorites:
    get:
      summary: Get user's favorite cards
      description: Returns list of cards favorited by user
      tags: [Favorites]
      security:
        - BearerAuth: []
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  favorites:
                    type: array
                    items:
                      type: object
                      properties:
                        id:
                          type: string
                          format: uuid
                        card:
                          $ref: '#/components/schemas/Card'
                        created_at:
                          type: string
                          format: date-time

    post:
      summary: Add card to favorites
      description: Bookmark a card for quick reference
      tags: [Favorites]
      security:
        - BearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - card_id
              properties:
                card_id:
                  type: string
                  format: uuid
      responses:
        '201':
          description: Card favorited
          content:
            application/json:
              schema:
                type: object
                properties:
                  favorite:
                    type: object
                    properties:
                      id:
                        type: string
                        format: uuid
                      card_id:
                        type: string
                        format: uuid
                  message:
                    type: string
        '409':
          description: Card already favorited
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /api/favorites/{id}:
    delete:
      summary: Remove card from favorites
      description: Unfavorite a previously bookmarked card
      tags: [Favorites]
      security:
        - BearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            format: uuid
          description: Favorite record ID (not card ID)
      responses:
        '200':
          description: Favorite removed
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string

  # ============================================================================
  # PREFERENCES ENDPOINTS (Epic 4)
  # ============================================================================
  /api/preferences:
    get:
      summary: Get user preferences
      description: Returns user's personalization settings
      tags: [Preferences]
      security:
        - BearerAuth: []
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  preferences:
                    $ref: '#/components/schemas/UserPreferences'

    patch:
      summary: Update user preferences
      description: Update theme, notification settings, etc.
      tags: [Preferences]
      security:
        - BearerAuth: []
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                theme:
                  type: string
                  enum: [dark_mystical, light_ethereal, deep_ocean, cosmic_purple]
                enable_notifications:
                  type: boolean
                notification_time:
                  type: string
                  pattern: '^([01]\d|2[0-3]):([0-5]\d)$'
                enable_sound_effects:
                  type: boolean
                language:
                  type: string
                  enum: [th, en]
            example:
              theme: "cosmic_purple"
              enable_notifications: true
              notification_time: "09:00"
      responses:
        '200':
          description: Preferences updated
          content:
            application/json:
              schema:
                type: object
                properties:
                  preferences:
                    $ref: '#/components/schemas/UserPreferences'
                  message:
                    type: string

  # ============================================================================
  # SHARE ENDPOINTS (Epic 3)
  # ============================================================================
  /api/share/generate:
    post:
      summary: Generate share image
      description: Creates shareable image for social media (1080x1080 and 1200x630)
      tags: [Share]
      security:
        - BearerAuth: []
        - {} # Allow anonymous
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - reading_id
              properties:
                reading_id:
                  type: string
                  format: uuid
                format:
                  type: string
                  enum: [instagram, facebook, twitter]
                  default: instagram
      responses:
        '200':
          description: Share image generated
          content:
            application/json:
              schema:
                type: object
                properties:
                  image_url:
                    type: string
                    format: uri
                    description: "URL to generated image in Supabase Storage"
                  image_width:
                    type: integer
                  image_height:
                    type: integer
                  expires_at:
                    type: string
                    format: date-time
                    description: "Image expiration (7 days)"
```

---
