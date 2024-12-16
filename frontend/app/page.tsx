export default function Home() {
  return <h1>Home Page</h1>;
}

// this page should:
// check if there is a jwt token and if there is send it to the server and wait for the response
// 1. if it is valid re-direct to the dashboard page
// 2. if it is not valid re-direct to the login page
