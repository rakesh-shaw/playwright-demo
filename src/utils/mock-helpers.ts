import type { Page, Route, Request } from '@playwright/test';

export const json = (data: unknown) => JSON.stringify(data);

/** Fulfill with JSON body and status (default 200). */
export async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    status,
    contentType: 'application/json',
    body: json(body)
  });
}

/** Delay fulfillment to simulate slowness. */
export async function fulfillAfterDelay(route: Route, body: unknown, delayMs = 3000, status = 200) {
  await new Promise(res => setTimeout(res, delayMs));
  await fulfillJson(route, body, status);
}

/** Route handler factory for success with fixed list. */
export function successTodosHandler(todos: { id: number; title: string; completed?: boolean }[]) {
  return async (route: Route) => fulfillJson(route, todos, 200);
}

/** Route handler for empty list. */
export function emptyTodosHandler() {
  return async (route: Route) => fulfillJson(route, [], 200);
}

/** Route handler for error with status and message. */
export function errorHandler(status = 500, message = 'Internal error') {
  return async (route: Route) => fulfillJson(route, { error: message }, status);
}

/** Timeout/never fulfill (forces fetch to hang until test timeout). */
export async function neverFulfill(_route: Route, _request: Request) {
  // Intentionally do nothing: simulates network stall/timeout.
}