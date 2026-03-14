import { test as base, APIRequestContext, request } from '@playwright/test';

type ApiFixtures = {
  api: APIRequestContext;
  createdIds: { todos: number[]; users: number[] };
};

export const test = base.extend<ApiFixtures>({
  api: async ({}, use) => {
    const api = await request.newContext({
      baseURL: process.env.API_BASE_URL ?? 'https://your-app.example.com',
      ignoreHTTPSErrors: true
    });
    await use(api);
    await api.dispose();
  },

  createdIds: async ({}, use) => {
    const store = { todos: [], users: [] as number[] };
    await use(store);
  },
});
export { expect } from '@playwright/test';