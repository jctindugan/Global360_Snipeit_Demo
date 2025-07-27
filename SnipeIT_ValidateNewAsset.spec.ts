import { test, expect } from '@playwright/test';

test('Create and validate new Macbook Pro asset', async ({ page }) => {
  const serialNumber = `SN-${Math.floor(Math.random() * 100000)}`;
  const modelName = 'Laptops - Macbook Pro 13"';

  // Step 1: Login to the Snipe-It demo 
  await page.goto('https://demo.snipeitapp.com/login');
  await page.getByRole('textbox', { name: 'Username' }).fill('admin');
  await page.getByRole('textbox', { name: 'Password' }).fill('password');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('#success-notification').first()).toContainText('Success');

  // Step 2: Navigate to Create New Page
  await page.getByText('Create New', { exact: true }).click();

  // Step 3: Select 'Asset' 
  await page.getByRole('navigation').getByText('Asset', { exact: true }).click();

  // Step 4: Fill-out the new asset details
  await page.getByRole('textbox', { name: 'Serial' }).fill(serialNumber);
  await page.locator('#select2-model_select_id-container').click();
  await page.getByText(modelName).click();
  await page.getByLabel('Select Status').click();
  await page.getByRole('option', { name: 'Ready to Deploy' }).click();

  // Select first user dynamically from the dropdown 
  // Note: This is needed to avoid error when re-running script since specific employee would be unavailable after the initial run.
  await page.getByRole('combobox', { name: 'Select a User' }).click();
  const userOptions = page.locator('.select2-results__option');
  await expect(userOptions.first()).toBeVisible();
  await userOptions.first().click();

  // Step 5: Submit Asset form
  await page.locator('#submit_button').click();

  // Validate Asset Creation Success Message
  await expect(page.getByText('× Success: Asset with tag')).toBeVisible();

  // Step 6: Navigate to Assets List and Search for Created Asset
  await page.getByRole('link', { name: 'Assets view all' }).click();
  await page.getByRole('button', { name: 'Advanced search' }).click();
  await page.getByRole('textbox', { name: 'Serial' }).fill(serialNumber);
  await page.getByText('Close').click();

  // Step7: Open Asset Details page
  await page.getByRole('link', { name: serialNumber }).click();

  // Validate Asset Details
  await expect(page.locator('#details')).toContainText('Ready to Deploy');
  await expect(page.getByText(serialNumber)).toBeVisible();
  await expect(page.getByRole('link', { name: 'Macbook Pro 13"', exact: true })).toBeVisible();

  // Step 8: Navigate to History tab 
  await page.getByRole('link', { name: 'History' }).click();

  // Validate 'create new' entry exists
  const createNewRow = page.locator('table tbody tr', { hasText: 'create new' });
  await expect(createNewRow).toBeVisible();
  // Validate 'checkout' entry exists
  const checkoutRow = page.locator('table tbody tr', { hasText: 'checkout' });
  await expect(checkoutRow).toBeVisible();


 // Step 9: Logout Prodecure 
 // Note: This is important for smooth running of multiple test case in the future. 

 // Wait for UI to settle
  await page.waitForLoadState('networkidle');
  // Locate the Admin User in the top navigation (dropdown toggle)
  const adminUserLink = page.locator('nav a.dropdown-toggle', { hasText: 'Admin User' });
  await adminUserLink.click();
  // Now click Logout (after expanding sidebar if necessary)
  const sidebarToggle = page.locator('a.sidebar-toggle.btn.btn-white');
  if (await sidebarToggle.isVisible()) {
    await sidebarToggle.click();
    await page.waitForTimeout(500);
}

  // Trigger logout form submission via JS
  await page.evaluate(() => {
    const logoutForm = document.getElementById('logout-form') as HTMLFormElement;
    if (logoutForm) logoutForm.submit();
  });


});
