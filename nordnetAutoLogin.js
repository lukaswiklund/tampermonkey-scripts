// ==UserScript==
// @name         Nordnet Auto Login
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically login to Nordnet
// @author       Lukas Wiklund
// @match        https://www.nordnet.se/loggain*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nordnet.se
// @grant        none
// ==/UserScript==

const config = {
	username: "<< FILL IN >>",
	password: "<< FILL IN >>",
}

async function main() {
	const response = await fetch("/api/2/authentication/basic/login", {
		method: "POST",
		mode: "cors",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			"client-id": "NEXT",
			"sub-client-id": "NEXT",
		},
		body: JSON.stringify({
			username: config.username,
			password: config.password,
		}),
	})

	if (!response.ok) return

	window.location.href = "/"
}

main()
