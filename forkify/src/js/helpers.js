import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
	return new Promise(function (_, reject) {
		setTimeout(function () {
			reject(new Error(`Request took too long! Timeout after ${s} second`));
		}, s * 1000);
	});
};

export const AJAX = async (url, uploadData = undefined) => {
	try {
		const fetchPro = uploadData
			? await fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(uploadData),
			  })
			: await fetch(url);

		const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
		const data = await res.json();
		if (!res.ok) throw new Error(`${data.message} (${res.status})`);
		return data;
	} catch (e) {
		throw e;
	}
};

// export const getJSON = async url => {
// 	try {
// 		const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
// 		const data = await res.json();
// 		if (!res.ok) throw new Error(`${data.message} (${res.status})`);
// 		return data;
// 	} catch (e) {
// 		throw e;
// 	}
// };

// export const sendJSON = async (url, payload) => {
// 	try {
// 		const send = fetch(url, {
// 			method: 'POST',
// 			headers: {
// 				'Content-Type': 'application/json',
// 			},
// 			body: JSON.stringify(payload),
// 		});
//
// 		const res = await Promise.race([send, timeout(TIMEOUT_SEC)]);
// 		const data = await res.json();
// 		if (!res.ok) throw new Error(`${data.message} (${res.status})`);
// 		return data;
// 	} catch (e) {
// 		throw e;
// 	}
// };
