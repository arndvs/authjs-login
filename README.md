Start the app

```bash
npm run dev

```

Remove everything in the db

```bash
npx prisma migrate reset

```

Add new primsa fields in schema to node modules

```bash
npx prisma generate

```

Push fields to the db

```bash
npx prisma db push

```

Run Prisma Studio to view the current prisma database

```bash
npx prisma studio

```

OAuth Providers: /api/auth/providers

More Prisma Commands: https://www.prisma.io/docs/orm/reference/prisma-cli-reference#studio

Google OAuth: https://console.cloud.google.com/apis/credentials/oauthclient/

Github: OAuth https://github.com/settings/developers
