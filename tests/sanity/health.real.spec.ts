import { test, expect, request } from '@playwright/test';

test('real backend health: fetch jsonplaceholder todo', async () => {
  const ctx = await request.newContext({ baseURL: 'https://jsonplaceholder.typicode.com', ignoreHTTPSErrors: true });
  const res = await ctx.get('/todos/1');
  expect(res.ok()).toBeTruthy();
  const todo = await res.json();
  expect(todo).toHaveProperty('id', 1);
  await ctx.dispose();
});