-- Create users table (extends Supabase auth.users)
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    email text unique not null,
    full_name text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security)
alter table public.profiles enable row level security;

-- Create policy for profiles
create policy "Users can view own profile"
    on profiles for select
    using ( auth.uid() = id );

create policy "Users can update own profile"
    on profiles for update
    using ( auth.uid() = id );

-- Create ingredients table
create table public.ingredients (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    name text not null,
    brand text,
    quantity numeric not null,
    unit text not null, -- 'g', 'ml', 'unit', etc.
    price numeric not null,
    price_per_unit numeric generated always as (price / quantity) stored,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for ingredients
alter table public.ingredients enable row level security;

-- Policies for ingredients
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

-- Create recipes table
create table public.recipes (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    name text not null,
    description text,
    servings integer default 1,
    total_cost numeric default 0,
    cost_per_serving numeric generated always as (total_cost / servings) stored,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for recipes
alter table public.recipes enable row level security;

-- Policies for recipes
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

-- Create recipe_ingredients table (many-to-many relationship)
create table public.recipe_ingredients (
    id uuid default gen_random_uuid() primary key,
    recipe_id uuid references public.recipes(id) on delete cascade not null,
    ingredient_id uuid references public.ingredients(id) on delete cascade not null,
    quantity_used numeric not null,
    cost numeric generated always as (quantity_used * (select price_per_unit from ingredients where id = ingredient_id)) stored,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for recipe_ingredients
alter table public.recipe_ingredients enable row level security;

-- Policies for recipe_ingredients
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

-- Create quotes table
create table public.quotes (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    name text not null,
    client_name text,
    total_cost numeric default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for quotes
alter table public.quotes enable row level security;

-- Policies for quotes
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

-- Create quote_recipes table (many-to-many relationship)
create table public.quote_recipes (
    id uuid default gen_random_uuid() primary key,
    quote_id uuid references public.quotes(id) on delete cascade not null,
    recipe_id uuid references public.recipes(id) on delete cascade not null,
    quantity integer default 1,
    cost numeric generated always as (quantity * (select total_cost from recipes where id = recipe_id)) stored,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for quote_recipes
alter table public.quote_recipes enable row level security;

-- Policies for quote_recipes
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

-- Function to update recipe total cost when ingredients change
create or replace function update_recipe_total_cost()
returns trigger as $$
begin
    update recipes
    set total_cost = (
        select coalesce(sum(ri.cost), 0)
        from recipe_ingredients ri
        where ri.recipe_id = coalesce(NEW.recipe_id, OLD.recipe_id)
    ),
    updated_at = timezone('utc'::text, now())
    where id = coalesce(NEW.recipe_id, OLD.recipe_id);
    
    return coalesce(NEW, OLD);
end;
$$ language plpgsql;

-- Triggers to update recipe total cost
create trigger update_recipe_cost_on_insert
    after insert on recipe_ingredients
    for each row execute procedure update_recipe_total_cost();

create trigger update_recipe_cost_on_update
    after update on recipe_ingredients
    for each row execute procedure update_recipe_total_cost();

create trigger update_recipe_cost_on_delete
    after delete on recipe_ingredients
    for each row execute procedure update_recipe_total_cost();

-- Function to update quote total cost when recipes change
create or replace function update_quote_total_cost()
returns trigger as $$
begin
    update quotes
    set total_cost = (
        select coalesce(sum(qr.cost), 0)
        from quote_recipes qr
        where qr.quote_id = coalesce(NEW.quote_id, OLD.quote_id)
    ),
    updated_at = timezone('utc'::text, now())
    where id = coalesce(NEW.quote_id, OLD.quote_id);
    
    return coalesce(NEW, OLD);
end;
$$ language plpgsql;

-- Triggers to update quote total cost
create trigger update_quote_cost_on_insert
    after insert on quote_recipes
    for each row execute procedure update_quote_total_cost();

create trigger update_quote_cost_on_update
    after update on quote_recipes
    for each row execute procedure update_quote_total_cost();

create trigger update_quote_cost_on_delete
    after delete on quote_recipes
    for each row execute procedure update_quote_total_cost();

-- Function to automatically create profile when user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();