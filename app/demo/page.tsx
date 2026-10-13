import { redirect } from 'next/navigation';

// /demo on its own has nothing to show. The two buttons on the login page
// open /demo/teacher and /demo/student directly.
export default function DemoIndex() {
  redirect('/login');
}
