# Collaboration Bridge

A science-backed manager interaction tracking application built with FastAPI, SQLAlchemy, and best practices. Track your interactions with managers and skip-level managers using validated rapport-building techniques from communication studies, social psychology, and influence research.

## 🎯 Features

### Core Functionality
- **Manager Interaction Tracking**: Log meetings, calls, and interactions with detailed context
- **Science-Backed Rapport Techniques**: Built-in library of validated rapport-building strategies
- **Effectiveness Measurement**: Track and analyze the effectiveness of different techniques
- **Contact Management**: Organize managers, skip-levels, and senior leadership contacts
- **Behavioral Insights**: Record non-verbal cues, communication styles, and common ground

### Technical Features
- **FastAPI**: Modern, fast web framework with automatic API documentation
- **SQLAlchemy 2.0**: Modern ORM with async support and enhanced soft delete
- **PostgreSQL**: Production database with timezone-aware timestamps
- **SQLite**: Testing database for development and CI/CD
- **Pydantic**: Data validation following PEP 484 type hints
- **Enhanced Soft Delete**: Production-ready soft delete with audit trails
- **Comprehensive Testing**: TDD/BDD approach with pytest and behave
- **Code Quality**: PEP 8, PEP 257, PEP 484 compliance with ruff and mypy

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- PostgreSQL (for production)
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/forkrul/collaborationBridge.git
cd collaborationBridge
```

2. Install dependencies using uv:
```bash
uv sync
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run database migrations:
```bash
uv run alembic upgrade head
```

5. Start the development server:
```bash
uv run uvicorn src.collaboration_bridge.main:app --reload
```

The API will be available at `http://localhost:8000` with interactive documentation at `http://localhost:8000/docs`.

## 📊 Science-Backed Rapport Techniques

The application includes a curated library of evidence-based rapport-building techniques:

### Communication Studies
- **Active Listening**: Demonstrating genuine attention and understanding
- **Mirroring**: Subtly matching communication style and pace
- **Verbal Affirmations**: Strategic use of agreement and validation

### Social Psychology
- **Finding Common Ground**: Identifying shared interests, values, or experiences
- **Reciprocity**: Strategic sharing and mutual exchange
- **Social Proof**: Leveraging shared connections and experiences

### Persuasion and Influence
- **Genuine Praise**: Specific, authentic recognition and appreciation
- **Consistency Principle**: Aligning with stated values and commitments
- **Authority Recognition**: Acknowledging expertise and experience

## 🏗️ Project Structure

```
src/
├── collaboration_bridge/   # Main application package
│   ├── api/               # API routes and endpoints
│   │   └── v1/           # API version 1
│   │       ├── contacts.py      # Contact management endpoints
│   │       ├── interactions.py  # Interaction logging endpoints
│   │       └── rapport.py       # Rapport technique endpoints
│   ├── core/              # Core functionality and configuration
│   │   ├── config.py      # Application configuration
│   │   ├── database.py    # Database setup and connection
│   │   └── mixins.py      # Enhanced database mixins
│   ├── models/            # SQLAlchemy models
│   │   ├── user.py        # User authentication model
│   │   ├── contact.py     # Manager/contact model
│   │   ├── interaction.py # Interaction logging model
│   │   └── rapport.py     # Rapport technique models
│   ├── schemas/           # Pydantic schemas for API
│   ├── services/          # Enhanced business logic layer
│   ├── crud/              # Database operations
│   └── main.py            # FastAPI application entry point
tests/                     # Comprehensive test suite
├── unit/                  # Unit tests
├── integration/           # Integration tests
├── features/              # BDD feature tests
└── e2e/                   # End-to-end tests
```

## 🔄 Usage Examples

### Logging an Interaction

```python
# Create an interaction with rapport techniques
interaction_data = {
    "interaction": {
        "contact_id": "uuid-of-manager",
        "interaction_datetime": "2024-01-15T14:30:00+00:00",
        "medium": "In-person",
        "topic": "Quarterly Review Discussion",
        "rapport_score_post": 8,
        "observed_non_verbal": "Open posture, maintained eye contact, genuine smile",
        "user_notes": "Great discussion about career development goals"
    },
    "tactic_logs": [
        {
            "tactic_id": "uuid-of-active-listening",
            "effectiveness_score": 5,
            "notes": "Asked clarifying questions, paraphrased key points"
        },
        {
            "tactic_id": "uuid-of-common-ground",
            "effectiveness_score": 4,
            "notes": "Discussed shared interest in data analytics"
        }
    ]
}
```

### Managing Contacts

```python
# Add a new manager contact
contact_data = {
    "name": "Sarah Johnson",
    "title": "Engineering Director",
    "level": "Skip-Level Manager",
    "common_ground_notes": "Both interested in machine learning, similar educational background",
    "communication_style_notes": "Prefers data-driven discussions, appreciates direct communication"
}
```

## 🧪 Development

### Running Tests

```bash
# Run all tests
uv run pytest

# Run with coverage
uv run pytest --cov=src --cov-report=html

# Run BDD feature tests
uv run behave tests/features/

# Run specific test types
uv run pytest tests/unit/
uv run pytest tests/integration/
```

### Code Quality

```bash
# Format code (PEP 8)
uv run ruff format

# Lint code
uv run ruff check

# Type checking (PEP 484)
uv run mypy src/

# Check docstrings (PEP 257)
uv run ruff check --select D
```

### Database Operations

```bash
# Create a new migration
uv run alembic revision --autogenerate -m "Add new feature"

# Apply migrations
uv run alembic upgrade head

# Rollback migration
uv run alembic downgrade -1
```

## 🚀 Deployment

### Environment Configuration

```bash
# Production environment variables
ENVIRONMENT=production
DATABASE_URL_PROD=postgresql+asyncpg://user:password@host/db
SECRET_KEY=your-secret-key
```

### Docker Deployment

```bash
# Build image
docker build -f docker/Dockerfile -t collaboration-bridge .

# Run container
docker run -p 8000:8000 collaboration-bridge
```

## 📈 Monitoring and Analytics

The application provides comprehensive tracking capabilities:

- **Interaction Frequency**: Track meeting cadence with different managers
- **Rapport Effectiveness**: Analyze which techniques work best with specific individuals
- **Relationship Progression**: Monitor rapport scores over time
- **Communication Patterns**: Identify successful interaction patterns

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following PEP 8, 257, and 484 standards
4. Add comprehensive tests (TDD/BDD approach)
5. Ensure all tests pass and code quality checks succeed
6. Submit a pull request

## 📚 Research Foundation

This application is built on validated research from:

- **Communication Studies**: Active listening, mirroring, and verbal affirmation techniques
- **Social Psychology**: Similarity-attraction principle, reciprocity, and social proof
- **Influence Research**: Cialdini's principles of persuasion and compliance
- **Organizational Behavior**: Manager-employee relationship dynamics

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Research contributions from communication studies and social psychology
- FastAPI and SQLAlchemy communities for excellent frameworks
- The Python community for maintaining high standards (PEP 8, 257, 484)
