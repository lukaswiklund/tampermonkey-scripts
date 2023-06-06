// ==UserScript==
// @name         Avanza Auto Login
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically login to Avanza
// @author       Lukas Wiklund
// @match        https://www.avanza.se/*
// @icon         https://www.google.com/s2/favicons?domain=avanza.se
// @require      https://jiangts.github.io/JS-OTP/dist/jsOTP.min.js
// @grant        none
// ==/UserScript==

const config = {
	username: "<< FILL IN >>",
	password: "<< FILL IN >>",
	totpToken: "<< FILL IN >>",
}

async function main() {
	const response = await fetch("/_cqbe/authentication/session").then(x => x.json())
	if (response.user.loggedIn) return

	await fetchAPI("/authentication/sessions/usercredentials", {
		method: "POST",
		body: { username: config.username, password: config.password },
	})
	await fetchAPI("/authentication/sessions/totp", {
		method: "POST",
		body: { method: "TOTP", totpCode: new jsOTP.totp().getOtp(config.totpToken) },
	})

	window.location.href = "/hem/senaste.html"
}

async function fetchAPI(url, options) {
	const response = await fetch("/_api" + url, {
		method: options?.method ?? "GET",
		mode: "cors",
		credentials: "include",
		headers: { "Content-Type": "application/json;charset=UTF-8" },
		body: options?.body !== undefined ? JSON.stringify(options.body) : undefined,
	})
	if (!response.ok) {
		alert("Failed to sign in.")
		throw new Error("Failed to sign in.")
	}
}

main()
