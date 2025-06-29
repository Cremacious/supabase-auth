'use client';
import { Button } from './ui/button';
import { signOutUser } from '@/lib/actions/user.actions';
import { useRouter } from 'next/navigation';

const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    const { success, error } = await signOutUser();
    if (success) {
      router.push('/');
    } else {
      console.error('Sign out error:', error);
    }
  };

  return <Button onClick={handleSignOut}>Sign Out</Button>;
};

export default SignOutButton;
