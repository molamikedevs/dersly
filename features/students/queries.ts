import { cookies } from 'next/headers';

import action from '@/lib/handlers/action';
import handleError from '@/lib/handlers/errors';
import { NotFoundError, throwPostgresError } from '@/lib/http-errors';
import { createClient } from '@/lib/supabase/server';
import { signStoragePath } from '@/lib/supabase/sign';
import { toCamel } from '@/lib/utils';
import { PaginatedSearchParamsSchema } from '@/lib/validation/global.schema';
import {
  ActionResponse,
  ErrorResponse,
  PaginatedSearchParams,
} from '@/types/global';

async function fetchStudents(
  params: PaginatedSearchParams,
  classId?: string,
): Promise<ActionResponse<{ students: StudentRecord[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 50 } = validationResult.params!;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  try {
    const supabase = createClient(await cookies());

    let request = supabase
      .from('enrollments')
      .select(
        `joined_at,
         student:profiles!enrollments_student_id_fkey(id, full_name, email, level, last_seen_at),
         class:classes!enrollments_class_id_fkey(id, name, type, schedule)`,
        { count: 'exact' },
      )
      .eq('status', 'active');

    if (classId) request = request.eq('class_id', classId);

    const { data, count, error } = await request
      .order('joined_at', { ascending: false })
      .range(from, to);

    if (error) throwPostgresError(error, 'Student');

    return {
      success: true,
      data: {
        students: toCamel<StudentRecord[]>(data ?? []),
        isNext: (count ?? 0) > to + 1,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export function getStudents(params: PaginatedSearchParams) {
  return fetchStudents(params);
}

export function getClassStudents(
  classId: string,
  params: PaginatedSearchParams,
) {
  return fetchStudents(params, classId);
}

export async function getStudentHome(): Promise<ActionResponse<StudentHome>> {
  const validationResult = await action({ authorize: true });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { user } = validationResult;

  try {
    const supabase = createClient(await cookies());

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, level')
      .eq('id', user!.id)
      .maybeSingle();

    if (profileError) throwPostgresError(profileError, 'Profile');
    if (!profile) throw new NotFoundError('Profile');

    const { data: enrolment, error: enrolmentError } = await supabase
      .from('enrollments')
      .select(
        `id,
         class:classes!enrollments_class_id_fkey(id, name, type, level, schedule, meeting_url)`,
      )
      .eq('student_id', user!.id)
      .eq('status', 'active')
      .order('joined_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (enrolmentError) throwPostgresError(enrolmentError, 'Enrolment');
    if (!enrolment?.class) throw new NotFoundError('Enrolment');

    const owner = Array.isArray(enrolment.class)
      ? enrolment.class[0]
      : enrolment.class;

    if (!owner) throw new NotFoundError('Enrolment');

    const { data: progress, error: progressError } = await supabase
      .from('lesson_progress')
      .select('lessons_done')
      .eq('enrollment_id', enrolment.id)
      .maybeSingle();

    if (progressError) throwPostgresError(progressError, 'Lesson');

    const { data: homework, error: homeworkError } = await supabase
      .from('homework')
      .select(
        'id, title, instructions, content, attachment_path, attachment_name',
      )
      .eq('class_id', owner.id)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (homeworkError) throwPostgresError(homeworkError, 'Homework');

    let current: StudentHome['current'] = null;

    if (homework) {
      current = {
        id: homework.id,
        title: homework.title,
        instructions: homework.instructions,
        attachmentName: homework.attachment_name,
        signedUrl: null,
        downloadUrl: null,
        hasGuide: Boolean(homework.content),
      };

      if (homework.attachment_path) {
        const urls = await signStoragePath(
          supabase,
          homework.attachment_path,
          homework.attachment_name ?? homework.title,
        );
        current.signedUrl = urls.signedUrl;
        current.downloadUrl = urls.downloadUrl;
      }
    }

    // Reading links have their own list on Home, so they are excluded here
    const { data: materials, error: materialsError } = await supabase
      .from('materials')
      .select('id, title, kind, level, url')
      .is('class_id', null)
      .neq('kind', 'article')
      .order('uploaded_at', { ascending: false })
      .limit(5);

    if (materialsError) throwPostgresError(materialsError, 'Material');

    const { data: reading, error: readingError } = await supabase
      .from('materials')
      .select('id, title, url')
      .is('class_id', null)
      .eq('kind', 'article')
      .order('uploaded_at', { ascending: false })
      .limit(5);

    if (readingError) throwPostgresError(readingError, 'Material');

    return {
      success: true,
      data: {
        firstName: profile.full_name.split(' ')[0],
        studentLevel: profile.level,
        enrolment: {
          classId: owner.id,
          className: owner.name,
          type: owner.type,
          level: owner.level,
          schedule: owner.schedule,
          meetingUrl: owner.meeting_url,
          lessonsDone: progress?.lessons_done ?? 0,
        },
        current,
        materials: toCamel(materials ?? []),
        reading: toCamel(reading ?? []),
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
