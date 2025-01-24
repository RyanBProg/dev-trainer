# Dev Trainer - Full Stack Application

A comprehensive full stack application designed to help developers improve their skills. Built with Next.js for the frontend and Node.js for the backend.

### 🚀 Live Demo

- [View Live Site](https://dev-trainer-frontend-ryans-projects-197c1757.vercel.app/)

### 🌟 Key Features Implemented

- **Performance Optimized**: Built with Next.js for fast page loads and static site generation
- **User Authentication**: Secure login and signup with JWT-based authentication
- **Database Integration**: MongoDB for robust and scalable data storage
- **Mobile-first Responsive Design**: Fully responsive across all device sizes
- **Fetch Enhancements**: Comprehensive error handling, toast flags, redirects for invalid tokens, and caching
- **Complex Data Management**: Users can create, edit, and organize their data seamlessly, providing a flexible and intuitive experience for personalising and managing their experience.
- **Admin Panel**: Admin panel for managing data available to users.
- **Type Safety**: Full TypeScript integration for robust code

### 🛠️ Technologies Used

- **Next.js**: Main framework for the frontend
- **Express.js**: Backend server
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **React Query**: Data fetching and state management
- **Zod**: Schema validation

### 🎯 Future Improvements

<input disabled="" type="checkbox"> Animations<br>
<input disabled="" type="checkbox"> Allow for more complex shortuct key combinations<br>
<input disabled="" type="checkbox"> Create a code snippets page for terminal and git commands<br>
<input disabled="" type="checkbox"> Create a guides page for how-to's<br>
<input disabled="" type="checkbox"> Implement sign-up email confirmation<br>
<input disabled="" type="checkbox"> Implement rate limiting and pagination<br>

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
│ ├── app/ # Next.js app directory
│ │ ├── _assets/ # Assets files
│ │ ├── _components/ # Reusable UI components
│ │ ├── _font/ # Font files
│ │ ├── _types/ # Typescript types
│ │ ├── _zod/ # Zod schemas
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
