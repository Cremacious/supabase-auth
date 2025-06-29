import { createClient } from '@/db/supabase';
import SignOutButton from '@/components/SignOutButton';

const DashboardPage = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard, {user?.email}!</p>
      <SignOutButton />
    </div>
  );
};

export default DashboardPage;
