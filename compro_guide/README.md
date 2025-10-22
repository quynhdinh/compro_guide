# Compro Guide
This is a platform of Compro students to share their knowledge and help each other in their journey at MIU.

### Features:
- Blog posts. User can create and view blogs about various topics related to Compro program. User can also filter by tags to find relevant posts.
- Course reviews. User can view and submit reviews for each course.

### AI Features:
#### Sentiment Analysis for Course Reviews
For each review is submitted, an AI model from backend side will check if the comment is relevant as a course review or not. If it is relevant, the review will be published. If not, the user will be notified that their review is not relevant.

#### Chatbot

At the lower left corner of the page. There is a chatbot backed by ollama32 model together with vector database to help students find relevant information about Compro program at MIU.

### Monitoring
The backend application exposes actuator endpoints for monitoring and management. You can access these endpoints at `/actuator`. Some of the available endpoints include:
- `/actuator/health`: Provides health status of the application.
- `/actuator/info`: Displays application information.
- `/actuator/beans`: Lists all Spring beans in the application context.
- `/actuator/env`: Shows environment properties.



### Testing
Integration tests are implemented using Rest Assured to ensure the correctness of the RESTful APIs.

### Tech Stack
- Frontend: React, Tailwind CSS
- Backend: Spring Boot
- Database: PGVector
- AI Integration: Ollama32, Gemini


### How to run locally
1. Clone the repository
2. Move to the backend folder
   ```bash
   cd compro_guide
   ```
3. Create your own Gemini API key and run the project as 
   ```bash
   GEMINI_API_KEY=your_key_here mvnw spring-boot:run
   ```
4. Move to the frontend folder
   ```bash
   cd ../compro_guide-fe
   npm start
   ```