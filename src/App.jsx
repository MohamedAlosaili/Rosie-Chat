import { Home, SignIn, SignUp, ErrorBoundary } from "/src/pages"


export default function App() {
  return (
    <main>
      <Home />
      <SignIn />
      <SignUp />
      <ErrorBoundary />
    </main>
  )
}