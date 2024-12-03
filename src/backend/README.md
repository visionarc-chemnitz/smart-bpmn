---
title: BPMN Generation Groq
emoji: ⚡
colorFrom: green
colorTo: blue
sdk: docker
pinned: false
license: apache-2.0
---

Check out the configuration reference at [Hugging Face Spaces Config Reference](https://huggingface.co/docs/hub/spaces-config-reference)


# BPMN Process Flow Generator

A FastAPI application that generates BPMN process flows using Groq AI and ProcessPiper.

## Prerequisites

- Python 3.11+
- Docker & Docker Compose
- Groq API Key

## Setup Instructions

1. Create environment file:
  ```sh
  cp .env.example .env
  ```
  Add your Groq API key to `.env`:
  ```env
  GROQ_API_KEY=your_api_key_here
  ```

2. Running with Docker:
  - Build and start the container:
    ```sh
    docker-compose up --build
    ```

3. Access the application at:
  - [http://localhost:7860](http://localhost:7860)

## Project Structure

```
├── app.py              # FastAPI application
├── Dockerfile          # Docker configuration
├── docker-compose.yml  # Docker Compose configuration
├── requirements.txt    # Python dependencies
└── .env                # Environment variables
```

## API Documentation

<!-- Add URL to API Documentation -->

## License

Apache 2.0