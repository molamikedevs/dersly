'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Controller, useForm, useWatch } from 'react-hook-form';

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
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/toast';
import {
  MaterialSchema,
  type MaterialValues,
} from '@/lib/validation/materials.schema';

export default function AddMaterialForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const form = useForm<MaterialValues>({
    resolver: zodResolver(MaterialSchema),
    defaultValues: { kind: 'file', title: '', description: '', url: '' },
  });

  const kind = useWatch({ control: form.control, name: 'kind' });
  const { isSubmitting } = form.formState;

  async function onSubmit(data: MaterialValues) {
    console.log(data);
    toast.add({ title: 'Material added' });
    form.reset();
    onSuccess?.();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Controller
          name="kind"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="material-kind">Type</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="material-kind">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="file">Document</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="material-title">Title</FieldLabel>
              <Input
                {...field}
                id="material-title"
                autoComplete="off"
                placeholder="Irregular verbs reference sheet"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {kind === 'link' ? (
          <Controller
            name="url"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="material-url">Link</FieldLabel>
                <Input
                  {...field}
                  id="material-url"
                  type="url"
                  autoComplete="off"
                  placeholder="https://youtube.com/..."
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        ) : (
          <Controller
            name="file"
            control={form.control}
            render={({ field: { onChange }, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="material-file">Document</FieldLabel>
                <Input
                  id="material-file"
                  type="file"
                  accept=".pdf,.doc,.docx,.mp3,.jpg,.jpeg,.png"
                  onChange={(event) => onChange(event.target.files?.[0])}
                  aria-invalid={fieldState.invalid}
                />
                <FieldDescription>Up to 20MB.</FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        )}

        <Controller
          name="description"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="material-description">
                Description
              </FieldLabel>
              <Textarea
                {...field}
                id="material-description"
                rows={3}
                placeholder="What is this for?"
              />
            </Field>
          )}
        />

        <Controller
          name="level"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor="material-level">Level</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="material-level">
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="elementary">Elementary</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          )}
          {isSubmitting ? 'Adding' : 'Add material'}
        </Button>
      </FieldGroup>
    </form>
  );
}
