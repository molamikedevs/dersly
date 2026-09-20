'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formUrlQuery, removeKeysFormUrlQuery } from '@/lib/url';

type Option = { label: string; value: string };

type Props = {
  options: Option[];
  paramKey?: string;
  placeholder?: string;
  allLabel?: string;
  className?: string;
};

export default function Filter({
  options,
  paramKey = 'filter',
  placeholder = 'All',
  allLabel = 'All',
  className,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get(paramKey) ?? '';

  function handleChange(value: string | null) {
    const url =
      value === null || value === 'all'
        ? removeKeysFormUrlQuery({
            params: searchParams.toString(),
            keysToRemove: [paramKey, 'page'],
          })
        : formUrlQuery({
            params: searchParams.toString(),
            key: paramKey,
            value,
          });

    router.push(url, { scroll: false });
  }

  return (
    <Select value={current || 'all'} onValueChange={handleChange}>
      <SelectTrigger className={className ?? 'h-11 w-44'}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{allLabel}</SelectItem>
        {options.map(({ label, value }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
