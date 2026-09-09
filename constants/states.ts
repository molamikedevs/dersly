export const DEFAULT_ERROR = {
  title: 'Something went wrong',
  message: 'Please try again in a moment.',
  button: {
    text: 'Try again',
    href: '',
  },
} as const;

export const DEFAULT_EMPTY = {
  title: 'Nothing here yet',
  message: 'When something is added, it will show up here.',
} as const;
