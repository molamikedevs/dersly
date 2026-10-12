import { LoginForm } from '@/features/auth/components/login-form';

export const metadata = {
  title: 'Log in',
};

type Props = {
  searchParams: Promise<{ link?: string }>;
};

export default async function Login({ searchParams }: Props) {
  const { link } = await searchParams;

  return (
    <LoginForm
      notice={
        link === 'expired'
          ? 'That email link has expired or was already used. Log in below, or ask for a new link.'
          : null
      }
    />
  );
}
