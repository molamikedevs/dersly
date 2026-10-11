'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Controller, useForm, type FieldErrors } from 'react-hook-form';

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
import {
  WEEKDAYS,
  classSlots,
  parseTime,
  type ScheduleSlot,
} from '@/lib/schedule';
import { cn } from '@/lib/utils';
import { ClassSchema, ClassValues } from '@/lib/validation/class.schema';
import { LEVELS, TYPES } from '../constants/index';

const timeInputId = (day: number) => `class-time-${day}`;

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
      name: classRecord?.name ?? '',
      type: classRecord?.type ?? 'one_to_one',
      level: classRecord?.level ?? undefined,
      schedule: classRecord ? classSlots(classRecord) : [],
      meetingUrl: classRecord?.meetingUrl ?? '',
    },
  });

  const { isSubmitting, errors } = form.formState;

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

  // The time inputs are not registered with the form one by one, so it cannot
  // focus them itself. Name comes first on screen and is focused by the form.
  function onInvalid(invalid: FieldErrors<ClassValues>) {
    if (invalid.name || !Array.isArray(invalid.schedule)) return;

    const index = invalid.schedule.findIndex(Boolean);
    const slot = form.getValues('schedule')[index];

    if (slot) document.getElementById(timeInputId(slot.day))?.focus();
  }

  const submitLabel = isSubmitting
    ? isEdit
      ? 'Saving'
      : 'Creating class'
    : isEdit
      ? 'Save changes'
      : 'Create class';

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, onInvalid)}
      noValidate
      className="bg-inherit"
    >
      <FieldGroup className="gap-5 bg-inherit">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="class-name">Name</FieldLabel>
              <Input
                {...field}
                id="class-name"
                className="h-11 rounded-xl text-base md:text-[15px]"
                autoComplete="off"
                autoCapitalize="words"
                enterKeyHint="next"
                maxLength={60}
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
          render={({ field }) => {
            const slots: ScheduleSlot[] = field.value;
            const slotErrors = Array.isArray(errors.schedule)
              ? errors.schedule
              : [];

            // A new day copies the time of the last day picked, so the
            // usual case, the same time on every day, is typed once.
            function toggleDay(day: number) {
              const picked = slots.some((slot) => slot.day === day);

              field.onChange(
                picked
                  ? slots.filter((slot) => slot.day !== day)
                  : [...slots, { day, time: slots.at(-1)?.time ?? '' }].sort(
                      (a, b) => a.day - b.day,
                    ),
              );
            }

            function setTime(day: number, time: string) {
              field.onChange(
                slots.map((slot) =>
                  slot.day === day ? { ...slot, time } : slot,
                ),
              );
            }

            return (
              <Field data-invalid={Boolean(errors.schedule)}>
                <FieldLabel id="class-days-label">
                  Lesson days{' '}
                  <span className="font-normal text-muted-foreground">
                    optional
                  </span>
                </FieldLabel>

                <div
                  role="group"
                  aria-labelledby="class-days-label"
                  className="grid grid-cols-7 gap-1.5"
                >
                  {WEEKDAYS.map(({ value, short, long }) => {
                    const picked = slots.some((slot) => slot.day === value);

                    return (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={picked}
                        aria-label={long}
                        onClick={() => toggleDay(value)}
                        className={cn(
                          'h-11 touch-manipulation rounded-xl border text-sm font-semibold transition-[scale,background-color,color,border-color] duration-150 ease-out select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none active:scale-[0.96]',
                          picked
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-input-border bg-transparent text-foreground hover:bg-muted',
                        )}
                      >
                        {short}
                      </button>
                    );
                  })}
                </div>

                {slots.length > 0 && (
                  <ul className="flex flex-col gap-2">
                    {slots.map((slot, index) => {
                      const id = timeInputId(slot.day);
                      const message = slotErrors[index]?.time?.message;

                      return (
                        <li
                          key={slot.day}
                          className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1"
                        >
                          <label
                            htmlFor={id}
                            className="text-[15px] font-medium text-foreground"
                          >
                            {WEEKDAYS[slot.day - 1].long}
                          </label>
                          {/* A plain text field, not type="time". The browser's
                              time field follows the computer's clock setting,
                              and on a 12-hour clock it throws away "22:00"
                              unless AM or PM is also typed. */}
                          <Input
                            id={id}
                            type="text"
                            inputMode="numeric"
                            value={slot.time}
                            onChange={(event) =>
                              setTime(slot.day, event.target.value)
                            }
                            onBlur={(event) => {
                              // "2100" and "21.00" become "21:00" on leaving
                              const parsed = parseTime(event.target.value);
                              if (parsed) setTime(slot.day, parsed);
                              field.onBlur();
                            }}
                            placeholder="21:00"
                            maxLength={5}
                            autoComplete="off"
                            enterKeyHint="done"
                            className="h-11 w-24 rounded-xl text-center text-base tabular-nums md:text-[15px]"
                            aria-invalid={Boolean(message)}
                            aria-describedby={
                              message ? `${id}-error` : 'class-days-hint'
                            }
                          />
                          {message && (
                            <p
                              id={`${id}-error`}
                              role="alert"
                              className="col-span-2 text-sm font-medium text-destructive-subtle-foreground"
                            >
                              {message}
                            </p>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}

                <FieldDescription id="class-days-hint">
                  24-hour Baku time. Type 21:00 or 2100.
                </FieldDescription>
              </Field>
            );
          }}
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
                className="h-11 rounded-xl text-base md:text-[15px]"
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="done"
                maxLength={500}
                placeholder="https://meet.google.com/abc-defg-hij"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Stays in view while the fields scroll. Sticky offsets are measured
            inside the scroll area's padding, so the button rests and sticks at
            the same spot. The ::after hides the fields passing under that
            padding. */}
        <div className="sticky bottom-0 bg-inherit pt-2 after:absolute after:inset-x-0 after:top-full after:h-6 after:bg-inherit sm:after:h-7">
          <Button
            type="submit"
            className="h-12 w-full touch-manipulation rounded-xl text-[15px] font-semibold active:scale-[0.98]"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            )}
            {submitLabel}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
