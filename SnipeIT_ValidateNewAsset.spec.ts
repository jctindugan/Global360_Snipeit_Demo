import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  /*Navigate to Snipe-It demo website login page*/
  await page.goto('https://demo.snipeitapp.com/login');
  await page.getByRole('textbox', { name: 'Username' }).fill('admin');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('password');
  await page.getByRole('button', { name: 'Login' }).click();
  /*Validate that user was successfully logged in */ 
  await expect(page.locator('#success-notification')).toContainText('× Success: You have successfully logged in.');

  /*Create a new asset*/
  await page.getByText('Create New', { exact: true }).click();
  await page.getByRole('navigation').getByText('Asset', { exact: true }).click();

  await page.getByRole('textbox', { name: 'Serial' }).click();
  await page.getByRole('textbox', { name: 'Serial' }).fill('112233');
  await page.locator('#select2-model_select_id-container').click();
  await page.getByText('Laptops - Macbook Pro 13"').click();
  await page.getByLabel('Select Status').getByText('Select Status').click();
  await page.getByRole('option', { name: 'Ready to Deploy' }).click();
  await page.getByRole('combobox', { name: 'Select a User' }).locator('span').nth(2).click();
  await page.getByText('Bailey, Amiya (princess02) - #').click();
  await page.locator('#submit_button').click();
  /*Validate that new asset was successfully created*/
  await expect(page.getByText('× Success: Asset with tag')).toBeVisible();

  /*Navigate to the asset list*/
  await page.getByRole('link', { name: 'Assets view all' }).click();
  /*Use advance search using serial*/
  await page.getByRole('button', { name: 'Advanced search' }).click();
  await page.getByRole('textbox', { name: 'Serial' }).click();
  await page.getByRole('textbox', { name: 'Serial' }).fill('112233');
  await page.getByText('Close').click();
  await page.getByRole('link', { name: '112233' }).click();
  /*Validate that new asset details are correct*/
  await expect(page.locator('#details')).toContainText('Ready to Deploy Deployed Amiya Bailey');
  await expect(page.getByText('112233')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Macbook Pro 13"', exact: true })).toBeVisible();

  /*Navigate to the history tab*/
  await page.getByRole('link', { name: 'History' }).click();
  /*Validate that new asset has history of being created and checked out*/
  await expect(page.getByRole('cell', { name: 'create new' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'checkout' })).toBeVisible();
  await page.getByRole('navigation').getByRole('link', { name: 'Admin User' }).click();

  /*Logout*/
  await page.getByRole('link', { name: 'Logout' }).click();
  

});