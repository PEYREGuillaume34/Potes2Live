import { test, expect } from "@playwright/test";

test.describe("Authentification - Parcours complets", () => {
  test("inscription avec champs valides peut être soumis", async ({
    page,
  }) => {
    await page.goto("/register");

    // Remplir le formulaire
    await page.getByLabel("Nom complet").fill("Test User");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Mot de passe").fill("password123");

    // Vérifier que le bouton est cliquable
    const submitBtn = page.getByRole("button", { name: /S'inscrire/i });
    await expect(submitBtn).toBeEnabled();
    
    // Vérifier que les champs sont bien remplis
    await expect(page.getByLabel("Nom complet")).toHaveValue("Test User");
    await expect(page.getByLabel("Email")).toHaveValue("test@example.com");
  });

  test("login avec champs vides affiche les validations HTML5", async ({
    page,
  }) => {
    await page.goto("/login");

    const submitBtn = page.getByRole("button", { name: /Se connecter/i });
    await submitBtn.click();

    // Les champs required empêchent la soumission
    const emailInput = page.getByLabel("Email");
    const validationMessage = await emailInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );

    expect(validationMessage).toBeTruthy(); // Message de validation natif
  });

  test("mot de passe trop court affiche erreur de validation", async ({
    page,
  }) => {
    await page.goto("/register");

    const passwordInput = page.getByLabel("Mot de passe");
    await passwordInput.fill("123"); // Moins de 8 caractères

    // Vérifier l'attribut minLength
    await expect(passwordInput).toHaveAttribute("minLength", "8");

    // Tenter de soumettre
    const submitBtn = page.getByRole("button", { name: /S'inscrire/i });
    await submitBtn.click();

    // Le navigateur bloque la soumission
    const validationMessage = await passwordInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage
    );
    expect(validationMessage).toBeTruthy();
  });

  test("navigation entre login et register préserve le contexte", async ({
    page,
  }) => {
    // Aller sur login
    await page.goto("/login");
    await expect(
      page.getByRole("heading", { name: /CONNECTION/i })
    ).toBeVisible();

    // Cliquer sur "S'inscrire"
    await page.getByRole("link", { name: /S'inscrire/i }).click();

    // Vérifier la page register
    await expect(page).toHaveURL(/\/register/);
    await expect(
      page.getByRole("heading", { name: /INSCRIPTION/i })
    ).toBeVisible();

    // Retour vers login
    await page.getByRole("link", { name: /Se connecter/i }).click();

    // Vérifier retour login
    await expect(page).toHaveURL(/\/login/);
    await expect(
      page.getByRole("heading", { name: /CONNECTION/i })
    ).toBeVisible();
  });

  test("formulaire login contient les bons types d'inputs", async ({
    page,
  }) => {
    await page.goto("/login");

    const emailInput = page.getByLabel("Email");
    const passwordInput = page.getByLabel("Mot de passe");

    // Vérifier les types
    await expect(emailInput).toHaveAttribute("type", "email");
    await expect(passwordInput).toHaveAttribute("type", "password");

    // Vérifier required
    await expect(emailInput).toHaveAttribute("required");
    await expect(passwordInput).toHaveAttribute("required");
  });

  test("formulaire register a le bon placeholder et contraintes", async ({
    page,
  }) => {
    await page.goto("/register");

    const nameInput = page.getByLabel("Nom complet");
    const emailInput = page.getByLabel("Email");
    const passwordInput = page.getByLabel("Mot de passe");

    // Vérifier placeholders
    await expect(nameInput).toHaveAttribute("placeholder", "Marie Dupont");
    await expect(emailInput).toHaveAttribute(
      "placeholder",
      "marie@exemple.com"
    );

    // Vérifier que le message d'info mdp est affiché
    await expect(page.getByText("Minimum 8 caractères")).toBeVisible();

    // Vérifier contrainte minLength
    await expect(passwordInput).toHaveAttribute("minLength", "8");
  });

  test("accessibility - labels correctement associés aux inputs", async ({
    page,
  }) => {
    await page.goto("/login");

    // Vérifier que cliquer sur le label focus l'input
    const emailLabel = page.locator('label[for="email"]');
    const emailInput = page.getByLabel("Email");

    await emailLabel.click();
    await expect(emailInput).toBeFocused();

    const passwordLabel = page.locator('label[for="password"]');
    const passwordInput = page.getByLabel("Mot de passe");

    await passwordLabel.click();
    await expect(passwordInput).toBeFocused();
  });
});
