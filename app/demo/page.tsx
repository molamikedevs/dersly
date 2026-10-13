import { redirect } from 'next/navigation';

// The demo starts from the two buttons on the login page
export default function DemoStart() {
  redirect('/login');
}
