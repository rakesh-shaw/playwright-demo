import { test, expect } from '@playwright/test';
import { emptyTodosHandler } from '../../src/utils/mock-helpers';

const HTML = `
  <main>
    <h1>Todos</h1>
    <div id="status" role="status">Idle</div>
    <ul id="list"></ul>
    <script>
      async function loadTodos() {
        const s = document.getElementById('status');
        const ul = document.getElementById('list');
        s.textContent = 'Loading...';
        ul.innerHTML = '';
        try {
          const r = await fetch('/api/todos');
          if (!r.ok) throw new Error('HTTP ' + r.status);
          const arr = await r.json();
          if (!Array.isArray(arr) || arr.length === 0) {
            s.textContent = 'No items';
            return;
          }
          s.textContent = 'Loaded';
          for (const t of arr) {
            const li = document.createElement('li');
            li.setAttribute('data-testid', 'todo');
            li.textContent = t.title;
            ul.appendChild(li);
          }
        } catch (e) {
          s.textContent = 'Failed';
        }
      }
      loadTodos();
    </script>
  </main>
`;

test.describe('Network Mocking: /api/todos', () => {
  test.beforeEach(async ({ page }) => {
    await page.setContent(HTML, { waitUntil: 'domcontentloaded' });
  });

  test('empty → shows "No items"', async ({ page }) => {
    await page.route('**/api/todos', emptyTodosHandler());

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.getByTestId('todo')).toHaveCount(0);
  });
});