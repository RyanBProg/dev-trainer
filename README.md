# Dev Trainer - Full Stack Application

Master keyboard shortcuts through personalised lists. Features include custom shortcut organisation, an admin panel for content management and AI for generating code snippets.

### 🚀 Live Demo

- [View Live Site](https://dev-trainer.net/)

### 🌟 Key Features Implemented

- **Performance Optimized**: Built with Next.js for fast page loads and static site generation
- **User Authentication**: Secure login and signup with session based auth using Redis and OAuth 2.0
- **Modern Security**: Rate Limiting, secure headers and input sanitisation are used to keep things secure
- **AI Code Snippets**: Generate code snippets using Google's Gemini
- **Admin Panel**: Admin panel for managing data available to users
- **Fetch Enhancements**: Comprehensive error handling, toast flags, redirects for invalid sessions, and caching
- **Database Integration**: MongoDB for robust and scalable data storage
- **Mobile-first Responsive Design**: Fully responsive across all device sizes
- **Type Safety**: Full TypeScript integration for robust code

### 🛠️ Technologies Used

- **Next.js**: Main framework for the frontend
- **Express.js**: Backend server
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Gemini API**: AI code generation
- **React Query**: Data fetching and state management
- **Zod**: Schema validation

### 🎯 Future Improvements

<input disabled="" type="checkbox"> Animations<br>
<input disabled="" type="checkbox"> Allow for more complex shortuct key combinations<br>
<input disabled="" type="checkbox"> Create a guides page for how-to's<br>
<input disabled="" type="checkbox"> Implement sign-up email confirmation<br>

### 📁 Project Structure

```bash
.
├── backend/
│ ├── api/ # entry point for Vercel
│ ├── controllers/ # Controllers for handling requests
│ ├── db/ # Database connection and models
│ ├── middleware/ # Middleware functions
│ ├── public/ # Static assets
│ ├── routes/ # Express routes
│ ├── types/ # Typescript types
│ ├── server.ts # Main server file
│ └── utils/ # Utility functions
├── frontend/
│ ├── components/ # Reusable UI components
│ ├── hooks/ # React hooks
│ ├── utils/ # Utility functions
│ ├── app/ # Next.js app directory
│ │ ├── dashboard/ # Dashboard route
│ │ ├── login/ # Login route
│ │ ├── policy/ # Policy route
│ │ └── signup/ # Signup route
│ └── public/ # Static assets
├── .gitignore # Git ignore file
└── README.md # Project documentation
```

### 🚀 Getting Started

Clone the repository:

```bash
git clone https://github.com/RyanBProg/dev-trainer
```

Navigate to either backend or frontend folder:

```bash
npm cd backend
- or -
npm cd frontend
```

Fill in .env files using the .env.example provided:

```bash
/backend/.env
- and -
/frontend/.env
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

### 📄 License

This project is open source and available under the MIT License.

### 📫 Contact

Feel free to reach out if you have any questions or would like to connect:

- [GitHub](https://github.com/ryanbprog)
- [LinkedIn](https://www.linkedin.com/in/ryan-bowler-601919170)
