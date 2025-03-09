# LinkedIn Profile Service

This service allows fetching LinkedIn profile information and post interactions through a RESTful API.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:

```
PORT=3000
REAL_TIME_LINKEDIN_SCRAPER_API_KEY=your_api_key_here
```

3. Start the server:

```bash
npm start
```

## API Endpoints

### Get LinkedIn Profile

Fetches a LinkedIn profile by URL.

```
GET /api/linkedin/profile?url={profileUrl}
```

Example:

```
GET /api/linkedin/profile?url=https://www.linkedin.com/in/johndoe
```

Response:

```json
{
  "success": true,
  "data": {
    "id": 123456,
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "headline": "Software Engineer",
    "summary": "Experienced developer...",
    "profilePicture": "https://media.linkedin.com/...",
    "position": [
      {
        "companyName": "Example Inc",
        "title": "Senior Developer",
        "description": "Working on...",
        "location": "San Francisco, CA",
        "start": {
          "year": 2020,
          "month": 1,
          "day": 1
        },
        "end": null
      }
    ]
  }
}
```

### Get LinkedIn Post Interactors

Fetches reactions and comments for a LinkedIn post.

```
GET /api/linkedin/post/interactors?urn={postUrn}
```

Example:

```
GET /api/linkedin/post/interactors?urn=urn:li:activity:7089876543210123456
```

Response:

```json
{
  "success": true,
  "data": {
    "reactions": [
      {
        "urn": "urn:li:fs_miniProfile:AbC123",
        "fullName": "Jane Smith",
        "headline": "Product Manager",
        "profileUrl": "https://www.linkedin.com/in/janesmith",
        "profilePicture": [
          {
            "url": "https://media.linkedin.com/..."
          }
        ]
      }
    ],
    "comments": [
      {
        "isPinned": false,
        "isEdited": false,
        "threadUrn": "urn:li:comment:123456",
        "createdAt": 1634567890,
        "createdAtString": "2022-10-18T15:30:00Z",
        "permalink": "https://www.linkedin.com/feed/update/...",
        "text": "Great post!",
        "author": {
          "name": "Bob Johnson",
          "urn": "urn:li:fs_miniProfile:XyZ789",
          "id": "123-456",
          "username": "bobjohnson",
          "linkedinUrl": "https://www.linkedin.com/in/bobjohnson",
          "title": "CTO"
        }
      }
    ],
    "totalReactions": 1,
    "totalComments": 1
  }
}
```

## Error Handling

If an error occurs, the API will return a JSON response with a `success` flag set to `false` and an error message:

```json
{
  "success": false,
  "message": "Error message here"
}
```

Common error codes:

- 400: Bad Request (missing required parameters)
- 500: Internal Server Error
