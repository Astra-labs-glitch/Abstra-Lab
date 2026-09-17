# Dashboard and CMS

Member area under `/dashboard`. Layout: `app/dashboard/layout.tsx`.

## Access

1. User must be logged in (`requireUser`).
2. Unauthenticated visitors redirect to `/accounts/login`.
3. Inactive users cannot establish a usable session after login.

Nav items for all members: Home, Events, Resources, Posts.  
**Staff** additionally see **Staff** (`/dashboard/staff`).

Role label in the shell: Member / Staff / Admin (`isSuperuser`).

## Member views

| Route                  | Purpose                     |
| ---------------------- | --------------------------- |
| `/dashboard`           | Home / overview             |
| `/dashboard/events`    | Club events (member-facing) |
| `/dashboard/resources` | Build materials / resources |
| `/dashboard/posts`     | Posts list for members      |

## Staff CMS (`/dashboard/staff`)

Staff can:

- **Approve / deactivate** members (`approveMember`, `deactivateMember`)
- **Create / update / delete** posts, events, and build materials
- Deep-link forms under:
  - `/dashboard/staff/posts/new`, `/dashboard/staff/posts/[id]`
  - `/dashboard/staff/events/new`, `/dashboard/staff/events/[id]`
  - `/dashboard/staff/resources/new`, `/dashboard/staff/resources/[id]`

Mutations are Next.js **server actions** in `app/dashboard/actions.ts`. Each action:

1. Calls `guardStaff()` (redirects to login if not staff)
2. Writes via Prisma
3. `revalidatePath` for dashboard + public listing routes
4. Redirects back to `/dashboard/staff` where appropriate

### Posts

- Slug is auto-generated from the title (`slugify`, max 50 chars)
- Fields: title, excerpt, content, featured image URL, published flag
- Public at `/posts` and `/posts/[slug]` when `published` is true

### Events

- Slug from title
- Fields: date label, summary, description, location, image URL, published
- Public at `/events`

### Resources (build materials)

- Fields: material type, name, summary, used-for, access notes, purchase URL, sort order, published
- Shown in the member resources area

### Images in CMS fields

Paste a path or URL. To host a new file:

1. `POST /api/upload` as staff (multipart `file`, optional `visibility=public`), or
2. Commit under `public/` and use a site-relative path

## Publishing checklist

1. Log in with a staff or master-admin account
2. Open **Dashboard → Staff**
3. Create content and leave **published** unchecked until ready
4. Preview public routes (`/posts`, `/events`)
5. Publish and confirm on [alsp.ca](https://alsp.ca)

Making someone staff after approval still requires flipping `is_staff` in the database — see [Authentication](./authentication.md).
