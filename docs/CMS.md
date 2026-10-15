# Managing website content

## Admin workspace

The journal uses one featured story followed by open article rows. Blog **Topic** and **Summary** fields supply the category and introduction in these layouts; when Summary is blank, the first paragraph is used. The article header includes a byline, publication date, and calculated reading time. Section numbers, gold pull quotes (use the editor's Blockquote control), published related-reading links, and compact contact links follow the journal design. Portraits and other body images preserve their proportions and fit within a 440px maximum height. These presentation changes do not replace existing post content or images.

In a blog's sidebar, choose **Featured image** from Media to use it in the journal card and link previews. It is optional; articles without an image use the text layout. A draft change to the image stays private until the post is published. In Content, format section titles as **Heading 2** and subsections as **Heading 3** using the editor's heading menu. These generate the **In this note** navigation automatically, in document order, with unique anchor links and the current section highlighted while scrolling. Normal paragraphs and headings inside media captions are excluded. The navigation appears beside the reading column on desktop and above it on mobile; articles without section headings show no empty navigation. Existing posts and draft/version history are retained by the additive featured-image migration.

The studio dashboard keeps Payload’s native views, dashboard editor and sidebar tabs. Navigation is organized into Content, Business and Settings. A compact, theme-aware panel shows the greeting, actions and collection counts. Existing dashboard preferences can be updated with Dashboard → Reset Layout.

Users have an optional **Headshot** upload field linked to Media. Choose or upload an image and save the profile; it is used in the account menu, with initials when no image is available. Media storage and image processing follow the existing S3 and Sharp configuration. The additive SQLite migration preserves existing accounts and credentials.

Blogs expose Payload’s native **Live Preview** pane and preview link. Save a draft with a slug first, then toggle Live Preview; use **Open in new window** for the full website layout. Desktop, tablet and mobile sizes are available. Preview shows the latest saved draft and refreshes after editor saves. It uses the existing `PREVIEW_SECRET` and requires an authenticated Editor, Admin or Super Admin session. A preview cookie alone does not grant draft access. Preview pages show a notice with an exit link and `noindex` metadata. The preview link is private because it contains the shared preview secret.

The Business → Form submissions collection retains the existing `contacts` database collection and records. Valid public contact submissions are saved as unread before attempting React Email delivery. Delivery failures are logged without discarding the inquiry or asking the visitor to resubmit. Anonymous collection reads, writes and inbox actions are denied; editors and administrators can review submissions. The Notifications tab lists the newest 20 unread submissions, refreshes every 30 seconds and on window focus, and supports individual or displayed-batch read actions. Read status is shared across the staff team. Older records without a read flag count as unread. All submissions remain available in the collection, where the Read checkbox can also be cleared.

## Agent access through MCP

The official `@payloadcms/plugin-mcp` v4 plugin serves streamable HTTP at **`POST /api/mcp`**. After deployment, the production URL is **`https://www.mikecebul.com/api/mcp`**; locally use `http://localhost:3000/api/mcp`. No additional Dokploy environment variables, GitHub secrets, database migrations, or separate server are needed.

Standard tools are enabled for all four CMS collections: Blogs, Media, Form submissions (`contacts`), and Users. They include schema discovery, queries/counts, creation, editing, deletion, uploads, and version history/restoration where the collection supports them. The connecting user's collection and field permissions apply on every request, and authorship records that user. Anonymous requests have no tools. Password/login/reset tools remain at the plugin defaults; clients authenticate with their configured header.

To connect:

1. Deploy this change and sign in to `/admin` as a Super Admin. This role is needed for full access with the current collection permissions; other roles receive only their permitted tools.
2. Open **Settings → Users**, choose the account the agent should act as, and click **Generate new API key**. For a saved user, Payload persists the generated key immediately. Copy the key when shown. Generating another key replaces the previous one; **Revoke API key** disables the connection immediately.
3. Add an HTTP/streamable HTTP MCP server in your agent with the URL above and the header **`Authorization: users API-Key YOUR_GENERATED_KEY`**. Payload v4 uses this exact header format, not `Bearer`. The key belongs in the agent's local credential configuration, not the website's `.env`, GitHub secrets, or committed project files.
4. Reconnect/restart the client and ask it to list available collections or read the blog schema before editing.

For Codex, add the following to the user configuration (`~/.codex/config.toml`, accessible from MCP settings). Supply `PAYLOAD_MCP_AUTHORIZATION=users API-Key YOUR_GENERATED_KEY` in the environment of the process that launches Codex. An environment variable in the website container or an unrelated shell is not sufficient for the desktop app.

```toml
[mcp_servers.website]
url = "https://www.mikecebul.com/api/mcp"
env_http_headers = { Authorization = "PAYLOAD_MCP_AUTHORIZATION" }
```

If your client offers a headers field instead, enter `Authorization` and the complete `users API-Key ...` value there. Keep the key private. The server supports POST streamable HTTP; opening the MCP URL in a browser uses GET and returns 405 by design. Uploads support file/base64 inputs; fetching media from a remote URL requires a configured `upload.pasteURL.allowList`.

References: [Payload v4 MCP](https://github.com/payloadcms/payload/blob/main/docs/plugins/mcp.mdx), [Codex MCP configuration](https://learn.chatgpt.com/docs/extend/mcp).
