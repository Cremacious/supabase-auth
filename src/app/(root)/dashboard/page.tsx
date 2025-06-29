// import { createClient } from '@/components/db/supabase';
import SignOutButton from '@/components/SignOutButton';
import PostForm from './PostForm';
import { getCurrentUser } from '@/lib/actions/user.actions';
import { getPosts } from '@/lib/actions/post.action';

const DashboardPage = async () => {
  // const supabase = await createClient();
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();
  const { success, user } = await getCurrentUser();
  const { success: postsSuccess, data: posts } = await getPosts();
  if (!success || !user) {
    return (
      <div>
        <h1>Dashboard</h1>
        <p className="bg-red-200">You must be logged in to access this page.</p>
      </div>
    );
  }
  if (!postsSuccess) {
    return (
      <div>
        <h1>Dashboard</h1>
        <p className="bg-red-200">Failed to load posts.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Dashboard</h1>
      {/* <p className='bg-red-200'>Welcome to your dashboard, {user?.email}!</p> */}
      <p className="bg-green-200">
        Welcome to your dashboard, {user.profile?.email}!
      </p>
      <SignOutButton />
      <PostForm />
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Your Posts</h2>
        {posts.length > 0 ? (
          <ul className="space-y-4">
            {posts.map((post) => (
              <li key={post.id} className="p-4 border rounded-md">
                <h3 className="text-lg font-bold">{post.title}</h3>
                <p>{post.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No posts found.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
