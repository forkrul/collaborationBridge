API Reference
=============

Comprehensive API documentation for the Python MVP Template, including all endpoints, request/response formats, and authentication details.

Base URL
--------

All API endpoints are prefixed with::

    http://localhost:8000/api/v1

Authentication
--------------

The application uses JWT (JSON Web Token) based authentication. Include the token in the Authorization header::

    Authorization: Bearer <your-jwt-token>

Response Format
---------------

All API responses follow a consistent JSON format:

**Success Response:**

.. code-block:: json

    {
      "id": 1,
      "name": "Example",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }

**Error Response:**

.. code-block:: json

    {
      "detail": "Error description",
      "error_code": "VALIDATION_ERROR",
      "field_errors": {
        "email": ["Invalid email format"]
      }
    }

HTTP Status Codes
-----------------

- ``200 OK`` - Successful request
- ``201 Created`` - Resource created successfully
- ``400 Bad Request`` - Invalid request data
- ``401 Unauthorized`` - Authentication required
- ``403 Forbidden`` - Insufficient permissions
- ``404 Not Found`` - Resource not found
- ``422 Unprocessable Entity`` - Validation errors
- ``500 Internal Server Error`` - Server error

Pagination
----------

List endpoints support pagination with query parameters:

- ``skip`` - Number of records to skip (default: 0)
- ``limit`` - Maximum records to return (default: 100, max: 1000)

Response includes pagination metadata:

.. code-block:: json

    {
      "items": [...],
      "total": 150,
      "skip": 0,
      "limit": 20,
      "has_next": true
    }

Interactive Documentation
--------------------------

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI Spec**: http://localhost:8000/openapi.json

Core Modules
------------

.. automodule:: src.project_name.core.config
   :members:

.. automodule:: src.project_name.core.database
   :members:

.. automodule:: src.project_name.core.security
   :members:

Models
------

.. automodule:: src.project_name.models.base
   :members:

.. automodule:: src.project_name.models.mixins
   :members:

Schemas
-------

.. automodule:: src.project_name.schemas.base
   :members:

API Routes
----------

.. automodule:: src.project_name.api.v1.router
   :members:

.. automodule:: src.project_name.api.v1.dependencies
   :members:
