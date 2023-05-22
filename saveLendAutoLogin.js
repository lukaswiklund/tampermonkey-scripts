// ==UserScript==
// @name         SaveLend Auto Login
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically login to SaveLend
// @author       Lukas Wiklund
// @match        https://invest.savelend.se
// @match        https://invest.savelend.se/loginWith*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=savelend.se
// @require      https://jiangts.github.io/JS-OTP/dist/jsOTP.min.js
// @grant        none
// ==/UserScript==

const config = {
	username: "<< FILL IN >>",
	password: "<< FILL IN >>",
	totpToken: "<< FILL IN >>",
}

async function main() {
	if (!["/", "/loginWith"].includes(window.location.pathname)) return

	const { access_token } = await fetchAPI("/account/begin-credential-login", {
		method: "POST",
		body: { Username: config.username, Password: config.password },
	})

	const data = await fetchAPI("/account/finalize-credential-login", {
		method: "POST",
		headers: { authorization: `Bearer ${access_token}` },
		body: { AuthCode: new jsOTP.totp().getOtp(config.totpToken) },
	})

	window.sessionStorage.setItem(
		"savelend.usr.reloansys",
		JSON.stringify({
			access_token: data.access_token,
			token_type: data.token_type,
			expires_in: new Date(Date.now() + data.expires_in * 1000),
			refresh_token: data.refresh_token,
		})
	)

	window.location.href = "/dashboard/overview"
}

async function fetchAPI(url, options) {
	const response = await fetch("https://reloansys-prod.azurewebsites.net/api/savelend" + url, {
		method: options?.method ?? "GET",
		mode: "cors",
		credentials: "include",
		headers: {
			...options?.headers,
			accept: "application/json",
			"content-type": "application/json",
		},
		body: options?.body !== undefined ? JSON.stringify(options.body) : undefined,
	})
	if (!response.ok) {
		alert("Failed to sign in.")
		throw new Error("Failed to sign in.")
	}
	return response.json()
}

main()
