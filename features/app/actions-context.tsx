'use client';

import { createContext, useContext, type ReactNode } from 'react';

import type * as authActions from '@/features/auth/actions';
import type * as classActions from '@/features/classes/actions';
import type * as homeworkActions from '@/features/homework/actions';
import type * as levelTestActions from '@/features/level-test/actions';
import type * as materialActions from '@/features/materials/actions';
import type * as mistakeActions from '@/features/mistakes/actions';
import type * as profileActions from '@/features/profile/actions';
import type * as vocabularyActions from '@/features/vocabulary/actions';

// Every action a component can trigger. Components call useDerslyActions()
// instead of importing server actions, so the same component saves to the
// database in the real app and to local state in the demo. The types are
// read from the real actions, so both sides always match.
export type DerslyActions = {
  createClass: typeof classActions.createClass;
  updateClass: typeof classActions.updateClass;
  archiveClass: typeof classActions.archiveClass;
  markLesson: typeof classActions.markLesson;
  undoLesson: typeof classActions.undoLesson;
  resetPackage: typeof classActions.resetPackage;

  createHomework: typeof homeworkActions.createHomework;
  updateHomework: typeof homeworkActions.updateHomework;
  deleteHomework: typeof homeworkActions.deleteHomeWork;

  createMaterial: typeof materialActions.createMaterialAction;
  updateMaterial: typeof materialActions.updateMaterialAction;
  deleteMaterial: typeof materialActions.deleteMaterialAction;

  addMistake: typeof mistakeActions.addMistake;
  updateMistake: typeof mistakeActions.updateMistake;
  deleteMistake: typeof mistakeActions.deleteMistake;
  submitMistakeFix: typeof mistakeActions.submitMistakeFix;
  setMistakeFixed: typeof mistakeActions.setMistakeFixed;

  addWord: typeof vocabularyActions.addWord;
  updateWord: typeof vocabularyActions.updateWord;
  deleteWord: typeof vocabularyActions.deleteWord;
  checkWord: typeof vocabularyActions.checkWord;

  submitAttempt: typeof levelTestActions.submitAttempt;

  updateAvatar: typeof profileActions.updateAvatar;
  changePassword: typeof authActions.changePassword;
  deleteAccount: typeof authActions.deleteAccount;
  signOut: typeof authActions.signOut;
};

const ActionsContext = createContext<DerslyActions | null>(null);

export function ActionsProvider({
  actions,
  children,
}: {
  actions: DerslyActions;
  children: ReactNode;
}) {
  return (
    <ActionsContext.Provider value={actions}>
      {children}
    </ActionsContext.Provider>
  );
}

export function useDerslyActions() {
  const actions = useContext(ActionsContext);

  if (!actions) {
    throw new Error(
      'useDerslyActions must be used inside RealActionsProvider or the demo store.',
    );
  }

  return actions;
}
