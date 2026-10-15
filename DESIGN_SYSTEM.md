# Website design system

The site should feel like a capable local consultant: clear services, concrete examples, and an easy way to get in touch. Keep the existing navy, warm gold, and sky-blue identity across public pages.

## Sources of truth

| Source                                              | What to change there                                                   |
| --------------------------------------------------- | ---------------------------------------------------------------------- |
| `src/styles.css`                                    | Public tokens, Tailwind theme, shared `web-*` styles, responsive rules |
| `src/components/marketing/design-system.tsx`        | `WebsiteBackdrop`, `WebsiteAction`, `WebsitePreview`                   |
| `src/components/marketing/marketing-navigation.tsx` | Desktop navigation and mobile drawer                                   |
| `src/components/ui/`                                | Local shadcn primitives                                                |
| `components.json`                                   | shadcn Base Nova preset, Base UI, Lucide icons, aliases                |
| `src/routes/_payload/custom.css`                    | CMS customizations using Payload theme tokens                          |
| `src/emails/components/theme.ts`                    | Email colors and fonts                                                 |
| `src/emails/components/EmailShell.tsx`              | Shared email layout                                                    |

Use the existing tokens and shared components before adding another variant. Keep design changes here in sync with the source.

## Color and theme

`.marketing-shell` maps the public palette onto shadcn semantic variables. Use semantic utilities such as `bg-background`, `text-foreground`, `border-border`, and `ring-ring` for components. Marketing compositions can use the named CSS variables directly.

| Token                         | Value                       | Use                                |
| ----------------------------- | --------------------------- | ---------------------------------- |
| `--marketing-ink`             | `#0b1326`                   | Page background                    |
| `--marketing-panel`           | `#131b2e`                   | Cards and raised surfaces          |
| `--marketing-panel-strong`    | `#2d3449`                   | Stronger secondary surfaces        |
| `--marketing-heading`         | `#dae2fd`                   | Headings and primary text          |
| `--marketing-copy`            | `#d1c6ab`                   | Body copy                          |
| `--marketing-copy-soft`       | `rgba(218, 226, 253, 0.7)`  | Secondary copy                     |
| `--marketing-gold`            | `rgb(255, 236, 185)`        | Primary actions and highlights     |
| `--marketing-gold-foreground` | `#3c2f00`                   | Text on gold actions               |
| `--marketing-sky`             | `#7bd0ff`                   | Eyebrows, focus, secondary accents |
| `--marketing-border`          | `rgba(255, 255, 255, 0.08)` | Subtle dividers                    |

Preserve the restrained gradients, fine blue outlines, angular frames, and decorative grid/arc backdrops. Share these through `WebsiteBackdrop` and existing frame classes. Decorative SVGs are hidden from assistive technology; keep their IDs unique through the `namespace` prop when repeated.

## Typography and layout

Geist Variable is the body font. DM Sans Variable is defined by `--font-heading` and used explicitly by public heading styles. The current Tailwind `font-heading` theme alias points to the sans token; use the existing heading classes to match public headings. Admin customizations use DM Sans.

- `.web-container`: centered, maximum 1320px, with responsive side margins.
- `.web-eyebrow`: small sky-blue uppercase label with wide tracking.
- `.web-heading`: fluid heading size, tight tracking, balanced wrapping.
- `.web-copy`: warm body copy, comfortable line height, controlled line length.
- `.web-cta`: gold primary action, generally at least 48px tall; use `WebsiteAction` for linked calls to action.
- `.web-text-link`: lighter inline action with an arrow and underline on hover.

Keep headings direct and body copy focused on client outcomes. Use the shared business content in `src/lib/website-content.json` rather than repeating contact details or service names in new components.

The home and service pages use asymmetric two-column compositions and framed website previews. Journal pages use one featured story followed by open article rows. Article pages have a narrow reading column, a byline/date/reading-time header, numbered sections, gold blockquotes, related reading, and a compact contact action. Body images preserve their aspect ratio and stay within the existing 440px height cap.

## Components and forms

Use shadcn components from `@/components/ui/` and compose them with Base UI APIs. The preset is `base-nova`, with Lucide icons. Do not introduce Radix-only `asChild` patterns into Base UI components; follow the installed component's `render` API. Use `cn()` from `@/lib/utils` for conditional classes.

Keep full Card composition where appropriate. Dialogs and drawers need an accessible title. Use `Alert` for feedback and `Separator` for component dividers. Buttons and linked actions should retain a visible focus state. Put button icons at `data-icon="inline-start"` or `data-icon="inline-end"` and let the component size them.

All forms use TanStack Form. Use the marketing contact form as the current reference:

- Compose `FieldGroup`, `Field`, `FieldLabel`, controls, descriptions, and `FieldError`.
- Connect labels with `htmlFor`/`id`, pass blur/change events through the form, and keep useful autocomplete/input types.
- Set `data-invalid` on the Field and `aria-invalid` on the control when errors should be shown.
- Normalize errors with `normalizeFieldErrors`; retain Zod validation on the server as well as the client.
- Show a pending state, disable duplicate submission, and announce success/errors accessibly.
- Keep phone formatting and inquiry choices consistent with the shared schema/content.

## Responsive behavior and accessibility

Read the relevant `web-*` rules before adding breakpoints. Common public breakpoints are 1100px, 800px, and 520px; journal sections also have their own intermediate breakpoints. Columns stack, navigation becomes a drawer, and heading/preview sizes adapt to available space.

Verify narrow phones and wide desktop layouts. Check keyboard navigation, visible focus, drawer scrolling/closing, contact validation/submission, and article navigation. Preserve reduced-motion rules and avoid making motion necessary to understand the page. Use descriptive alt text for content images, empty alt text for decoration, and meaningful link labels.

Blog Heading 2/3 content generates the “In this note” navigation with unique anchors. Keep the reading order usable when the sidebar moves above the article on mobile. See [CMS authoring](docs/CMS.md).

## Admin and email

The CMS keeps Payload's native views, sidebar, dashboard layout editor, and light/dark themes. Map custom studio components to Payload's `--color-*` tokens in `custom.css`; public navy/gold styling should not override the whole admin. Headshots have initials as a fallback, and submissions share staff read status.

Emails use React Email components from `react-email`, the shared `EmailShell`, and `emailTheme`. The email palette is light cream/white with gold accents and dark text; Arial/Helvetica fallbacks keep rendering predictable. Preview with `pnpm email:dev` and inspect actual local delivery in Mailpit. Avoid importing website CSS into email templates.
