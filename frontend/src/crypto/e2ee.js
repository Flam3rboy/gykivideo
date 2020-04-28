export default class E2EE {
	aesAlg = { name: "AES-GCM", iv: this.generateRandomValues(), length: 256 };

	get rsaAlg() {
		return {
			name: "RSA-OAEP",
			modulusLength: 2048, // can be 1024, 2048 or 4096
			publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
			hash: "SHA-256", // or SHA-512
		};
	}

	get pbkdf2Alg() {
		return {
			name: "PBKDF2",
			iterations: 2048,
			hash: "SHA-256",
		};
	}

	async importPemKeys({ privateKey, publicKey }) {
		privateKey = this.fromPem(privateKey);
		publicKey = this.fromPem(publicKey);
		publicKey = await window.crypto.subtle.importKey("spki", publicKey, this.rsaAlg, true, ["encrypt", "decrypt"]);
		privateKey = await window.crypto.subtle.importKey("pkcs8", privateKey, this.rsaAlg, true, [
			"encrypt",
			"decrypt",
		]);
		return { privateKey, publicKey };
	}

	arrayBufferToBase64(arrayBuffer) {
		var byteArray = new Uint8Array(arrayBuffer);
		var byteString = "";
		for (var i = 0; i < byteArray.byteLength; i++) {
			byteString += String.fromCharCode(byteArray[i]);
		}
		var b64 = window.btoa(byteString);

		return b64;
	}

	base64ToArrayBuffer(base64) {
		var binary_string = window.atob(base64);
		var len = binary_string.length;
		var bytes = new Uint8Array(len);
		for (var i = 0; i < len; i++) {
			bytes[i] = binary_string.charCodeAt(i);
		}
		return bytes.buffer;
	}

	addNewLines(str) {
		var finalString = "";
		while (str.length > 0) {
			finalString += str.substring(0, 64) + "\n";
			str = str.substring(64);
		}

		return finalString;
	}

	toPem({ privateKey, publicKey }) {
		if (privateKey) {
			var b64 = this.addNewLines(this.arrayBufferToBase64(privateKey));
			var pem = "-----BEGIN PRIVATE KEY-----\n" + b64 + "-----END PRIVATE KEY-----";
		} else if (publicKey) {
			var b64 = this.addNewLines(this.arrayBufferToBase64(publicKey));
			var pem = "-----BEGIN PUBLIC KEY-----\n" + b64 + "-----END PUBLIC KEY-----";
		}

		return pem;
	}

	fromPem(key) {
		return this.base64ToArrayBuffer(
			key
				.replace("-----BEGIN PRIVATE KEY-----\n", "")
				.replace("-----END PRIVATE KEY-----", "")
				.replace("-----BEGIN PUBLIC KEY-----\n", "")
				.replace("-----END PUBLIC KEY-----", "")
				.replace(/\n/g, "")
		);
	}

	async generateRSA() {
		// Let's generate the key pair first
		var keyPair = await window.crypto.subtle.generateKey(this.rsaAlg, true, ["encrypt", "decrypt"]);

		// var publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
		// var privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
		// publicKey = this.toPem({ publicKey });
		// privateKey = this.toPem({ privateKey });
		return keyPair;
	}

	async wrapRSAKeyWithAES({ RSA, AES }) {
		var wrap = await crypto.subtle.wrapKey("jwk", RSA.privateKey, AES, this.aesAlg);
		console.log({ wrap, RSA, AES });

		var encryptedRSA = {
			privateKey: this.toPem({ privateKey: wrap }),
			wrap,
		};

		return encryptedRSA; //crypto.subtle.importKey("raw", wrap, this.aesAlg, true, ["encrypt", "decrypt"]);
	}

	generateRandomValues() {
		return new Uint8Array(12).map((x, i) => i * 2);
		// return window.crypto.getRandomValues(new Uint8Array(12));
	}

	async generateAES({ password, username }) {
		// salt should be Uint8Array or ArrayBuffer

		var encoder = new TextEncoder("utf-8");
		var saltBuffer = encoder.encode(username);
		var passphraseKey = encoder.encode(password); // converts text to Uint8array

		// You should firstly import your passphrase Uint8array into a CryptoKey
		var key = await window.crypto.subtle.importKey("raw", passphraseKey, this.pbkdf2Alg, false, ["deriveKey"]);

		var webKey = await window.crypto.subtle.deriveKey(
			{ ...this.pbkdf2Alg, salt: saltBuffer },
			key,
			this.aesAlg,
			true,
			["encrypt", "decrypt", "wrapKey", "unwrapKey"]
		);

		return webKey;
	}
}
