import Link from 'next/link';

const Homepage = () => {
  return (
    <div>
      <h1>Welcome to the Homepage</h1>
      <Link href="/sign-up">Sign Up</Link>
    </div>
  );
};

export default Homepage;
