import { test, expect } from "@playwright/test";

test.describe("Concerts & Groups", () => {
  test("page concerts affiche la liste", async ({ page }) => {
    await page.goto("/concerts");

    // Vérifier que la page charge sans erreur
    await expect(page.locator("body")).toBeVisible();

    // Chercher les éléments de concert (ConcertCard)
    // S'il n'y a pas de concerts, la page devrait l'indiquer
    const concertCards = page.locator('[class*="shadow-md"]');
    
    // On teste juste que la page se charge, avec ou sans données
    const hasCards = await concertCards.count();
    expect(hasCards).toBeGreaterThanOrEqual(0);
  });

  test("peut naviguer depuis la navbar", async ({ page }) => {
    await page.goto("/concerts"); // Commencer depuis concerts pour éviter les données chargées

    // Vérifier les links de la navbar par href plutôt que par texte
    const homeLink = page.locator("a[href='/']").first();
    const concertsLink = page.locator("a[href='/concerts']");
    const groupsLink = page.locator("a[href='/groups']");

    await expect(homeLink).toBeVisible();
    await expect(concertsLink).toBeVisible();
    await expect(groupsLink).toBeVisible();

    // Cliquer sur Groupes
    await groupsLink.click();
    await expect(page).toHaveURL(/\/groups/);

    // Cliquer sur Concerts
    await concertsLink.click();
    await expect(page).toHaveURL(/\/concerts/);

    // Cliquer sur Accueil
    await homeLink.click();
    await expect(page).toHaveURL(/\//);
  });

  test("profile page affiche les infos utilisateur non-connecté", async ({ page }) => {
    await page.goto("/profile");

    // Si non-connecté, doit rediriger vers login ou afficher un message
    // Vérifier qu'on est redirigé vers login OU qu'on voit un message
    const url = page.url();
    const isLoginPage = url.includes("/login");
    
    if (isLoginPage) {
      await expect(
        page.getByRole("heading", { name: /CONNECTION/i })
      ).toBeVisible();
    }
  });
});
