# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
# Vue Blog Application

A Vue.js blog application that connects to a Strapi CMS backend. This application includes features like dark/light mode toggle, category filtering, and responsive design.

## Features

- Display blog posts from Strapi CMS
- Filter posts by category
- Light/Dark mode toggle
- Responsive design
- Single post view with rich text content rendering

## Project Setup

### Prerequisites

- Node.js and npm installed
- Strapi CMS setup with the structure shown in the screenshots
- Strapi API token (for authentication)

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd vue-blog-app
```

2. Install dependencies:
```bash
npm install
```

3. Create an `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Fill in your Strapi details in the `.env` file:
```
VITE_STRAPI_API_URL=http://localhost:1337
VITE_STRAPI_API_TOKEN=your_strapi_api_token_here
```

5. Start the development server:
```bash
npm run dev
```

## Deployment

### Environment Variables for Production

For production deployment, you need to set up the environment variables in your hosting platform:

1. `VITE_STRAPI_API_URL`: Your production Strapi API URL
2. `VITE_STRAPI_API_TOKEN`: Your Strapi API token

### Build for Production

```bash
npm run build
```

### Deployment Options

#### Option 1: Static Hosting (Netlify, Vercel, etc.)

1. Connect your repository to the hosting platform
2. Set the environment variables in the platform's settings
3. Set the build command to `npm run build`
4. Set the publish directory to `dist`

#### Option 2: Server Deployment

If you're deploying to a server:

1. Build the project locally or in a CI/CD pipeline
2. Upload the contents of the `dist` folder to your server
3. Configure your server to serve the static files
4. Consider using a reverse proxy like Nginx to handle requests

### Security Considerations

The API token is sensitive information. There are several approaches to handle it securely:

1. **Environment Variables**: The current approach uses environment variables which are embedded at build time. This works but exposes the token in the JavaScript bundle.

2. **Backend Proxy**: For maximum security, consider setting up a backend proxy server that:
   - Receives requests from your frontend
   - Adds the authentication token
   - Forwards the request to Strapi
   - Returns the response to the frontend

   This way, the token never leaves your server.

3. **Serverless Functions**: Platforms like Netlify and Vercel offer serverless functions that can act as proxies without requiring a separate server.

4. **Public Content**: If your blog content is public, consider using Strapi's public API endpoints that don't require authentication.

## Project Structure

```
src/
├── App.vue              # Main application component
├── main.js              # Application entry point
├── router/              # Vue Router configuration
├── utils/
│   └── api.js           # Strapi API utilities
├── views/
│   ├── Home.vue         # Homepage with blog post list
│   ├── PostDetail.vue   # Single blog post view
│   └── NotFound.vue     # 404 page
└── assets/              # Static assets
```

## Customization

### Styling

The application uses CSS variables for theming. You can customize the colors, fonts, and other styling properties in `App.vue`.

### Adding New Features

Some ideas for extending the app:

- Add pagination for blog posts
- Implement search functionality
- Add commenting system
- Create author profile pages
- Add social media sharing buttons

## Troubleshooting

### Common Issues

1. **API Connection Issues**: Make sure your Strapi server is running and the API URL is correct.

2. **Authentication Errors**: Verify that your API token is valid and has the necessary permissions.

3. **Content Not Displaying**: Check your Strapi content structure against what the app expects.

## License

[MIT](LICENSE)