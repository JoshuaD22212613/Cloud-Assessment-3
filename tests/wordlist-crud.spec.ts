import { test, expect } from "@playwright/test";

test("create, edit and delete a word list", async ({ page }) => {
  const testListName = "Playwright Test List";
  const updatedListName = "Playwright Updated List";

  // Open the Settings page.
  await page.goto("/settings");

  // Wait for the existing word lists to finish loading.
  await expect(
    page.getByText("Loading word lists...")
  ).toBeHidden();

  // CREATE
  await page
    .getByLabel("Word List Name")
    .fill(testListName);

  await page
    .getByLabel("Description")
    .fill("Created automatically by Playwright");

  await page
    .getByRole("button", {
      name: "Create Word List",
    })
    .click();

  await expect(
    page.getByText("Word list created successfully.")
  ).toBeVisible();

  const createdList = page
    .locator(".selected-word")
    .filter({ hasText: testListName });

  await expect(
    createdList.getByRole("strong")
  ).toHaveText(testListName);

  // UPDATE
  await createdList
    .getByRole("button", { name: "Edit" })
    .click();

  await page
    .getByLabel("Word List Name")
    .fill(updatedListName);

  await page
    .getByRole("button", {
      name: "Update Word List",
    })
    .click();

  await expect(
    page.getByText("Word list updated successfully.")
  ).toBeVisible();

  const updatedList = page
    .locator(".selected-word")
    .filter({ hasText: updatedListName });

  await expect(
    updatedList.getByRole("strong")
  ).toHaveText(updatedListName);

  // DELETE
  page.once("dialog", async (dialog) => {
    await dialog.accept();
  });

  await updatedList
    .getByRole("button", { name: "Delete" })
    .click();

  await expect(
    page.getByText(
      `"${updatedListName}" deleted successfully.`
    )
  ).toBeVisible();

  await expect(updatedList).toHaveCount(0);
});