import { test, expect } from "@playwright/test";

test("generate a Wordle activity HTML file", async ({ page }) => {
  // Open the Wordle builder.
  await page.goto("/wordle");

  // Wait for database content to finish loading.
  await expect(
    page.getByText("Loading stored words...")
  ).toBeHidden();

  // Confirm that a database word is available.
  const targetWord = page.getByLabel("Target word");

  await expect(targetWord).toBeEnabled();

  // Change some activity settings like a real user.
  await page
    .getByLabel("Activity title")
    .fill("Playwright Wordle Test");

  await page
    .getByLabel("Difficulty")
    .selectOption("medium");

  // Confirm the live preview reflects the chosen title.
  await expect(
    page.getByRole("heading", {
      name: "Playwright Wordle Test",
    })
  ).toBeVisible();

  // Wait for the generated HTML download.
  const downloadPromise = page.waitForEvent("download");

  await page
    .getByRole("button", {
      name: "Generate HTML",
    })
    .click();

  const download = await downloadPromise;

  // Confirm the correct HTML file was generated.
  expect(download.suggestedFilename()).toBe(
    "phoneme-wordle.html"
  );
});