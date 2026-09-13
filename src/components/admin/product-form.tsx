"use client";

import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";

import { type FormState, saveProductAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { type Ingredient, illustrationNames, store } from "@/lib/content";

export type ProductFormValues = {
  id?: string;
  name: string;
  slug: string;
  tag: string;
  description: string;
  warning: string;
  cta: string;
  imageUrl: string;
  price: string;
  panel: string;
  bg: string;
  dark: boolean;
  stock: string;
  sortOrder: string;
  active: boolean;
  ingredients: Ingredient[];
};

export const emptyProduct: ProductFormValues = {
  name: "",
  slug: "",
  tag: "",
  description: "",
  warning: "",
  cta: "go on. dig in.",
  imageUrl: "",
  price: "1200",
  panel: "#FF8BA7",
  bg: "#FFD34D",
  dark: false,
  stock: "100",
  sortOrder: "0",
  active: true,
  ingredients: [],
};

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="text-sm text-destructive">{errors.join(" ")}</p>;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function ColourField({
  id,
  name,
  label,
  hint,
  defaultValue,
  errors,
}: {
  id: string;
  name: string;
  label: string;
  hint: string;
  defaultValue: string;
  errors?: string[];
}) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label={`${label} picker`}
          value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : "#000000"}
          onChange={(event) => setValue(event.target.value.toUpperCase())}
          className="size-9 cursor-pointer rounded-md border border-input bg-background p-0.5"
        />
        <Input
          id={id}
          name={name}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="font-mono uppercase"
          maxLength={7}
          required
          aria-invalid={errors ? true : undefined}
        />
      </div>
      <p className="text-xs text-muted-foreground">{hint}</p>
      <FieldError errors={errors} />
    </div>
  );
}

