# User Flow: Logging a Complete Interaction

This document outlines the sequence of API calls required for a user to log a complete interaction with one of their contacts, including the specific rapport-building techniques they employed.

## Objective
To create a new `Interaction` record linked to a `Contact` and also create one or more `InteractionTacticLog` records detailing the techniques used during that interaction.

---

### Step 1: Fetch Available Rapport Tactics

Before logging an interaction, the client application should fetch the list of available, science-validated rapport tactics. This allows the user to select which techniques they used.

**Endpoint:** `GET /api/v1/rapport/tactics`

**Request:**
```http
GET /api/v1/rapport/tactics HTTP/1.1
Host: your-api-domain.com
Authorization: Bearer <your_jwt_token>
```

**Successful Response (200 OK):**
The client will receive a list of all available `RapportTactic` objects. The `id` from these objects will be used in the final step.

```json
[
    {
        "name": "Active Listening (Validation/Paraphrasing)",
        "description": "Restating the speaker's message and reflecting their feelings...",
        "domain": "Communication Studies",
        "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "created_at": "2023-10-27T10:00:00Z",
        "updated_at": "2023-10-27T10:00:00Z"
    },
    {
        "name": "Finding Similarity (Liking Principle)",
        "description": "Identifying and highlighting shared interests, backgrounds, or values...",
        "domain": "Persuasion and Influence",
        "id": "b2c3d4e5-f6a7-8901-2345-67890abcdef0",
        "created_at": "2023-10-27T10:00:00Z",
        "updated_at": "2023-10-27T10:00:00Z"
    }
    // ... more tactics
]
```

---

### Step 2: Log the Interaction and Tactics

Once the user has provided all the necessary information (interaction details and selected tactics), the client makes a single API call to log everything in one atomic transaction.

**Endpoint:** `POST /api/v1/interactions/`

**Request Body:**
The request body is a JSON object containing two main keys:
- `interaction`: An `InteractionCreate` schema.
- `tactic_logs`: A list of `InteractionTacticLogCreate` schemas.

```json
{
    "interaction": {
        "contact_id": "c3d4e5f6-a7b8-9012-3456-7890abcdef01",
        "interaction_datetime": "2023-10-27T14:30:00+00:00",
        "medium": "Video Call",
        "topic": "Discuss Q4 Project Goals",
        "user_notes": "The meeting went well. Alex seemed receptive to the new timeline.",
        "rapport_score_post": 8,
        "observed_non_verbal": "Maintained good eye contact, open posture."
    },
    "tactic_logs": [
        {
            "tactic_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
            "effectiveness_score": 5,
            "notes": "Paraphrasing their concerns about the deadline was highly effective."
        },
        {
            "tactic_id": "b2c3d4e5-f6a7-8901-2345-67890abcdef0",
            "effectiveness_score": 4,
            "notes": "Found common ground by discussing shared interest in hiking."
        }
    ]
}
```

**Successful Response (201 Created):**
The API will return the newly created `InteractionRead` object, confirming that the interaction and its associated tactic logs were saved successfully.

```json
{
    "interaction_datetime": "2023-10-27T14:30:00+00:00",
    "medium": "Video Call",
    "topic": "Discuss Q4 Project Goals",
    "user_notes": "The meeting went well. Alex seemed receptive to the new timeline.",
    "rapport_score_post": 8,
    "observed_non_verbal": "Maintained good eye contact, open posture.",
    "id": "d4e5f6a7-b8c9-0123-4567-890abcdef012",
    "created_at": "2023-10-27T14:31:00Z",
    "updated_at": "2023-10-27T14:31:00Z",
    "contact_id": "c3d4e5f6-a7b8-9012-3456-7890abcdef01"
}
```

**Error Handling:**
- If the `contact_id` does not belong to the authenticated user, the API will return a `404 Not Found`.
- If any of the `tactic_id` values are invalid, the database will raise a foreign key constraint error, resulting in a server error.
- If the `interaction_datetime` is not timezone-aware, the API will return a `422 Unprocessable Entity` validation error.