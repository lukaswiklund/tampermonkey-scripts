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

;(async function () {
	const response = await fetch("/_api/personalization/is-customer-activated", {
		mode: "cors",
		credentials: "include",
		headers: {
			"Content-Type": "application/json;charset=UTF-8",
		},
	})

	if (response.ok) return

	await fetch("/_api/authentication/sessions/usercredentials", {
		method: "POST",
		mode: "cors",
		credentials: "include",
		headers: {
			"Content-Type": "application/json;charset=UTF-8",
		},
		body: JSON.stringify({
			username: config.username,
			password: config.password,
		}),
	})

	await fetch("/_api/authentication/sessions/totp", {
		method: "POST",
		mode: "cors",
		credentials: "include",
		headers: {
			"Content-Type": "application/json;charset=UTF-8",
		},
		body: JSON.stringify({
			method: "TOTP",
			totpCode: new jsOTP.totp().getOtp(config.totpToken),
		}),
	})

	window.location.href = "/hem/senaste.html"
})()