export function ProductForm({ initial }: { initial: ProductFormValues }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveProductAction, {});
  const [slug, setSlug] = useState(initial.slug);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial.id));
  const [active, setActive] = useState(initial.active);
  const [dark, setDark] = useState(initial.dark);
  const [ingredients, setIngredients] = useState<Ingredient[]>(initial.ingredients);
  const errors = state.fieldErrors ?? {};
  // After a failed submit React resets uncontrolled fields, so seed them from
  // what was submitted rather than the original record.
  const value = (key: keyof ProductFormValues & string): string =>
    state.values?.[key] ?? String(initial[key] ?? "");

  const updateIngredient = (index: number, patch: Partial<Ingredient>) =>
    setIngredients((list) => list.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  return (
    <form action={action} className="flex flex-col gap-6">
      {initial.id ? <input type="hidden" name="id" value={initial.id} /> : null}
      <input type="hidden" name="ingredients" value={JSON.stringify(ingredients)} />
      <input type="hidden" name="active" value={active ? "on" : "off"} />
      <input type="hidden" name="dark" value={dark ? "on" : "off"} />

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
            <CardDescription>What shoppers see in the flavour panel.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={value("name")}
                  required
                  onChange={(event) => {
                    if (!slugTouched) setSlug(slugify(event.target.value));
                  }}
                  aria-invalid={errors.name ? true : undefined}
                />
                <FieldError errors={errors.name} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="slug">Id (in links)</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={slug}
                  required
                  onChange={(event) => {
                    setSlugTouched(true);
                    setSlug(event.target.value);
                  }}
                  aria-invalid={errors.slug ? true : undefined}
                />
                <p className="text-xs text-muted-foreground">
                  Shows up as <code>/shop#{slug || "…"}</code>. Changing it breaks old links.
                </p>
                <FieldError errors={errors.slug} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={value("description")}
                rows={3}
                required
                aria-invalid={errors.description ? true : undefined}
              />
              <FieldError errors={errors.description} />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="tag">Tag</Label>
                <Input id="tag" name="tag" defaultValue={value("tag")} placeholder="Bestseller" />
                <FieldError errors={errors.tag} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="warning">Warning sticker</Label>
                <Input
                  id="warning"
                  name="warning"
                  defaultValue={value("warning")}
                  placeholder="may cause food coma"
                />
                <FieldError errors={errors.warning} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="cta">Button text</Label>
                <Input id="cta" name="cta" defaultValue={value("cta")} required />
                <FieldError errors={errors.cta} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="imageUrl">Jar photo</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                defaultValue={value("imageUrl")}
                placeholder="/images/shop-01-pink-lemonade.webp"
              />
              <p className="text-xs text-muted-foreground">
                A path under <code>public/</code> or a full URL. Leave blank for the drawn jar.
              </p>
              <FieldError errors={errors.imageUrl} />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label>Ingredient badges</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={ingredients.length >= 8}
                  onClick={() =>
                    setIngredients((list) => [...list, { label: "", illustration: "strawberry" }])
                  }
                >
                  <Plus /> Add
                </Button>
              </div>
              {ingredients.length === 0 ? (
                <p className="text-sm text-muted-foreground">No ingredient badges yet.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        aria-label={`Ingredient ${index + 1} label`}
                        value={ingredient.label}
                        placeholder="Strawberry"
                        onChange={(event) => updateIngredient(index, { label: event.target.value })}
                      />
                      <select
                        aria-label={`Ingredient ${index + 1} illustration`}
                        value={ingredient.illustration}
                        onChange={(event) =>
                          updateIngredient(index, {
                            illustration: event.target.value as Ingredient["illustration"],
                          })
                        }
                        className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                      >
                        {illustrationNames.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Remove ingredient"
                        onClick={() => setIngredients((list) => list.filter((_, i) => i !== index))}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <FieldError errors={errors.ingredients} />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Price & stock</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="price">Price per jar ({store.currency})</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="1"
                  min="0"
                  inputMode="numeric"
                  defaultValue={value("price")}
                  required
                  aria-invalid={errors.price ? true : undefined}
                />
                <FieldError errors={errors.price} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="stock">Jars in stock</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  defaultValue={value("stock")}
                  required
                  aria-invalid={errors.stock ? true : undefined}
                />
                <p className="text-xs text-muted-foreground">
                  Every order takes jars off this; at zero the shop shows &ldquo;sold out&rdquo;.
                </p>
                <FieldError errors={errors.stock} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="sortOrder">Sort order</Label>
                <Input
                  id="sortOrder"
                  name="sortOrder"
                  type="number"
                  step="1"
                  defaultValue={value("sortOrder")}
                />
                <p className="text-xs text-muted-foreground">Lower numbers show first in the shop.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Colours</CardTitle>
              <CardDescription>The brand palette: #FF6A00, #F2EFE6, #FF8BA7, #FFD34D, #57151F.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <ColourField
                id="panel"
                name="panel"
                label="Jar panel"
                hint="Behind the jar photo."
                defaultValue={value("panel")}
                errors={errors.panel}
              />
              <ColourField
                id="bg"
                name="bg"
                label="Section"
                hint="The shop section while this flavour is showing."
                defaultValue={value("bg")}
                errors={errors.bg}
              />
              <label className="flex items-center justify-between gap-3 text-sm">
                <span>
                  <span className="font-medium">Dark panel</span>
                  <span className="block text-xs text-muted-foreground">
                    Text and badges on the panel switch to cream.
                  </span>
                </span>
                <Switch checked={dark} onCheckedChange={setDark} />
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visibility</CardTitle>
            </CardHeader>
            <CardContent>
              <label className="flex items-center justify-between gap-3 text-sm">
                <span>
                  <span className="font-medium">Show in shop</span>
                  <span className="block text-xs text-muted-foreground">
                    Inactive flavours can&apos;t be ordered.
                  </span>
                </span>
                <Switch checked={active} onCheckedChange={setActive} />
              </label>
            </CardContent>
          </Card>
        </div>
      </div>

      {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : initial.id ? "Save changes" : "Create flavour"}
        </Button>
        <Button type="button" variant="ghost" render={<Link href="/admin/products" />}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
