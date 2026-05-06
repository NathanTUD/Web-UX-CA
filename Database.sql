-- =====================================
-- EXTENSION
-- =====================================
create extension if not exists pgcrypto;

-- =====================================
-- DROP TABLES
-- =====================================
drop table if exists enrollments cascade;
drop table if exists students cascade;
drop table if exists universities cascade;

-- =====================================
-- STUDENTS TABLE
-- =====================================
create table students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique,
  created_at timestamptz default now()
);

-- =====================================
-- UNIVERSITIES TABLE
-- =====================================
create table universities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text,
  created_at timestamptz default now()
);

-- =====================================
-- ENROLLMENTS TABLE
-- =====================================
create table enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null,
  university_id uuid not null,
  enrollment_date date default current_date,

  constraint fk_student
    foreign key (student_id)
    references students(id)
    on delete cascade,

  constraint fk_university
    foreign key (university_id)
    references universities(id)
    on delete cascade,

  constraint unique_enrollment
    unique (student_id, university_id)
);

-- =====================================
-- INDEXES
-- =====================================
create index idx_enrollments_student on enrollments(student_id);
create index idx_enrollments_university on enrollments(university_id);

-- =====================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================
alter table students enable row level security;
alter table universities enable row level security;
alter table enrollments enable row level security;

-- =====================================
-- POLICIES
-- =====================================

-- STUDENTS
create policy "students_select" on students
for select using (true);

create policy "students_insert" on students
for insert with check (true);

create policy "students_update" on students
for update using (true);

create policy "students_delete" on students
for delete using (true);

-- UNIVERSITIES
create policy "universities_select" on universities
for select using (true);

create policy "universities_insert" on universities
for insert with check (true);

create policy "universities_update" on universities
for update using (true);

create policy "universities_delete" on universities
for delete using (true);

-- ENROLLMENTS
create policy "enrollments_select" on enrollments
for select using (true);

create policy "enrollments_insert" on enrollments
for insert with check (true);

create policy "enrollments_update" on enrollments
for update using (true);

create policy "enrollments_delete" on enrollments
for delete using (true);

-- =====================================
-- SAMPLE DATA
-- =====================================
insert into students (name, email)
values 
  ('Alice', 'alice@email.com'),
  ('Bob', 'bob@email.com');

insert into universities (name, location)
values 
  ('Trinity College Dublin', 'Ireland'),
  ('University College Dublin', 'Ireland');

-- linking
insert into enrollments (student_id, university_id)
values 
(
  (select id from students where name='Alice'),
  (select id from universities where name='Trinity College Dublin')
),
(
  (select id from students where name='Bob'),
  (select id from universities where name='University College Dublin')
);

alter table students disable row level security;

supabase.from("students").insert(...)
supabase.from("students").select(...)
supabase.from("students").update(...)
supabase.from("students").delete(...)`
