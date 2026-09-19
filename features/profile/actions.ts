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
  const { user } = validationResult;

  try {
    const supabase = createClient(await cookies());

    const { data: existing } = await supabase
      .from('profiles')
      .select('avatar_path')
      .eq('id', user!.id)
      .maybeSingle();

    const avatarPath = await uploadFile(file, AVATAR_BUCKET, user!.id);

    const { error } = await supabase
      .from('profiles')
      .update({ avatar_path: avatarPath })
      .eq('id', user!.id);

    if (error) throwPostgresError(error, 'Profile');

    const orphan = existing?.avatar_path;
    if (orphan && orphan !== avatarPath) {
      const [bucket, ...rest] = orphan.split('/');
      await supabase.storage.from(bucket).remove([rest.join('/')]);
    }

    const [, ...rest] = avatarPath.split('/');
    const { data: publicUrl } = supabase.storage
      .from(AVATAR_BUCKET)
      .getPublicUrl(rest.join('/'));

    console.log('avatarPath:', avatarPath);
    console.log('publicUrl:', publicUrl.publicUrl);

    revalidatePath('/profile');

    return { success: true, data: { avatarUrl: publicUrl.publicUrl } };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
