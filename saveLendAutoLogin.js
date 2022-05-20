// ==UserScript==
// @name         SaveLend Auto Login
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically login to SaveLend
// @author       Lukas Wiklund
// @match        https://invest.savelend.se/
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
	const response = await fetch(
		"https://reloansys-prod.azurewebsites.net/api/savelend/account/begin-credential-login",
		{
			method: "POST",
			mode: "cors",
			credentials: "include",
			headers: {
				accept: "application/json",
				"content-type": "application/json",
			},
			body: JSON.stringify({
				Username: config.username,
				Password: config.password,
			}),
		}
	)

	if (!response.ok) return

	const { access_token } = await response.json()

	const totpResponse = await fetch(
		"https://reloansys-prod.azurewebsites.net/api/savelend/account/finalize-credential-login",
		{
			method: "POST",
			headers: {
				accept: "application/json",
				authorization: `Bearer ${access_token}`,
				"content-type": "application/json",
			},
			body: JSON.stringify({ AuthCode: new jsOTP.totp().getOtp(config.totpToken) }),
		}
	)

	if (!response.ok) return

	const data = await totpResponse.json()

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

main()
