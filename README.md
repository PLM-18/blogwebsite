# Blog Website Project

## Project Overview
This project involves creating a blog website using NuxtJS for the frontend and Strapi for the backend content management. The website will feature a homepage with blog posts, a search functionality, and individual blog post pages. The application will be containerized using Docker and hosted on GitHub.

## Technologies Used

### 1. **NuxtJS**
- **Purpose**: Used to build the frontend of the blog website.
- **Features**:
  - Dynamic routing for blog posts.
  - Server-side rendering for improved performance.
  - Components for reusable UI elements.
- **Setup**: Follow the [NuxtJS installation guide](https://nuxt.com/docs/getting-started/installation).

### 2. **Strapi**
- **Purpose**: Serves as the backend CMS to manage blog posts, authors, and categories.
- **Features**:
  - RESTful API for fetching and filtering blog posts.
  - Markdown support for blog content.
- **Setup**: Follow the [Strapi quick start guide](https://docs.strap.io/dev-docs/quick-start).

### 3. **Docker**
- **Purpose**: Containerizes both the NuxtJS and Strapi applications for easy deployment and scalability.
- **Features**:
  - Separate Dockerfiles for NuxtJS and Strapi.
  - Environment variable management for configuration.
- **Setup**: Dockerfiles will be provided in the project repository.

### 4. **GitHub**
- **Purpose**: Hosts the codebase and tracks version control.
- **Requirements**:
  - At least 3 commits to demonstrate consistent progress.
  - Exclude `.env` files from the repository.

## Project Structure
The project will consist of the following key components:
- **Frontend (NuxtJS)**:
  - Homepage: Displays blog posts with titles, authors, and snippets.
  - Search Page: Allows filtering by author or post title.
  - Blog Post Page: Shows full content of a single post.
- **Backend (Strapi)**:
  - API endpoints for blog posts, authors, and categories.
  - Markdown renderer for blog content.

## How to Run the Project
1. **Clone the Repository**:
   ```bash
   git clone git@github.com:PLM-18/blogwebsite.git
   ```
2. **Navigate to the Project Directory**:
   ```bash
   cd blogwebsite
   ```
3. **Run Docker Containers**:
   - For NuxtJS:
     ```bash
      docker build -t nuxtjs-frontend .
      docker run -p 3000:3000 nuxt-frontend
     ```
   - For Strapi:
     ```bash
     docker build -t strapi-backend .
     docker build -t strapi-app
     ```
4. **Access the Application**:
   - Frontend: `http://localhost:3000`
   - Backend (Strapi Admin): `http://localhost:1337/admin`

## Reflection
A brief reflection (200–300 words) will be included in the submission, detailing the experience with Docker and Strapi, challenges faced, and lessons learned. The reflection will also include the GitHub repository link and Docker commands.

## Submission
- Compress all project files (excluding `node_modules` and `.env`) into `A3.zip`.
- Submit the ZIP file to the provided ClickUP link.

---  
**University of Pretoria | IMY 210: Advanced Markup Languages | 2025**
