-- Crear tabla de usuarios extendida (perfiles)
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    email text unique not null,
    full_name text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS en profiles
alter table public.profiles enable row level security;

-- Políticas para profiles
drop policy if exists "Users can view own profile" on profiles;
drop policy if exists "Users can update own profile" on profiles;
drop policy if exists "Users can insert own profile" on profiles;

create policy "Users can view own profile"
    on profiles for select
    using ( auth.uid() = id );

create policy "Users can update own profile"
    on profiles for update
    using ( auth.uid() = id );

create policy "Users can insert own profile"
    on profiles for insert
    with check ( auth.uid() = id );

-- Crear tabla de ingredientes
create table if not exists public.ingredients (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null default auth.uid(),
    name text not null,
    brand text,
    quantity numeric not null,
    unit text not null, -- 'g', 'ml', 'unit', etc.
    price numeric not null,
    price_per_unit numeric generated always as (price / quantity) stored,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS para ingredients
alter table public.ingredients enable row level security;

-- Eliminar políticas existentes
drop policy if exists "Users can view own ingredients" on ingredients;
drop policy if exists "Users can insert own ingredients" on ingredients;
drop policy if exists "Users can update own ingredients" on ingredients;
drop policy if exists "Users can delete own ingredients" on ingredients;

-- Nuevas políticas para ingredients
create policy "Users can view own ingredients"
    on ingredients for select
    using ( auth.uid() = user_id );

create policy "Users can insert own ingredients"
    on ingredients for insert
    with check ( auth.uid() = user_id );

create policy "Users can update own ingredients"
    on ingredients for update
    using ( auth.uid() = user_id );

create policy "Users can delete own ingredients"
    on ingredients for delete
    using ( auth.uid() = user_id );

-- Crear tabla de recetas
create table if not exists public.recipes (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null default auth.uid(),
    name text not null,
    description text,
    servings integer default 1,
    size_type text default 'porciones',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS para recipes
alter table public.recipes enable row level security;

-- Eliminar políticas existentes
drop policy if exists "Users can view own recipes" on recipes;
drop policy if exists "Users can insert own recipes" on recipes;
drop policy if exists "Users can update own recipes" on recipes;
drop policy if exists "Users can delete own recipes" on recipes;

-- Nuevas políticas para recipes
create policy "Users can view own recipes"
    on recipes for select
    using ( auth.uid() = user_id );

create policy "Users can insert own recipes"
    on recipes for insert
    with check ( auth.uid() = user_id );

create policy "Users can update own recipes"
    on recipes for update
    using ( auth.uid() = user_id );

create policy "Users can delete own recipes"
    on recipes for delete
    using ( auth.uid() = user_id );

-- Crear tabla recipe_ingredients (relación many-to-many)
create table if not exists public.recipe_ingredients (
    id uuid default gen_random_uuid() primary key,
    recipe_id uuid references public.recipes(id) on delete cascade not null,
    ingredient_id uuid references public.ingredients(id) on delete cascade not null,
    quantity_used numeric not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS para recipe_ingredients
alter table public.recipe_ingredients enable row level security;

-- Eliminar políticas existentes
drop policy if exists "Users can view own recipe ingredients" on recipe_ingredients;
drop policy if exists "Users can insert own recipe ingredients" on recipe_ingredients;
drop policy if exists "Users can update own recipe ingredients" on recipe_ingredients;
drop policy if exists "Users can delete own recipe ingredients" on recipe_ingredients;

-- Nuevas políticas para recipe_ingredients
create policy "Users can view own recipe ingredients"
    on recipe_ingredients for select
    using ( 
        exists (
            select 1 from recipes 
            where recipes.id = recipe_id 
            and recipes.user_id = auth.uid()
        )
    );

create policy "Users can insert own recipe ingredients"
    on recipe_ingredients for insert
    with check ( 
        exists (
            select 1 from recipes 
            where recipes.id = recipe_id 
            and recipes.user_id = auth.uid()
        )
    );

create policy "Users can update own recipe ingredients"
    on recipe_ingredients for update
    using ( 
        exists (
            select 1 from recipes 
            where recipes.id = recipe_id 
            and recipes.user_id = auth.uid()
        )
    );

create policy "Users can delete own recipe ingredients"
    on recipe_ingredients for delete
    using ( 
        exists (
            select 1 from recipes 
            where recipes.id = recipe_id 
            and recipes.user_id = auth.uid()
        )
    );

-- Crear tabla quotes
create table if not exists public.quotes (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null default auth.uid(),
    name text not null,
    client_name text,
    profit_margin numeric default 20,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS para quotes
alter table public.quotes enable row level security;

-- Eliminar políticas existentes
drop policy if exists "Users can view own quotes" on quotes;
drop policy if exists "Users can insert own quotes" on quotes;
drop policy if exists "Users can update own quotes" on quotes;
drop policy if exists "Users can delete own quotes" on quotes;

-- Nuevas políticas para quotes
create policy "Users can view own quotes"
    on quotes for select
    using ( auth.uid() = user_id );

create policy "Users can insert own quotes"
    on quotes for insert
    with check ( auth.uid() = user_id );

create policy "Users can update own quotes"
    on quotes for update
    using ( auth.uid() = user_id );

create policy "Users can delete own quotes"
    on quotes for delete
    using ( auth.uid() = user_id );

-- Crear tabla quote_recipes (relación many-to-many)
create table if not exists public.quote_recipes (
    id uuid default gen_random_uuid() primary key,
    quote_id uuid references public.quotes(id) on delete cascade not null,
    recipe_id uuid references public.recipes(id) on delete cascade not null,
    quantity integer default 1,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS para quote_recipes
alter table public.quote_recipes enable row level security;

-- Eliminar políticas existentes
drop policy if exists "Users can view own quote recipes" on quote_recipes;
drop policy if exists "Users can insert own quote recipes" on quote_recipes;
drop policy if exists "Users can update own quote recipes" on quote_recipes;
drop policy if exists "Users can delete own quote recipes" on quote_recipes;

-- Nuevas políticas para quote_recipes
create policy "Users can view own quote recipes"
    on quote_recipes for select
    using ( 
        exists (
            select 1 from quotes 
            where quotes.id = quote_id 
            and quotes.user_id = auth.uid()
        )
    );

create policy "Users can insert own quote recipes"
    on quote_recipes for insert
    with check ( 
        exists (
            select 1 from quotes 
            where quotes.id = quote_id 
            and quotes.user_id = auth.uid()
        )
    );

create policy "Users can update own quote recipes"
    on quote_recipes for update
    using ( 
        exists (
            select 1 from quotes 
            where quotes.id = quote_id 
            and quotes.user_id = auth.uid()
        )
    );

create policy "Users can delete own quote recipes"
    on quote_recipes for delete
    using ( 
        exists (
            select 1 from quotes 
            where quotes.id = quote_id 
            and quotes.user_id = auth.uid()
        )
    );

-- Remove stored cost columns from existing tables
alter table public.recipes drop column if exists total_cost;
alter table public.recipes drop column if exists cost_per_serving;
alter table public.recipe_ingredients drop column if exists cost;
alter table public.quote_recipes drop column if exists cost;
alter table public.quotes drop column if exists total_cost;

-- Remove all cost-related triggers and functions
drop trigger if exists update_recipe_ingredient_cost_trigger on recipe_ingredients;
drop trigger if exists update_quote_recipe_cost_trigger on quote_recipes;
drop trigger if exists update_recipe_cost_on_insert on recipe_ingredients;
drop trigger if exists update_recipe_cost_on_update on recipe_ingredients;
drop trigger if exists update_recipe_cost_on_delete on recipe_ingredients;
drop trigger if exists update_quote_cost_on_insert on quote_recipes;
drop trigger if exists update_quote_cost_on_update on quote_recipes;
drop trigger if exists update_quote_cost_on_delete on quote_recipes;

drop function if exists update_recipe_ingredient_cost();
drop function if exists update_quote_recipe_cost();
drop function if exists update_recipe_total_cost();
drop function if exists update_quote_total_cost();

-- Función para crear perfil automáticamente
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do update set
    email = new.email,
    full_name = new.raw_user_meta_data->>'full_name',
    updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql security definer;

-- Eliminar trigger existente
drop trigger if exists on_auth_user_created on auth.users;

-- Trigger para crear perfil al registrarse
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Add size_type column to existing recipes table if it doesn't exist
alter table public.recipes add column if not exists size_type text default 'porciones';

-- Add profit_margin column to existing quotes table if it doesn't exist
alter table public.quotes add column if not exists profit_margin numeric default 20;

-- Add cost fields to quotes table
ALTER TABLE public.quotes 
ADD COLUMN IF NOT EXISTS base_cost numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_cost numeric DEFAULT 0;

-- Add cost fields to quote_recipes table
ALTER TABLE public.quote_recipes 
ADD COLUMN IF NOT EXISTS unit_cost numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_cost numeric DEFAULT 0;