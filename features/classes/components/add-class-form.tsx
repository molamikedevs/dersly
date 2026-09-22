'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/toast';
import { createClass, updateClass } from '@/features/classes/actions';
import { ClassSchema, ClassValues } from '@/lib/validation/class.schema';
import { LEVELS, TYPES } from '../constants/index';

export default function AddClassForm({
  onSuccess,
  classRecord,
}: {
  onSuccess?: () => void;
  classRecord?: ClassRecord;
}) {
  const isEdit = Boolean(classRecord);
  const form = useForm<ClassValues>({
    resolver: zodResolver(ClassSchema),
    defaultValues: {
      name: '',
      type: 'one_to_one',
      level: undefined,
      schedule: '',
      meetingUrl: '',
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: ClassValues) {
    const result = isEdit
      ? await updateClass(classRecord!.id, data)
      : await createClass(data);

    if (!result.success) {
      toast.add({
        title: isEdit ? 'Could not update class' : 'Could not create class',
        description: result.error?.message,
      });
      return;
    }

    toast.add({ title: isEdit ? 'Class updated' : 'Class created' });
    form.reset();
    onSuccess?.();
  }

  const submitLabel = isSubmitting
    ? isEdit
      ? 'Saving'
      : 'Creating class'
    : isEdit
      ? 'Save changes'
      : 'Create class';

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup className="gap-5">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="class-name">Name</FieldLabel>
              <Input
                {...field}
                id="class-name"
                className="h-11 rounded-xl text-[15px]"
                autoComplete="off"
                placeholder="Conversation Club"
                aria-invalid={fieldState.invalid}
                aria-describedby="class-name-hint"
              />
              <FieldDescription id="class-name-hint">
                For a private student, use their name.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-4">
          <Controller
            name="type"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="class-type">Type</FieldLabel>
                <Select
                  items={TYPES}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="class-type"
                    className="h-11 w-full rounded-xl text-[15px]"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="Choose a type" />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPES.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="level"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="class-level">
                  Level{' '}
                  <span className="font-normal text-muted-foreground">
                    optional
                  </span>
                </FieldLabel>
                <Select
                  items={LEVELS}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id="class-level"
                    className="h-11 w-full rounded-xl text-[15px]"
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectValue placeholder="All levels" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEVELS.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <Controller
          name="schedule"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="class-schedule">Schedule</FieldLabel>
              <Input
                {...field}
                id="class-schedule"
                className="h-11 rounded-xl text-[15px]"
                autoComplete="off"
                placeholder="Mon & Thu, 18:00"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="meetingUrl"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="class-meeting">
                Lesson link{' '}
                <span className="font-normal text-muted-foreground">
                  online only
                </span>
              </FieldLabel>
              <Input
                {...field}
                id="class-meeting"
                type="url"
                inputMode="url"
                className="h-11 rounded-xl text-[15px]"
                autoComplete="off"
                placeholder="https://meet.google.com/abc-defg-hij"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button
          type="submit"
          className="mt-1 h-12 w-full rounded-xl text-[15px] font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting && (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          )}
          {submitLabel}
        </Button>
      </FieldGroup>
    </form>
  );
}
