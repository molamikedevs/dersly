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
import { ClassSchema, ClassValues } from '@/lib/validation/class.schema';
import { LEVELS, TYPES } from '../constants/index';

export default function AddClassForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
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
    console.log(data);
    toast.add({ title: 'Class created' });
    form.reset();
    onSuccess?.();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="class-name">Name</FieldLabel>
              <Input
                {...field}
                id="class-name"
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

        <Controller
          name="type"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="class-type">Type</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="class-type"
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="level"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="class-level">Level</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  id="class-level"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Optional" />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="schedule"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="class-schedule">Schedule</FieldLabel>
              <Input
                {...field}
                id="class-schedule"
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
              <FieldLabel htmlFor="class-meeting">Lesson link</FieldLabel>
              <Input
                {...field}
                id="class-meeting"
                type="url"
                inputMode="url"
                autoComplete="off"
                placeholder="https://meet.google.com/uqy-jrgj-zse..."
                aria-invalid={fieldState.invalid}
                aria-describedby="class-meeting-hint"
              />
              <FieldDescription id="class-meeting-hint">
                Only for online classes.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          )}
          {isSubmitting ? 'Creating class' : 'Create class'}
        </Button>
      </FieldGroup>
    </form>
  );
}
