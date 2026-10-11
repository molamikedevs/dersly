-- Real schedule fields for classes, replacing the free-text schedule column.
-- schedule_days holds ISO weekdays (1 Monday to 7 Sunday), schedule_times the
-- start time for the day at the same position, in Baku time.
-- The old schedule text is left untouched and is dropped in a later migration.

alter table public.classes
  add column schedule_days smallint[] not null default '{}',
  add column schedule_times time[] not null default '{}';

alter table public.classes
  add constraint classes_schedule_shape_check check (
    cardinality(schedule_days) = cardinality(schedule_times)
    and cardinality(schedule_days) <= 7
    and array_position(schedule_days, null) is null
    and array_position(schedule_times, null) is null
    and schedule_days <@ array[1, 2, 3, 4, 5, 6, 7]::smallint[]
  ),
  -- Strictly increasing, so no day can appear twice. An index past the end
  -- of an array is null in Postgres, which is what each "is null" relies on.
  add constraint classes_schedule_days_order_check check (
    (schedule_days[2] is null or schedule_days[1] < schedule_days[2])
    and (schedule_days[3] is null or schedule_days[2] < schedule_days[3])
    and (schedule_days[4] is null or schedule_days[3] < schedule_days[4])
    and (schedule_days[5] is null or schedule_days[4] < schedule_days[5])
    and (schedule_days[6] is null or schedule_days[5] < schedule_days[6])
    and (schedule_days[7] is null or schedule_days[6] < schedule_days[7])
  );

-- Backfill from the text. A row is converted when its days and times can be
-- paired: either one time for all the days ("Mon & Thu, 19;00") or one time
-- per day in the same order ("Wed 21:00 & Sat 12:00"). Anything else is left
-- empty for the report query to list.
with tokens as (
  select
    c.id,
    (
      select array_agg(d.n order by m.ord)
      from regexp_matches(lower(c.schedule), '\m(mon|tue|wed|thu|fri|sat|sun)', 'g')
        with ordinality as m(t, ord)
      join (
        values ('mon', 1), ('tue', 2), ('wed', 3), ('thu', 4),
               ('fri', 5), ('sat', 6), ('sun', 7)
      ) as d(k, n) on d.k = m.t[1]
    ) as days,
    (
      select array_agg(make_time(m.t[1]::int, m.t[2]::int, 0) order by m.ord)
      from regexp_matches(c.schedule, '(\d{1,2})\s*[:;.]\s*(\d{2})', 'g')
        with ordinality as m(t, ord)
      where m.t[1]::int between 0 and 23
        and m.t[2]::int between 0 and 59
    ) as times
  from public.classes c
  where btrim(coalesce(c.schedule, '')) <> ''
),
paired as (
  select
    id,
    days,
    case
      when cardinality(times) = 1
        then array_fill(times[1], array[cardinality(days)])
      else times
    end as times
  from tokens
  where days is not null
    and times is not null
    and (cardinality(times) = 1 or cardinality(times) = cardinality(days))
    and cardinality(days) = (select count(distinct x) from unnest(days) as x)
),
sorted as (
  select
    p.id,
    array_agg(s.d order by s.d)::smallint[] as days,
    array_agg(s.t order by s.d) as times
  from paired p
  cross join lateral unnest(p.days, p.times) as s(d, t)
  group by p.id
)
update public.classes c
set schedule_days = s.days,
    schedule_times = s.times
from sorted s
where s.id = c.id;
