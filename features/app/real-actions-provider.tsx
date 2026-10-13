'use client';

import type { ReactNode } from 'react';

import {
  ActionsProvider,
  type DerslyActions,
} from '@/features/app/actions-context';
import {
  changePassword,
  deleteAccount,
  signOut,
} from '@/features/auth/actions';
import {
  archiveClass,
  createClass,
  markLesson,
  resetPackage,
  undoLesson,
  updateClass,
} from '@/features/classes/actions';
import {
  createHomework,
  deleteHomeWork,
  updateHomework,
} from '@/features/homework/actions';
import { submitAttempt } from '@/features/level-test/actions';
import {
  createMaterialAction,
  deleteMaterialAction,
  updateMaterialAction,
} from '@/features/materials/actions';
import { updateAvatar } from '@/features/profile/actions';

// The real server actions, handed to every component in the signed-in app
const REAL_ACTIONS: DerslyActions = {
  createClass,
  updateClass,
  archiveClass,
  markLesson,
  undoLesson,
  resetPackage,
  createHomework,
  updateHomework,
  deleteHomework: deleteHomeWork,
  createMaterial: createMaterialAction,
  updateMaterial: updateMaterialAction,
  deleteMaterial: deleteMaterialAction,
  submitAttempt,
  updateAvatar,
  changePassword,
  deleteAccount,
  signOut,
};

export default function RealActionsProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <ActionsProvider actions={REAL_ACTIONS}>{children}</ActionsProvider>;
}
