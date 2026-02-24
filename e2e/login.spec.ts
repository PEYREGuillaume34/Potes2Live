import { test, expect } from "@playwright/test";

test.describe("Pages d'auth", () => {
  test("page login affiche le formulaire", async ({ page }) => {
    await page.goto("/login");

    await expect(
      page.getByRole("heading", { name: /CONNECTION/i })
    ).toBeVisible();

    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Mot de passe")).toBeVisible();
    await expect(page.getByRole("button", { name: /Se connecter/i })).toBeVisible();
    
    // Vérifier le lien vers l'inscription
    await expect(
      page.getByRole("link", { name: /S'inscrire/i })
    ).toBeVisible();
  });

  test("page register affiche le formulaire", async ({ page }) => {
    await page.goto("/register");

    await expect(
      page.getByRole("heading", { name: /INSCRIPTION/i })
    ).toBeVisible();

    await expect(page.getByLabel("Nom complet")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Mot de passe")).toBeVisible();
    await expect(page.getByRole("button", { name: /S'inscrire/i })).toBeVisible();

    // Vérifier le lien vers la connexion
    await expect(
      page.getByRole("link", { name: /Se connecter/i })
    ).toBeVisible();
  });

  test("peut naviguer entre login et register", async ({ page }) => {
    // Depuis login vers register
    await page.goto("/login");
    await page.getByRole("link", { name: /S'inscrire/i }).click();
    await expect(
      page.getByRole("heading", { name: /INSCRIPTION/i })
    ).toBeVisible();

    // Depuis register vers login
    await page.getByRole("link", { name: /Se connecter/i }).click();
    await expect(
      page.getByRole("heading", { name: /CONNECTION/i })
    ).toBeVisible();
  });

  test("validation du formulaire login", async ({ page }) => {
    await page.goto("/login");

    // Tenter de soumettre sans remplir les champs
    
    // Les inputs sont required, le navigateur empêche la soumission
    const emailInput = page.getByLabel("Email");
    await expect(emailInput).toHaveAttribute("required");
    
    const passwordInput = page.getByLabel("Mot de passe");
    await expect(passwordInput).toHaveAttribute("required");
  });

  test("validation du formulaire register", async ({ page }) => {
    await page.goto("/register");

    const nameInput = page.getByLabel("Nom complet");
    const passwordInput = page.getByLabel("Mot de passe");

    // Vérifier les attributs requis
    await expect(nameInput).toHaveAttribute("required");
    await expect(passwordInput).toHaveAttribute("required", "");
    
    // Vérifier que le mot de passe a minLength=8
    await expect(passwordInput).toHaveAttribute("minLength", "8");
  });
});
