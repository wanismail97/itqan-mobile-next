# Itqan Mobile Project Context

## Project Overview

This is the production ecommerce platform for Itqan Mobile.

Primary products:

- Telco prepaid SIM cards
- eSIM products
- Reload products
- Mobile devices
- Accessories
- Physical products

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Airtable CMS
- Airtable Reviews
- VPS Ubuntu
- Nginx

## Existing Features

- Product catalog
- Product detail pages
- Airtable product sync
- Airtable review sync
- Review approval workflow
- SEO friendly routes
- Dynamic product pages

## Important Rules

- Never change Airtable schema without explicit approval.
- Never remove existing review functionality.
- Never break production build.
- Always preserve TypeScript strict typing.
- Preserve current SEO routes.
- Preserve current Airtable integrations.

## Shipping Logic

Products use shipping classes:

- ringan
- pertengahan
- berat

Special rule:

- prepaid SIM cards and eSIM products are "ringan"
- shipping class must not break existing checkout flow
- shipping calculation should remain compatible with current system

## Coding Standards

- Use reusable components
- Keep code clean and production ready
- Avoid unnecessary dependencies
- Prefer server actions when appropriate
- Preserve backward compatibility
