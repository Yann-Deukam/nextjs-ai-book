"use client";

import { useRef } from "react";
import { useForm, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, ImageIcon, X, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MAX_PDF_BYTES, VOICES } from "@/constants";
import { BookFormValues, DropzoneFieldProps } from "@/type";

/* ------------------------------------------------------------------ */
/* Schema                                                              */
/* ------------------------------------------------------------------ */

const voiceIds = VOICES.flatMap((g) => g.options.map((o) => o.id)) as [
  string,
  ...string[],
];

const bookFormSchema = z.object({
  pdf: z
    .custom<File>((v) => v instanceof File, { message: "Please upload a PDF file" })
    .refine((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"), {
      message: "File must be a PDF",
    })
    .refine((f) => f.size <= MAX_PDF_BYTES, { message: "PDF must be 50MB or less" }),
  cover: z
    .custom<File>((v) => v instanceof File, { message: "Cover must be an image" })
    .refine((f) => f.type.startsWith("image/"), { message: "Cover must be an image" })
    .optional(),
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or less"),
  author: z
    .string()
    .trim()
    .min(1, "Author name is required")
    .max(120, "Author name must be 120 characters or less"),
  voice: z.enum(voiceIds, { message: "Please choose a voice" }),
});

const serifStyle = { fontFamily: "Georgia, 'Times New Roman', serif" } as const;

/* ------------------------------------------------------------------ */
/* Loading overlay                                                     */
/* ------------------------------------------------------------------ */

function LoadingOverlay() {
  return (
    <div className="loading-wrapper" role="status" aria-live="polite">
      <div className="loading-shadow-wrapper bg-[#FBE9D5]">
        <div className="loading-shadow">
          <Loader2 className="loading-animation h-12 w-12 text-[#663820]" />
          <p className="loading-title" style={serifStyle}>
            Synthesizing your book
          </p>
          <p className="text-[#315B55]">This can take a few minutes. Please keep this tab open.</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Dropzone field (shared by PDF + cover image)                        */
/* ------------------------------------------------------------------ */



function DropzoneField({
  name,
  label,
  accept,
  icon,
  emptyText,
  hint,
  control,
}: DropzoneFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const file = field.value as File | undefined;

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          field.onChange(e.target.files?.[0]);
        };

        const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          e.stopPropagation();
          field.onChange(undefined);
          if (inputRef.current) inputRef.current.value = "";
        };

        return (
          <FormItem>
            <FormLabel className="form-label">{label}</FormLabel>
            <FormControl>
              <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleChange}
                onBlur={field.onBlur}
                name={field.name}
                className="sr-only"
                tabIndex={-1}
              />
            </FormControl>

            <div
              role="button"
              tabIndex={0}
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  inputRef.current?.click();
                }
              }}
              className={cn(
                "upload-dropzone cursor-pointer border-2 border-dashed border-(--border-medium) rounded-[6px] px-4 py-6 focus-visible:outline-2 focus-visible:outline-[#663820]",
                file && "upload-dropzone-uploaded",
              )}
            >
              {file ? (
                <div className="flex w-full items-center justify-between gap-3 px-2">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="upload-dropzone-icon mb-0! shrink-0">{icon}</span>
                    <div className="min-w-0">
                      <p className="upload-dropzone-text truncate text-[#663820]!">{file.name}</p>
                      <p className="upload-dropzone-hint">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemove}
                    aria-label={`Remove ${file.name}`}
                    className="upload-dropzone-remove"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <>
                  <span className="upload-dropzone-icon">{icon}</span>
                  <p className="upload-dropzone-text">{emptyText}</p>
                  <p className="upload-dropzone-hint">{hint}</p>
                </>
              )}
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Voice selector                                                      */
/* ------------------------------------------------------------------ */

function VoiceSelector({ control }: { control: Control<BookFormValues> }) {
  return (
    <FormField
      control={control}
      name="voice"
      render={({ field }) => (
        <FormItem className="space-y-6">
          <FormLabel className="form-label">Choose Assistant Voice</FormLabel>

          {VOICES.map((group) => (
            <div key={group.group} className="space-y-3">
              <p className="text-sm font-medium text-[#6F6A60]">{group.group}</p>
              <FormControl>
                <div
                  role="radiogroup"
                  className={cn(
                    "grid gap-4",
                    group.options.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2",
                  )}
                >
                  {group.options.map((voice) => {
                    const selected = field.value === voice.id;
                    return (
                      <label
                        key={voice.id}
                        className={cn(
                          "voice-selector-option items-start justify-start text-left",
                          selected ? "voice-selector-option-selected" : "voice-selector-option-default",
                        )}
                      >
                        <input
                          type="radio"
                          name={field.name}
                          value={voice.id}
                          checked={selected}
                          onChange={() => field.onChange(voice.id)}
                          onBlur={field.onBlur}
                          className="sr-only"
                        />
                        <span
                          aria-hidden
                          className={cn(
                            "mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                            selected ? "border-[#663820]" : "border-[#6F6A60]",
                          )}
                        >
                          {selected && <span className="h-2 w-2 rounded-full bg-[#663820]" />}
                        </span>
                        <span className="flex flex-col gap-1">
                          <span className="text-lg font-semibold text-[#0F3D3A]">{voice.name}</span>
                          <span className="text-sm text-[#315B55]">{voice.description}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </FormControl>
            </div>
          ))}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Main form                                                           */
/* ------------------------------------------------------------------ */

export function UploadForm({
  onSubmit,
}: {
  onSubmit?: (values: BookFormValues) => Promise<void> | void;
}) {
  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: "",
      author: "",
      voice: "rachel",
    },
    mode: "onTouched",
  });

  const { isSubmitting } = form.formState;

  const handleSubmit = async (values: BookFormValues) => {
    await onSubmit?.(values);
  };

  return (
    <div className="new-book-wrapper">
      {isSubmitting && <LoadingOverlay />}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-8"
          noValidate
        >
          <DropzoneField
            control={form.control}
            name="pdf"
            label="Book PDF File"
            accept="application/pdf,.pdf"
            icon={<Upload className="h-12 w-12 text-[#8A4A45]" />}
            emptyText="Click to upload PDF"
            hint="PDF file (max 50MB)"
          />

          <DropzoneField
            control={form.control}
            name="cover"
            label="Cover Image (Optional)"
            accept="image/*"
            icon={<ImageIcon className="h-12 w-12 text-[#8A4A45]" />}
            emptyText="Click to upload cover image"
            hint="Leave empty to auto-generate from PDF"
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-label">Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="ex: Rich Dad Poor Dad"
                    disabled={isSubmitting}
                    className="form-input border-0 shadow-soft-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-label">Author Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="ex: Robert Kiyosaki"
                    disabled={isSubmitting}
                    className="form-input border-0 shadow-soft-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <VoiceSelector control={form.control} />

          <button
            type="submit"
            disabled={isSubmitting}
            className="form-btn bg-[#663820]! hover:bg-[#4E2A18]! disabled:opacity-60"
            style={serifStyle}
          >
            {isSubmitting ? "Synthesizing…" : "Begin Synthesis"}
          </button>
        </form>
      </Form>
    </div>
  );
}

export default UploadForm;