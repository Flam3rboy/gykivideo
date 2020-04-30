export default class E2EE {
	aesAlg = { name: "AES-GCM", iv: this.generateRandomValues(), length: 256 };

	get rsaAlg() {
		// return {
		// 	name: "RSA-OAEP",
		// 	modulusLength: 2048, // can be 1024, 2048 or 4096
		// 	publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
		// 	hash: "SHA-256", // or SHA-512
		// };
		return {
			name: "ECDH",
			namedCurve: "P-384",
		};
	}

	get pbkdf2Alg() {
		return {
			name: "PBKDF2",
			iterations: 2048,
			hash: "SHA-256",
		};
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
				.replace("-----BEGIN PRIVATE KEY-----", "")
				.replace("-----END PRIVATE KEY-----", "")
				.replace("-----BEGIN PUBLIC KEY-----", "")
				.replace("-----END PUBLIC KEY-----", "")
				.replace(/\n/g, "")
		);
	}

	async generateRSA() {
		return window.crypto.subtle.generateKey(this.rsaAlg, true, ["deriveKey", "deriveBits"]);
	}

	async deriveSecretKey({ publicKey, privateKey }) {
		return window.crypto.subtle.deriveKey(
			{ name: "ECDH", public: publicKey },
			privateKey,
			{ name: "AES-GCM", length: 256 },
			false,
			["encrypt", "decrypt"]
		);
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
			["encrypt", "decrypt"]
		);

		return webKey;
	}

	generateRandomValues() {
		return new Uint8Array(12).map((x, i) => i * 2);
		// return window.crypto.getRandomValues(new Uint8Array(12));
	}

	async encryptRSAPrivateKeyWithAES({ rsa, aes }) {
		var arrayBufferPrivateKey = await this.exportPrivateKey(rsa);
		return window.crypto.subtle.encrypt(this.aesAlg, aes, arrayBufferPrivateKey);
	}

	async decryptRSAPrivateKeyWithAES({ encrypted, aes }) {
		return crypto.subtle.decrypt(this.aesAlg, aes, encrypted);
	}

	async exportPrivateKey(rsa) {
		return window.crypto.subtle.exportKey("pkcs8", rsa.privateKey);
	}

	async exportPublicKey(rsa) {
		return window.crypto.subtle.exportKey("spki", rsa.publicKey);
	}

	async exportAesKey(aes) {
		return window.crypto.subtle.exportKey("raw", aes);
	}

	async importPemKeys() {
		var privateKey = this.fromPem(localStorage.getItem("privatekey"));
		var publicKey = this.fromPem(localStorage.getItem("publickey"));
		publicKey = await window.crypto.subtle.importKey("spki", publicKey, this.rsaAlg, true, []);
		privateKey = await window.crypto.subtle.importKey("pkcs8", privateKey, this.rsaAlg, true, ["deriveKey"]);
		return { privateKey, publicKey };
	}

	async importPublicKey(key) {
		return window.crypto.subtle.importKey("spki", this.fromPem(key), this.rsaAlg, true, []);
	}
}

// Example e2ee message
/*
var e2ee = new E2EE();
var keys = await e2ee.importPemKeys();
var public = await e2ee.importPublicKey(
	`-----BEGIN PUBLIC KEY-----MHYwEAYHKoZIzj0CAQYFK4EEACIDYgAESqj1RYbjJeiUEQYu2DIOC1UGPegxafOE9A4sz7nPbp6UwcIp6WHArLv5HIYgserVxEPAnI/VMtk2328IM6W1gfe/cv/DgwE7x8LtUcPvx3OsK3MjAVmiG8fudZYf8uUL-----END PUBLIC KEY-----`
);
var secret = await e2ee.deriveSecretKey({ privateKey: keys.privateKey, publicKey: public });
var textCipher = await crypto.subtle.encrypt(e2ee.aesAlg, secret, new TextEncoder().encode("test"));
var encrypted = await crypto.subtle.decrypt(e2ee.aesAlg, secret, textCipher);
console.log("Encrypted: ", new TextDecoder().decode(encrypted));
*/
