import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import i18n from "@/i18n";
import LanguageToggle from "./LanguageToggle";

describe("LanguageToggle", () => {
	beforeEach(async () => {
		window.localStorage.clear();
		await act(async () => {
			await i18n.changeLanguage("en");
		});
	});

	it("lists all supported languages and switches on selection", async () => {
		render(<LanguageToggle />);
		const user = userEvent.setup();

		const trigger = screen.getByRole("button", {
			name: /language: english/i,
		});
		expect(trigger).toHaveTextContent("EN");

		await user.click(trigger);
		expect(
			await screen.findByRole("menuitemradio", {
				name: "繁體中文",
			}),
		).toBeInTheDocument();

		const vietnamese = await screen.findByRole("menuitemradio", {
			name: "Tiếng Việt",
		});
		await user.click(vietnamese);

		await waitFor(() => {
			expect(i18n.language).toBe("vi");
		});
		expect(window.localStorage.getItem("locale")).toBe("vi");
	});

	it("loads Traditional Chinese translations and persists the selection", async () => {
		render(<LanguageToggle />);
		const user = userEvent.setup();

		await user.click(
			screen.getByRole("button", { name: /language: english/i }),
		);
		await user.click(
			await screen.findByRole("menuitemradio", { name: "繁體中文" }),
		);

		await waitFor(() => {
			expect(i18n.language).toBe("zh-TW");
		});
		expect(window.localStorage.getItem("locale")).toBe("zh-TW");
		expect(document.documentElement.lang).toBe("zh-TW");
		expect(i18n.t("login.signIn", { ns: "auth" })).toBe("登入");
		expect(i18n.getResource("zh-TW", "auth", "login.signIn")).toBe("登入");
	});
});
