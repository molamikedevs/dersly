'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import action from '@/lib/handlers/action';
import handleError from '@/lib/handlers/errors';
import { throwPostgresError } from '@/lib/http-errors';
import { createClient } from '@/lib/supabase/server';
import { uploadFile } from '@/lib/supabase/upload-file';
import {
  AvatarSchema,
  type AvatarValues,
} from '@/lib/validation/global.schema';
import type { ActionResponse, ErrorResponse } from '@/types/global';

const AVATAR_BUCKET = 'avatars';

// "avatars/<user id>/<file>" is stored on the profile. Storage wants the
// part after the bucket name.
function pathInBucket(fullPath: string) {
  return fullPath.split('/').slice(1).join('/');
}

export async function updateAvatar(
  params: AvatarValues,
): Promise<ActionResponse<{ avatarUrl: string }>> {
  const validationResult = await action({
    params,
    schema: AvatarSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { file } = validationResult.params!;
  const userId = validationResult.user!.id;
  const supabase = createClient(await cookies());

  // Set while the new file exists but the profile does not point at it yet
  let unlinked: string | null = null;

  try {
    // The bucket refuses anything that is not JPG, PNG or WebP, or is over
    // 2 MB, so the limits hold even if the browser checks are skipped
    const avatarPath = await uploadFile(file, AVATAR_BUCKET, userId);
    unlinked = avatarPath;

    const { error } = await supabase
      .from('profiles')
      .update({ avatar_path: avatarPath })
      .eq('id', userId);

    if (error) throwPostgresError(error, 'Profile');
    unlinked = null;

    // Clear everything else in this person's folder: the photo just
    // replaced, and anything left by an upload that failed half way
    const current = pathInBucket(avatarPath);
    const { data: files } = await supabase.storage
      .from(AVATAR_BUCKET)
      .list(userId);

    const stale = (files ?? [])
      .map((item) => `${userId}/${item.name}`)
      .filter((path) => path !== current);

    if (stale.length > 0) {
      await supabase.storage.from(AVATAR_BUCKET).remove(stale);
    }

    const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(current);

    // The photo also shows in the top bar and tab bar, on every page
    revalidatePath('/', 'layout');

    return { success: true, data: { avatarUrl: data.publicUrl } };
  } catch (error) {
    // The upload worked but the profile was not updated: remove the file so
    // it does not sit in storage unused
    if (unlinked) {
      await supabase.storage
        .from(AVATAR_BUCKET)
        .remove([pathInBucket(unlinked)]);
    }

    return handleError(error) as ErrorResponse;
  }
}
