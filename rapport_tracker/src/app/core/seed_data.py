from src.app.models.rapport import ScientificDomain

# Data based on established psychological and communication research, with citations.
SEED_TACTICS = [
    {
        "name": "Active Listening (Validation/Paraphrasing)",
        "description": "Restating the speaker's message and reflecting their feelings to show understanding and validation. (Based on Carl Rogers' client-centered therapy, 1951).",
        "domain": ScientificDomain.COMMUNICATION
    },
    {
        "name": "Behavioral Mimicry (Chameleon Effect)",
        "description": "Subtly mirroring the contact's posture, gestures, or vocal tone. Increases liking and affiliation. (Chartrand & Bargh, 1999).",
        "domain": ScientificDomain.SOCIAL_PSYCHOLOGY
    },
    {
        "name": "Finding Similarity (Liking Principle)",
        "description": "Identifying and highlighting shared interests, backgrounds, or values. People are more inclined to agree with those they like and perceive as similar. (Cialdini, Influence, 1984).",
        "domain": ScientificDomain.INFLUENCE
    },
    {
        "name": "Genuine Praise/Compliments",
        "description": "Offering specific, sincere compliments. A powerful driver of liking, though effectiveness increases significantly with sincerity.",
        "domain": ScientificDomain.INFLUENCE
    },
    {
        "name": "Reciprocity Norm Activation",
        "description": "Providing assistance, information, or concessions first. Creates a psychological sense of obligation to give back. (Cialdini, 1984).",
        "domain": ScientificDomain.INFLUENCE
    },
    {
        "name": "Pacing and Leading",
        "description": "Aligning with the contact's current emotional state or perspective (pacing) before attempting to shift them toward a new idea or outcome (leading).",
        "domain": ScientificDomain.COMMUNICATION
    },
    {
        "name": "Gradual Self-Disclosure",
        "description": "Revealing appropriate personal information to build trust and intimacy. Based on Social Penetration Theory (Altman & Taylor, 1973).",
        "domain": ScientificDomain.SOCIAL_PSYCHOLOGY
    }
]